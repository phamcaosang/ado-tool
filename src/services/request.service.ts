import { ConfigurationService } from './configuration.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pipeline } from '../shared/types';
import { TemplateUrl } from '../shared/variables';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private baseUrl = TemplateUrl.BASE_URL;
  constructor(private http: HttpClient, private configService: ConfigurationService) {
    this.configService.config$.subscribe(({ organization, project }) => {
      this.baseUrl = TemplateUrl.BASE_URL.replace("{organization}", organization).replace("{project}", project)
    })
  }

  public getPipeline(pipelineId: string): Observable<Pipeline> {
    const url = this.baseUrl + TemplateUrl.GET_A_PIPELINE_PATH.replace("{pipelineId}", pipelineId);
    return this.http.get<Pipeline>(url);
  }

  public getPipelines(): Observable<Pipeline[]> {
    const url = this.baseUrl + TemplateUrl.LIST_PIPELINES_PATH;
    return this.http.get<Pipeline[]>(url);
  }
}
