import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CofreSenhaComponent } from './cofre-senha.component';

describe('CofreSenhaComponent', () => {
  let component: CofreSenhaComponent;
  let fixture: ComponentFixture<CofreSenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CofreSenhaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CofreSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
