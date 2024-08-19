import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControleExecucaoComponent } from './controle-execucao.component';

describe('ControleExecucaoComponent', () => {
  let component: ControleExecucaoComponent;
  let fixture: ComponentFixture<ControleExecucaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControleExecucaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControleExecucaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
