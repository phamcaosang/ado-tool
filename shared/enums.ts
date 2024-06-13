export enum PipelineType {
    Terraform,
    WebApp,
    FuncApp,
    CMS,
    Standalone
}

export enum TriggerPipeLineDialogStep {
    None,
    SelectDefaultTemplate,
    EditManifestVersion,
    CallingEndpoint
}

export enum ApprovalStatus {
    all = "all",
    approved = "approved",
    canceled = "canceled",
    completed = "completed",
    failed = "failed",
    pending = "pending",
    rejected = "rejected",
    skipped = "skipped",
    timedOut = "timedOut",
    undefined = "undefined",
    uninitiated = "uninitiated"
}
