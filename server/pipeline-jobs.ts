import axios from "axios";
import * as NodeCache from 'node-cache';
import { CONFIGS, TEMPLATE_URL } from "../shared/variables";
import { base64Encode } from "../shared/utils";
import { Approval, ApprovalsQueryResponse, TriggerPipelineJob } from "../shared/types";
import { ApprovalStatus } from "../shared/enums";
import {addMinutes} from "date-fns"
const token = base64Encode(CONFIGS.pat);
let DATA: Record<string, NodeJS.Timeout> = {};

const GetAllPendingApprovals = async (): Promise<Approval[]> => {
    const url = TEMPLATE_URL.BASE_URL + 
        TEMPLATE_URL.GET_ALL_APPROVALS_PATH
            .replace("{userIds}", Object.values(CONFIGS.users).join(","))
            .replace("{state}", ApprovalStatus.pending);
            
    const res = await axios.get<ApprovalsQueryResponse>(url, {
        headers: {
            Authorization: `Basic ${token}`,
        }
    });

    return res.data.value;
}

const ApprovePipelines = (approvalIds: string[]) => {
    const url = TEMPLATE_URL.BASE_URL + TEMPLATE_URL.UPDATE_APPROVAL_PATH;
    const payload = approvalIds.map(id => ({
        approvalId: id,
        status: "approved",
        comment: "Approving"
    }));

    return axios.patch(url, payload, {
        headers: {
            Authorization: `Basic ${token}`
        }
    });
}

const ApprovalPipelineJobStorage = {
    createJob(job: TriggerPipelineJob, storage: NodeCache): TriggerPipelineJob {
        storage.set(job.id, job, job.duration*60);
        return job;
    },
    getJob(id: string, storage: NodeCache): TriggerPipelineJob | undefined {
        return storage.get<TriggerPipelineJob>(id);
    },
    listJobs(storage: NodeCache): TriggerPipelineJob[] {
        const keys = storage.keys();
        return keys.map((x: string) => storage.get<TriggerPipelineJob>(x)!)
    },
    deleteJob(id: string, storage: NodeCache): boolean {
        return storage.del(id) !== 0;
    }
};

const CustomCronJob = {
    create(job: TriggerPipelineJob, storage: NodeCache): void {
        const intervalId = setInterval(async () => {
            await RunJob(job.id, storage);
        }, job.interval * 1000);

        DATA[job.id] = intervalId;
    },
    removeInterval(jobId: string): void {
        clearInterval(DATA[jobId]);
        delete DATA[jobId];
    }
}


const RunJob = async (id: string, storage: NodeCache): Promise<void> => {
    const job = ApprovalPipelineJobStorage.getJob(id, storage);

    if (!job) {
        return;
    }

    if (addMinutes(job.createdAt, job.duration) < new Date()){
        RemoveJob(job.id, storage);
        console.log("Expire job", job)
        return;
    }

    console.log("Running Job detail", job, new Date());

    const pendingApprovals = await GetAllPendingApprovals();
    const approvalIds = pendingApprovals
        .filter(x => job.pipelineIds.includes(x.pipeline.id))
        .filter(x => new Date(x.createdOn) > new Date(job.createdAt))
        .map(x => x.id);
    console.log("Approval IDs", approvalIds);
    approvalIds.length > 0 && await ApprovePipelines(approvalIds);
};

function RemoveJob(id: string, storage: NodeCache) {
    const job = ApprovalPipelineJobStorage.getJob(id, storage);
    if (job) {
        ApprovalPipelineJobStorage.deleteJob(job.id, storage);
        CustomCronJob.removeInterval(job.id);
    }
}

function CreateJob(job: TriggerPipelineJob, storage: NodeCache): TriggerPipelineJob {
    CustomCronJob.create(job, storage);
    return ApprovalPipelineJobStorage.createJob(job, storage);
}

function ListJob(storage: NodeCache): TriggerPipelineJob[] {
    return ApprovalPipelineJobStorage.listJobs(storage);
}

module.exports = {
    RemoveJob,
    CreateJob,
    ListJob,
    CONFIGS,
    CustomCronJob
}