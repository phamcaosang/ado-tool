import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ADOResponse, Approval, ApprovalsQueryResponse, Pipeline, Run, TrigerPipelinePayload, TriggerPipelineJob } from '../../shared/types';
import { CONFIGS, TEMPLATE_URL } from '../../shared/variables';
import { ApprovalStatus } from '../../shared/enums';

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
      map(data => data.value.filter(x => x.folder.includes("WebApps") || x.folder.includes('FunctionApps') || x.folder.includes('StandaloneApps') || x.folder.includes('CMS') || x.folder.includes('Terraform'))),
      map(data => data.map(x => ({
        ...x,
        isFunctionApp: x.folder.includes("FunctionApps"),
        isWebApp: x.folder.includes('WebApps'),
        isCMS: x.folder.includes('CMS'),
        isStandalone: x.folder.includes('StandaloneApps'),
        isTerraform: x.folder.includes('Terraform')
      })))
    )
  }

  public getPendingApprovals(): Observable<Approval[]>{
    let url = this.baseUrl + TEMPLATE_URL.GET_ALL_APPROVALS_PATH;
    url = url.replace("{userIds}", Object.values(CONFIGS.users).join(","))
            .replace("{state}", ApprovalStatus.pending);

    return this.http.get<ApprovalsQueryResponse>(url).pipe(
      map(data => data.value)
    )
  }

  public triggerPipeline(pipelineId: string, payload: TrigerPipelinePayload): Observable<Run> {
    const url = this.baseUrl + TEMPLATE_URL.RUN_SINGLE_PIPELINE_PIPELINE_PATH.replace("{pipelineId}", pipelineId);
    return this.http.post<Run>(url, payload);
  }

  public getJobs(): Observable<TriggerPipelineJob[]>{
    const url = `http://${window.location.hostname}:${CONFIGS.bePort}${CONFIGS.paths.getJobs}`;
    return this.http.get<TriggerPipelineJob[]>(url);
  }

  public createJob(payload: TriggerPipelineJob): Observable<TriggerPipelineJob>{
    const url = `http://${window.location.hostname}:${CONFIGS.bePort}${CONFIGS.paths.createJob}`;
    return this.http.post<TriggerPipelineJob>(url, payload);
  }

  public deleteJob(id: string): Observable<void>{
    const url = `http://${window.location.hostname}:${CONFIGS.bePort}${CONFIGS.paths.deleteJob}`
    return this.http.delete<void>(url.replace(':id', id));
  }
}
