import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterOutlet } from '@angular/router';
import { PipelineType } from '../../shared/enums';
import { AppConfig, Pipeline } from '../../shared/types';
import { RequestService } from './../services/request.service';
import { PipelineTableComponent } from './pipeline-table/pipeline-table.component';
import { CONFIGS } from '../../shared/variables';

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
  standalonePipelines: Pipeline[] = [];

  constructor(private readonly requestService: RequestService) { }

  ngOnInit(): void {
    this.config = CONFIGS;
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;
    this.requestService.getPipelines().subscribe((res) => {
      this.webAppPipelines = res.filter(x => x.isWebApp);
      this.funcAppPipelines = res.filter(x => x.isFunctionApp);
      this.cmsPipelines = res.filter(x => x.isCMS);
      this.standalonePipelines = res.filter(x => x.isStandalone);
      this.isLoading = false;
    })
  }
}
