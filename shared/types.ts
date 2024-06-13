import { ApprovalStatus } from "./enums";

export interface Pipeline {
    _links: {
        self: {
            href: string;
        },
        web: {
            href: string
        }
    }
    configuration: PipelineConfiguration;
    folder: string;
    id: number;
    name: string;
    revision: number;
    url: string;
    isFunctionApp?: boolean;
    isWebApp?: boolean;
    isCMS?: boolean;
    isStandalone?: boolean;
    isTerraform?: boolean;
    manifestVersion?: string;
    dockerImageVersion?: string;
    isPending?: boolean;
    latestApprovalUrl?: string;
}

export interface PipelineConfiguration {
    designerHyphenJson: string;
    designerJson: string;
    justInTime: string;
    yaml: string;
}

export interface AppConfig {
    pat: string;
    templateParameters: {
        [key: string]: any
    };
    bePort: number;
    paths: {
        [key: string]: string;
    },
    [key: string]: any;  // Add more config properties as needed
}

export interface ADOResponse<T> {
    count: number;
    value: T
}

export interface ExtendedTable extends Pipeline {
    selected: boolean;
    disabled: boolean;
}

export interface Run {
    _links: any;
    createdDate: string;
    finalYaml: string;
    finishedDate: string;
    id: string;
    pipeline: PipelineReference;
    resources: any;
    result: RunResult;
    state: RunState;
    templateParameters: object;
    url: string;
    variables: Record<string, any>
}

export interface PipelineReference {
    folder: string;
    id: number;
    name: string;
    revision: number;
    url: string;
}

export type RunState = 'canceling' | 'completed' | 'inProgress' | 'unknown';

export type RunResult = 'canceled' | 'failed' | 'succeded' | 'unknown';

export interface TrigerPipelinePayload {
    previewRun: boolean;
    resources: {
        repositories: {
            self: {
                refName: string
            }
        }
    },
    templateParameters: {
        [key: string]: any
    }
}

export interface TriggerPipelineJob {
    id: string;
    name: string;
    duration: number; //minutes
    interval: number; //seconds
    createdAt: string; //time when the job is created/ only trigger pipelines created after this time;
    pipelineIds: string[]; //comma separated
}

export interface ApprovalsQueryResponse {
    count: number;
    value: Approval[]
}

export interface Approval {
    id: string;
    steps: any[];
    status: ApprovalStatus;
    createdOn: string;
    lastModifiedOn: string;
    instructions: string | undefined;
    minRequiredApprovers: number;
    executionOrder: 'anyOrder' | 'inSequence';
    blockedApprovers: any[];
    _links: {
        sekf: {
            href: string;
        }
    };
    pipeline: {
        id: string;
        name: string;
        owner: {
            _links: {
                web: {
                    href: string
                },
                self: {
                    href: string
                }
            }
        }
    }

}