export interface Pipeline {
    _links: object;
    configuration: PipelineConfiguration;
    folder: string;
    id: number;
    name: string;
    revision: number;
    url: string;
}

export interface PipelineConfiguration {
    designerHyphenJson: string;
    designerJson: string;
    justInTime: string;
    yaml: string;
}

export interface AppConfig {
    organization: string;
    project: string;
    pat: string;
    [key: string]: any;  // Add more config properties as needed
}