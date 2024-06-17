import axios from "axios";
import * as NodeCache from 'node-cache';
import { CONFIGS, TEMPLATE_URL } from "../shared/variables";
import { base64Encode } from "../shared/utils";
import { Approval, ApprovalsQueryResponse, TriggerPipelineJob, TriggerPipelineJobInterval } from "../shared/types";
import { ApprovalStatus } from "../shared/enums";

const token = base64Encode(CONFIGS.pat);

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
    createJob(job: TriggerPipelineJobInterval, storage: NodeCache): TriggerPipelineJobInterval {
        storage.set(job.id, job, job.duration);
        return job;
    },
    getJob(id: string, storage: NodeCache): TriggerPipelineJobInterval | undefined {
        return storage.get<TriggerPipelineJobInterval>(id);
    },
    listJobs(storage: NodeCache): TriggerPipelineJobInterval[] {
        const keys = storage.keys();
        return keys.map((x: string) => storage.get<TriggerPipelineJobInterval>(x)!)
    },
    deleteJob(id: string, storage: NodeCache): boolean {
        return storage.del(id) !== 0;
    }
};

const CustomCronJob = {
    create(job: TriggerPipelineJob, storage: NodeCache): TriggerPipelineJobInterval {
        const intervalId = setInterval(async () => {
            await RunJob(job.id, storage);
        }, job.interval * 1000);

        return {
            intervalId,
            ...job
        }
    },
    removeInterval(intervalId: NodeJS.Timeout): void {
        clearInterval(intervalId);
    }
}


const RunJob = async (id: string, storage: NodeCache): Promise<void> => {
    console.log("Start running job", id);
    const job = ApprovalPipelineJobStorage.getJob(id, storage);
    console.log("Job detail", job);

    if (job) {
        const pendingApprovals = await GetAllPendingApprovals();
        const approvalIds= pendingApprovals
            .filter(x => job.pipelineIds.includes(x.pipeline.id))
            .filter(x => new Date(x.createdOn) > new Date(job.createdAt))
            .map(x => x.id);
        await ApprovePipelines(approvalIds);
    }
};

function RemoveJob(id: string, storage: NodeCache) {
    const job = ApprovalPipelineJobStorage.getJob(id, storage);
    if (job) {
        ApprovalPipelineJobStorage.deleteJob(job.id, storage);
        CustomCronJob.removeInterval(job.intervalId);
    }
}

function CreateJob(job: TriggerPipelineJob, storage: NodeCache): TriggerPipelineJobInterval {
    const intervalJob = CustomCronJob.create(job, storage);
    return ApprovalPipelineJobStorage.createJob(intervalJob, storage);
}

function ListJob(storage: NodeCache): TriggerPipelineJobInterval[] {
    return ApprovalPipelineJobStorage.listJobs(storage);
}

module.exports = {
    RemoveJob,
    CreateJob,
    ListJob,
    CONFIGS
}