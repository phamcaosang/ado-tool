import { RequestService } from './../services/request.service';
import { ConfigurationService } from './../services/configuration.service';
import { PipelineType } from './../shared/enums';
import { Component, OnInit, Pipe } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { PipelineTableComponent } from './pipeline-table/pipeline-table.component';
import { AppConfig, Pipeline } from '../shared/types';
import { CommonModule } from '@angular/common';

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
  pipelines: Pipeline[] = [];

  constructor(public readonly configService: ConfigurationService, private readonly requestService: RequestService) { }

  ngOnInit(): void {
    this.configService.initConfig();
    this.configService.config$?.subscribe((config) => {
      this.config = config;
      this.fetchData();
    });
  }

  fetchData(): void {
    this.isLoading = true;
    this.requestService.getPipelines().subscribe((res) => {
      this.pipelines.push(...res);
      console.log(res)
      this.isLoading = false;
    })
  }
}
