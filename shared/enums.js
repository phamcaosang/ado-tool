"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalStatus = exports.TriggerPipeLineDialogStep = exports.PipelineType = void 0;
var PipelineType;
(function (PipelineType) {
    PipelineType[PipelineType["WebApp"] = 0] = "WebApp";
    PipelineType[PipelineType["FuncApp"] = 1] = "FuncApp";
    PipelineType[PipelineType["CMS"] = 2] = "CMS";
    PipelineType[PipelineType["Standalone"] = 3] = "Standalone";
    PipelineType[PipelineType["Terraform"] = 4] = "Terraform";
})(PipelineType || (exports.PipelineType = PipelineType = {}));
var TriggerPipeLineDialogStep;
(function (TriggerPipeLineDialogStep) {
    TriggerPipeLineDialogStep[TriggerPipeLineDialogStep["SelectDefaultTemplate"] = 0] = "SelectDefaultTemplate";
    TriggerPipeLineDialogStep[TriggerPipeLineDialogStep["EditManifestVersion"] = 1] = "EditManifestVersion";
    TriggerPipeLineDialogStep[TriggerPipeLineDialogStep["CallingEndpoint"] = 2] = "CallingEndpoint";
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
