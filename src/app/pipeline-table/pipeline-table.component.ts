import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PipelineType } from '../../shared/enums';
import { Pipeline } from '../../shared/types';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';


export interface ExtendedTable extends Pipeline {
  selected: boolean;
  disabled: boolean;
}

const ELEMENT_DATA: Partial<ExtendedTable>[] = [
  {
    id: 1,
    name: 'Build',
    folder: 'Build',
    url: 'https://dev.azure.com/organization/project/_build?definitionId=1',
  }
];

@Component({
  selector: 'app-pipeline-table',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatCheckboxModule],
  templateUrl: './pipeline-table.component.html',
  styleUrl: './pipeline-table.component.scss'
})
export class PipelineTableComponent {
  @Input() public type!: PipelineType;
  displayedColumns: string[] = ['id', 'name', 'url', 'selected'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  selection = new SelectionModel<Partial<ExtendedTable>>(true, []);

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
}
