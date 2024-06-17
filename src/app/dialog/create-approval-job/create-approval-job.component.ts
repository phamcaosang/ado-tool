import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ExtendedTable, TriggerPipelineJob } from '../../../../shared/types';
import { RequestService } from '../../../services/request.service';
import { TEMPLATE_URL } from '../../../../shared/variables';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-approval-job',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogTitle, MatDialogContent, CommonModule, MatTableModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatError, ReactiveFormsModule],
  templateUrl: './create-approval-job.component.html',
  styleUrl: './create-approval-job.component.scss'
})
export class CreateApprovalJobComponent implements OnInit {
  isLoading = false;
  displayedColumns: string[] = ['id', 'name'];
  dataSource = new MatTableDataSource<Partial<ExtendedTable>>([]);
  Variables = TEMPLATE_URL;

  myForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      pipelines: Partial<ExtendedTable>[]
    },
    public dialogRef: MatDialogRef<CreateApprovalJobComponent>,
    private readonly requestService: RequestService,
    private fb: FormBuilder
  ) {
    this.myForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      duration: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1)]],
      interval: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    console.log(this.data.pipelines)
    this.dataSource.data = this.data.pipelines;
  }

  onSubmit() {
    if (this.myForm.valid) {
      this.isLoading = true;
      const {name, duration, interval} = this.myForm.value;
      const createdDate = new Date().toISOString();
      const job: TriggerPipelineJob = {
        id: createdDate,
        name,
        duration,
        interval,
        createdAt: createdDate,
        pipelineIds: this.data.pipelines.map(x => x.id!.toString())
      }
      this.requestService.createJob(job).subscribe(res => {
        console.log(res)
        this.isLoading = false;
        this.dialogRef.close();
      })
    }
  }

  get name() {
    return this.myForm.get('name');
  }

  get duration() {
    return this.myForm.get('duration');
  }

  get interval() {
    return this.myForm.get('interval');
  }
  
}
