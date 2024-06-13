"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIGS = exports.TEMPLATE_URL = void 0;
exports.TEMPLATE_URL = {
    BASE_URL: "https://dev.azure.com/nordeapensiondk/Application%20Migration",
    GET_A_PIPELINE_PATH: "/_apis/pipelines/{pipelineId}?api-version=7.1-preview.1",
    GET_A_PIPELINE_WITH_OPTIONAL_PARAMS_PATH: "/_apis/pipelines/{pipelineId}?pipelineVersion={pipelineVersion}&api-version={apiVersion}",
    LIST_PIPELINES_PATH: "/_apis/pipelines?api-version=7.1-preview.1",
    LIST_PIPELINES_WITH_OPTIONAL_PARAMS_PATH: "_apis/pipelines?orderBy={orderBy}&$top={$top}&continuationToken={continuationToken}&api-version={apiVersion}",
    RUN_SINGLE_PIPELINE_PIPELINE_PATH: "/_apis/pipelines/{pipelineId}/runs?api-version=7.1-preview.1",
    UPDATE_APPROVAL_PATH: "/_apis/pipelines/approvals?api-version=7.1-preview.1",
    GET_ALL_APPROVALS_PATH: "/_apis/pipelines/approvals?api-version=7.1-preview.1&userIds={userIds}&state={state}",
    GET_APPROVALS_BY_ID_PATH: "/_apis/pipelines/approvals?api-version=7.1-preview.1&userIds={userIds}&state={state}&approvalIds={approvalIds}",
};
exports.CONFIGS = {
    pat: ":",
    users: {
        Emil: "f4b441bd-9946-65d2-8d0f-b3d2fe0299cb",
        Dung: "f802a995-c76c-6ffe-8536-8591c864b2b6",
        Sang: "de55026a-778e-6b42-b5e5-11cc5330f45c"
    },
    templateParameters: {
        versionManifest: "0.0.0",
        registerAPIM: "No",
        deployToDev: "False",
        deployToDev2: "False",
        deployToInt: "False"
    },
    bePort: 3009,
    paths: {
        getJobs: "/api/trigger-pipeline/job",
        createJob: "/api/trigger-pipeline/job",
        deleteJob: "/api/trigger-pipeline/job/:id"
    }
};
