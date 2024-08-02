"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalStatus = exports.TriggerPipeLineDialogStep = exports.PipelineType = void 0;
var PipelineType;
(function (PipelineType) {
    PipelineType[PipelineType["Terraform"] = 0] = "Terraform";
    PipelineType[PipelineType["WebApp"] = 1] = "WebApp";
    PipelineType[PipelineType["FuncApp"] = 2] = "FuncApp";
    PipelineType[PipelineType["CMS"] = 3] = "CMS";
    PipelineType[PipelineType["Standalone"] = 4] = "Standalone";
})(PipelineType || (exports.PipelineType = PipelineType = {}));
var TriggerPipeLineDialogStep;
(function (TriggerPipeLineDialogStep) {
    TriggerPipeLineDialogStep[TriggerPipeLineDialogStep["None"] = 0] = "None";
    TriggerPipeLineDialogStep[TriggerPipeLineDialogStep["SelectDefaultTemplate"] = 1] = "SelectDefaultTemplate";
    TriggerPipeLineDialogStep[TriggerPipeLineDialogStep["EditManifestVersion"] = 2] = "EditManifestVersion";
    TriggerPipeLineDialogStep[TriggerPipeLineDialogStep["CallingEndpoint"] = 3] = "CallingEndpoint";
})(TriggerPipeLineDialogStep || (exports.TriggerPipeLineDialogStep = TriggerPipeLineDialogStep = {}));
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["all"] = "all";
    ApprovalStatus["approved"] = "approved";
    ApprovalStatus["canceled"] = "canceled";
    ApprovalStatus["completed"] = "completed";
    ApprovalStatus["failed"] = "failed";
    ApprovalStatus["pending"] = "pending";
    ApprovalStatus["rejected"] = "rejected";
    ApprovalStatus["skipped"] = "skipped";
    ApprovalStatus["timedOut"] = "timedOut";
    ApprovalStatus["undefined"] = "undefined";
    ApprovalStatus["uninitiated"] = "uninitiated";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
