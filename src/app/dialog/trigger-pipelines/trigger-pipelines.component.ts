import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { catchError, forkJoin, of } from 'rxjs';
import { RequestService } from '../../../services/request.service';
import { PipelineType, TriggerPipeLineDialogStep } from '../../../../shared/enums';
import { ExtendedTable, TrigerPipelinePayload } from '../../../../shared/types';
import { CONFIGS, TEMPLATE_URL } from '../../../../shared/variables';

@Component({
  selector: 'app-trigger-pipelines',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogTitle, MatDialogContent, CommonModule, MatTableModule, MatProgressSpinnerModule],
  templateUrl: './trigger-pipelines.component.html',
  styleUrl: './trigger-pipelines.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TriggerPipelinesComponent implements OnInit {
  @ViewChild('editor', { static: true }) editorElement!: ElementRef;
  isLoading = false;
  isTerraformPipelines = false;
  step = TriggerPipeLineDialogStep.None;
  TriggerPipeLineDialogStep = TriggerPipeLineDialogStep;
  configData!: TrigerPipelinePayload;

  //Step 2
  displayedColumns: string[] = ['id', 'name', 'manifestVersion'];
  dataSource = new MatTableDataSource<Partial<ExtendedTable>>([]);
  Variables = TEMPLATE_URL;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      pipelines: Partial<ExtendedTable>[],
      type: PipelineType
    },
    public dialogRef: MatDialogRef<TriggerPipelinesComponent>,
    private readonly requestService: RequestService,
  ) {
  }

  ngOnInit(): void {
    let payloadConfig: TrigerPipelinePayload = {
      previewRun: false,
      resources: {
        repositories: {
          self: {
            refName: 'develop'
          }
        }
      },
      templateParameters: {
        ...CONFIGS.templateParameters
      }
    };

    if (this.data.type === PipelineType.Terraform) {
      this.isTerraformPipelines = true;
      payloadConfig.resources.repositories.self['refName'] = "master"
      payloadConfig.templateParameters = {}
    } else { 
      if (this.data.type === PipelineType.WebApp) {
        delete payloadConfig.templateParameters['registerAPIM'];
        this.step = TriggerPipeLineDialogStep.CallingEndpoint
      }  
      
      if (this.data.type === PipelineType.CMS || this.data.type === PipelineType.Standalone) {
        delete payloadConfig.templateParameters['versionManifest']
        delete payloadConfig.templateParameters['deployToDev2']
        payloadConfig.templateParameters = {
          dockerImageVersion: '0.0.0',
          ...payloadConfig.templateParameters,
        }
      }

      this.step = TriggerPipeLineDialogStep.SelectDefaultTemplate
    }

    this.editorElement.nativeElement.value = JSON.stringify(payloadConfig);

    this.dataSource.data = this.data.pipelines;
  }

  handleOk(): void {
    if(this.isTerraformPipelines) {
      this.step = TriggerPipeLineDialogStep.CallingEndpoint;
      this.editorElement.nativeElement.style.display = 'none';
      this.isLoading = true;
      const request = this.data.pipelines.map(pl => this.requestService.triggerPipeline(pl.id!.toString(), {
        ...this.configData,
        resources: {
          repositories: {
              self: {
                  refName: pl.name === 'tf-websswp apply' ? 'master' : 'main'
              }
          }
        },
        templateParameters: {}
      }).pipe((
        catchError((err) => {
          console.error(`Error triggering pipeline ${pl.name} ${pl.id} }`, err);
          return of(null);
        })
      )));
      forkJoin(request).subscribe(
        (res) => {
          console.log(res);
          this.isLoading = false;
          this.dialogRef.close();
        },
        (err) => {
          console.error("Error in folkJoin", err)
          this.isLoading = false;
        })
    }

    if (this.step === TriggerPipeLineDialogStep.SelectDefaultTemplate) {
      this.step = TriggerPipeLineDialogStep.EditManifestVersion;
      this.configData = JSON.parse(this.editorElement.nativeElement.value);
      this.editorElement.nativeElement.style.display = 'none';
      this.dataSource.data = this.dataSource.data.map(x => ({
        ...x,
        manifestVersion: this.configData.templateParameters['versionManifest'] ?? undefined,
        dockerImageVersion: this.configData.templateParameters['dockerImageVersion'] ?? undefined,
      }));
      this.data.pipelines = this.dataSource.data;
      this.dialogRef.updateSize("1400px");
      return;
    }

    if (this.step === TriggerPipeLineDialogStep.EditManifestVersion) {
      this.step = TriggerPipeLineDialogStep.CallingEndpoint;
      this.isLoading = true;
      const request = this.data.pipelines.map(pl => this.requestService.triggerPipeline(pl.id!.toString(), {
        ...this.configData,
        templateParameters: {
          ...this.configData.templateParameters,
          versionManifest: pl.manifestVersion ?? undefined,
          dockerImageVersion: pl.dockerImageVersion ?? undefined,
          deployToDev: pl.name === 'app-web-hd_pdf_js' ? 'False' : undefined
        }
      }).pipe((
        catchError((err) => {
          console.error(`Error triggering pipeline ${pl.name} ${pl.id} }`, err);
          return of(null);
        })
      )));
      forkJoin(request).subscribe(
        (res) => {
          console.log(res);
          this.isLoading = false;
          this.dialogRef.close();
        },
        (err) => {
          console.error("Error in folkJoin", err)
          this.isLoading = false;
        })
    }
  }

  onManifestChange(element: Partial<ExtendedTable>, input: any): void {
    this.data.pipelines = this.data.pipelines.map(x => {
      if (x.id === element.id) {
        return {
          ...x,
          manifestVersion: input.value
        }
      }
      return x;
    })
  }

  onDockerImageVersionChange(element: Partial<ExtendedTable>, input: any): void {
    this.data.pipelines = this.data.pipelines.map(x => {
      if (x.id === element.id) {
        return {
          ...x,
          dockerImageVersion: input.value
        }
      }
      return x;
    })
  }
}
