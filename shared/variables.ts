export const TEMPLATE_URL = {
    BASE_URL: "https://dev.azure.com/nordeapensiondk/Application%20Migration",
    GET_A_PIPELINE_PATH: "/_apis/pipelines/{pipelineId}?api-version=7.1-preview.1",
    GET_A_PIPELINE_WITH_OPTIONAL_PARAMS_PATH: "/_apis/pipelines/{pipelineId}?pipelineVersion={pipelineVersion}&api-version={apiVersion}",
    LIST_PIPELINES_PATH: "/_apis/pipelines?api-version=7.1-preview.1",
    LIST_PIPELINES_WITH_OPTIONAL_PARAMS_PATH: "_apis/pipelines?orderBy={orderBy}&$top={$top}&continuationToken={continuationToken}&api-version={apiVersion}",
    RUN_SINGLE_PIPELINE_PIPELINE_PATH: "/_apis/pipelines/{pipelineId}/runs?api-version=7.1-preview.1",
    UPDATE_APPROVAL_PATH: "/_apis/pipelines/approvals?api-version=7.1-preview.1"
}

export const CONFIGS = {
    pat: ":",
    templateParameters: {
        versionManifest: "0.0.0",
        registerAPIM: "No",
        deployToDev: "False",
        deployToDev2: "False",
        deployToInt: "False"
    }
}