import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultDashComponent } from './default-dash.component';

describe('DefaultDashComponent', () => {
  let component: DefaultDashComponent;
  let fixture: ComponentFixture<DefaultDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultDashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
