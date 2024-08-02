import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterOutlet } from '@angular/router';
import { PipelineType } from '../../shared/enums';
import { AppConfig, Pipeline } from '../../shared/types';
import { RequestService } from './../services/request.service';
import { PipelineTableComponent } from './pipeline-table/pipeline-table.component';
import { CONFIGS } from '../../shared/variables';
import { forkJoin, interval, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatTabsModule, CommonModule, PipelineTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  isLoading = false;
  PipelineType = PipelineType;
  title = 'ado-web';
  config?: AppConfig;
  webAppPipelines: Pipeline[] = [];
  funcAppPipelines: Pipeline[] = [];
  cmsPipelines: Pipeline[] = [];
  terraformPipelines: Pipeline[] = [];
  standalonePipelines: Pipeline[] = [];
  webConfig?: AppConfig

  constructor(private readonly requestService: RequestService) { }

  ngOnInit(): void {
    this.config = CONFIGS;
    this.webConfig = {
      ...this.config,
      pat: 'sensitive'
    }
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;
    forkJoin({
      pipelines: this.requestService.getPipelines(),
      pendingApproval: this.requestService.getPendingApprovals()
    }).pipe(
      map(({ pipelines, pendingApproval}) => {
        return pipelines.map(x => {
          const approval = pendingApproval.find(a => a.pipeline.id === x.id.toString())
          if (approval){
            return {
              ...x,
              isPending: true,
              latestApprovalUrl: approval.pipeline.owner._links.web.href
            }
          }
          return x;
        })
      })
    ).subscribe((res) => {
      this.webAppPipelines = res.filter(x => x.isWebApp);
      this.funcAppPipelines = res.filter(x => x.isFunctionApp);
      this.cmsPipelines = res.filter(x => x.isCMS);
      this.standalonePipelines = res.filter(x => x.isStandalone);
      this.terraformPipelines = res.filter(x => x.isTerraform)
      this.isLoading = false;
    })
  }
}
