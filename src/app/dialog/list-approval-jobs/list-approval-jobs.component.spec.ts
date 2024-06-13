import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListApprovalJobsComponent } from './list-approval-jobs.component';

describe('ListApprovalJobsComponent', () => {
  let component: ListApprovalJobsComponent;
  let fixture: ComponentFixture<ListApprovalJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListApprovalJobsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListApprovalJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
