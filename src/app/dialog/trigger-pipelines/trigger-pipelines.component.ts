import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ExtendedTable, TrigerPipelinePayload } from '../../../shared/types';
import { ConfigurationService } from '../../../services/configuration.service';
import { TriggerPipeLineDialogStep } from '../../../shared/enums';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TemplateUrl } from '../../../shared/variables';
import { RequestService } from '../../../services/request.service';
import { forkJoin } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  step = TriggerPipeLineDialogStep.SelectDefaultTemplate;
  TriggerPipeLineDialogStep = TriggerPipeLineDialogStep;
  configData!: TrigerPipelinePayload;

  //Step 2
  displayedColumns: string[] = ['id', 'name', 'manifestVersion'];
  dataSource = new MatTableDataSource<Partial<ExtendedTable>>([]);
  Variables = TemplateUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      pipelines: Partial<ExtendedTable>[]
    },
    public dialogRef: MatDialogRef<TriggerPipelinesComponent>,
    private readonly configService: ConfigurationService,
    private readonly requestService: RequestService
  ) {
  }

  ngOnInit(): void {
    this.editorElement.nativeElement.value = JSON.stringify({
      previewRun: false,
      resources: {
        repositories: {
          self: {
            refName: 'develop'
          }
        }
      },
      templateParameters: this.configService.getConfig().templateParameters
    });
    this.dataSource.data = this.data.pipelines;
  }

  handleOk(): void {
    if (this.step === TriggerPipeLineDialogStep.SelectDefaultTemplate) {
      this.step = TriggerPipeLineDialogStep.EditManifestVersion;
      this.configData = JSON.parse(this.editorElement.nativeElement.value);
      this.editorElement.nativeElement.style.display = 'none';
      this.dataSource.data = this.dataSource.data.map(x => ({
        ...x,
        manifestVersion: this.configData.templateParameters['versionManifest']
      }));
      this.data.pipelines = this.dataSource.data;
      this.dialogRef.updateSize("1400px");
      return;
    }

    if (this.step === TriggerPipeLineDialogStep.EditManifestVersion){
      this.step = TriggerPipeLineDialogStep.CallingEndpoint;
      this.isLoading = true;
      const request = this.data.pipelines.map(pl => this.requestService.triggerPipeline(pl.id!.toString(), {
        ...this.configData,
        templateParameters: {
          ...this.configData.templateParameters,
          versionManifest: pl.manifestVersion
        }
      }));
      forkJoin(request).subscribe((res)=>{
        console.log(res);
        this.isLoading = false;
        this.dialogRef.close();
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
}
