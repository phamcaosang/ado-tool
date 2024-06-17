import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ADOResponse, Pipeline, Run, TrigerPipelinePayload, TriggerPipelineJob, TriggerPipelineJobInterval } from '../../shared/types';
import { CONFIGS, TEMPLATE_URL } from '../../shared/variables';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private baseUrl = TEMPLATE_URL.BASE_URL;
  constructor(private http: HttpClient) { }

  public getPipeline(pipelineId: string): Observable<Pipeline> {
    const url = this.baseUrl + TEMPLATE_URL.GET_A_PIPELINE_PATH.replace("{pipelineId}", pipelineId);
    return this.http.get<Pipeline>(url);
  }

  public getPipelines(): Observable<Pipeline[]> {
    const url = this.baseUrl + TEMPLATE_URL.LIST_PIPELINES_PATH;
    return this.http.get<ADOResponse<Pipeline[]>>(url).pipe(
      map(data => data.value.filter(x => x.folder.includes("WebApps") || x.folder.includes('FunctionApps') || x.folder.includes('StandaloneApps') || x.folder.includes('CMS'))),
      map(data => data.map(x => ({
        ...x,
        isFunctionApp: x.folder.includes("FunctionApps"),
        isWebApp: x.folder.includes('WebApps'),
        isCMS: x.folder.includes('CMS'),
        isStandalone: x.folder.includes('StandaloneApps')
      })))
    )
  }

  public triggerPipeline(pipelineId: string, payload: TrigerPipelinePayload): Observable<Run> {
    const url = this.baseUrl + TEMPLATE_URL.RUN_SINGLE_PIPELINE_PIPELINE_PATH.replace("{pipelineId}", pipelineId);
    return this.http.post<Run>(url, payload);
  }

  public getJobs(): Observable<TriggerPipelineJobInterval[]>{
    const url = `http://localhost:${CONFIGS.bePort}${CONFIGS.paths.getJobs}`;
    return this.http.get<TriggerPipelineJobInterval[]>(url);
  }

  public createJob(payload: TriggerPipelineJob): Observable<TriggerPipelineJobInterval>{
    const url = `http://localhost:${CONFIGS.bePort}${CONFIGS.paths.createJob}`;
    return this.http.post<TriggerPipelineJobInterval>(url, payload);
  }

  public deleteJob(id: string): Observable<void>{
    const url = `http://localhost:${CONFIGS.bePort}${CONFIGS.paths.deleteJob}`
    return this.http.delete<void>(url.replace(':id', id));
  }
}
