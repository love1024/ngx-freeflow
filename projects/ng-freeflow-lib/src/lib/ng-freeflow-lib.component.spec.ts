import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgFreeflowLibComponent } from './ng-freeflow-lib.component';

describe('NgFreeflowLibComponent', () => {
  let component: NgFreeflowLibComponent;
  let fixture: ComponentFixture<NgFreeflowLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgFreeflowLibComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgFreeflowLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
