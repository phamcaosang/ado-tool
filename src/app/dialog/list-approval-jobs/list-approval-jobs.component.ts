import { MatIconModule } from '@angular/material/icon';
import { Component, Inject, OnInit } from '@angular/core';
import { RequestService } from '../../../services/request.service';
import { ExtendedTable, TriggerPipelineJob } from '../../../../shared/types';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { addMinutes } from 'date-fns';

@Component({
  selector: 'app-list-approval-jobs',
  standalone: true,
  imports: [MatIconModule, MatTableModule, MatDialogTitle, MatDialogContent, CommonModule, MatDialogActions, MatButtonModule, MatDialogClose],
  templateUrl: './list-approval-jobs.component.html',
  styleUrl: './list-approval-jobs.component.scss'
})
export class ListApprovalJobsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'interval', 'duration', 'createdAt','expireIn', 'id'];
  dataSource = new MatTableDataSource<TriggerPipelineJob & {
    expireIn: string
  }>([]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      pipelines: Partial<ExtendedTable>[]
    },
    public dialogRef: MatDialogRef<ListApprovalJobsComponent>,
    private readonly requestService: RequestService,
  ) {
  }

  ngOnInit(): void {
    this.getJobs();
  }

  getJobs(): void{
    this.requestService.getJobs().subscribe(res => {
      this.dataSource.data = res.map(x => ({
        ...x,
        expireIn: addMinutes(new Date(x.createdAt), x.duration).toISOString()
      }))
    })
  }

  handleDelete(id: string): void{
    const confirmed = window.confirm("Are you sure to delete this job")
    confirmed && this.requestService.deleteJob(id).subscribe(()=> {
      this.getJobs();
    })
  }
}
