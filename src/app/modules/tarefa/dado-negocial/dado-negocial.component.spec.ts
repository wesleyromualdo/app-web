import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadoNegocialComponent } from './dado-negocial.component';

describe('DadoNegocialComponent', () => {
  let component: DadoNegocialComponent;
  let fixture: ComponentFixture<DadoNegocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DadoNegocialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DadoNegocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
