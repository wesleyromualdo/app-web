import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoExecucaoComponent } from './historico-execucao.component';

describe('HistoricoExecucaoComponent', () => {
  let component: HistoricoExecucaoComponent;
  let fixture: ComponentFixture<HistoricoExecucaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricoExecucaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoExecucaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
