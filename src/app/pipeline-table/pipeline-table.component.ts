import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PipelineType } from '../../../shared/enums';
import { ExtendedTable, Pipeline } from '../../../shared/types';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { TEMPLATE_URL } from '../../../shared/variables';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { TriggerPipelinesComponent } from '../dialog/trigger-pipelines/trigger-pipelines.component';
import { CreateApprovalJobComponent } from '../dialog/create-approval-job/create-approval-job.component';
import { CommonModule } from '@angular/common';
import { ListApprovalJobsComponent } from '../dialog/list-approval-jobs/list-approval-jobs.component';

@Component({
  selector: 'app-pipeline-table',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatCheckboxModule, MatButtonModule, MatMenuModule, MatIconModule, CommonModule],
  templateUrl: './pipeline-table.component.html',
  styleUrl: './pipeline-table.component.scss'
})
export class PipelineTableComponent implements OnChanges {
  @Input() public type!: PipelineType;
  @Input() public pipelines: Pipeline[] = [];
  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['index', 'id', 'name', 'isPending', 'selected'];
  dataSource = new MatTableDataSource<Partial<ExtendedTable>>([]);
  selection = new SelectionModel<Partial<ExtendedTable>>(true, []);
  Variables = TEMPLATE_URL;

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource.data = this.pipelines;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Partial<ExtendedTable>): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id! + 1}`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleTriggerPipelines(pipelines: Partial<ExtendedTable>[]): void {
    this.dialog.open(TriggerPipelinesComponent, {
      width: "800px",
      enterAnimationDuration: "500ms",
      exitAnimationDuration: "200ms",
      data: {
        pipelines,
        type: this.type
      }
    })
  }

  handleCreateNewJob(pipelines: Partial<ExtendedTable>[]): void {
    this.dialog.open(CreateApprovalJobComponent, {
      width: "800px",
      data: {
        pipelines
      }
    })
  }

  handleGetAllJobs(): void {
    this.dialog.open(ListApprovalJobsComponent, {
      minWidth: 1000,
      data: {
        pipelines: this.pipelines
      }
    })
  }
}
