import axios from "axios";
import * as NodeCache from 'node-cache';
import { CONFIGS, TEMPLATE_URL } from "../shared/variables";
import { base64Encode } from "../shared/utils";
import { TriggerPipelineJob, TriggerPipelineJobInterval } from "../shared/types";

const ApprovePipelines = (approvalIds: string[]) => {
    const url = TEMPLATE_URL.BASE_URL + TEMPLATE_URL.UPDATE_APPROVAL_PATH;
    const token = base64Encode(CONFIGS.pat);
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
    const job = ApprovalPipelineJobStorage.getJob(id, storage);
    if (job) {
        const approvalIds = job.pipelineIds; //handle getApprovalId that need to run;
        await ApprovePipelines(approvalIds);
    }
};

export function RemoveJob(id: string, storage: NodeCache) {
    const job = ApprovalPipelineJobStorage.getJob(id, storage);
    if (job) {
        ApprovalPipelineJobStorage.deleteJob(job.id, storage);
        CustomCronJob.removeInterval(job.intervalId);
    }
}

export function CreateJob(job: TriggerPipelineJob, storage: NodeCache): TriggerPipelineJobInterval {
    const intervalJob = CustomCronJob.create(job, storage);
    return ApprovalPipelineJobStorage.createJob(intervalJob, storage);
}

export function ListJob(storage: NodeCache): TriggerPipelineJobInterval[] {
    return ApprovalPipelineJobStorage.listJobs(storage);
}