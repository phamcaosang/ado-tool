export class TemplateUrl {
    static BASE_URL = "https://dev.azure.com/nordeapensiondk/Application%20Migration";

    static GET_A_PIPELINE_PATH = "/_apis/pipelines/{pipelineId}?api-version=7.1-preview.1";
    static GET_A_PIPELINE_WITH_OPTIONAL_PARAMS_PATH = "/_apis/pipelines/{pipelineId}?pipelineVersion={pipelineVersion}&api-version={apiVersion}";

    static LIST_PIPELINES_PATH = "/_apis/pipelines?api-version=7.1-preview.1";
    static LIST_PIPELINES_WITH_OPTIONAL_PARAMS_PATH = "_apis/pipelines?orderBy={orderBy}&$top={$top}&continuationToken={continuationToken}&api-version={apiVersion}";

    static RUN_SINGLE_PIPELINE_PIPELINE_PATH = "/_apis/pipelines/{pipelineId}/runs?api-version=7.1-preview.1";

    static GOTO_SINGLE_PIPELINE = this.BASE_URL + "/_build?definitionId={pipelineId}"
}