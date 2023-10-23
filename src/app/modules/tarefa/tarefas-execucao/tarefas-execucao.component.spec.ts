import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarefasExecucaoComponent } from './tarefas-execucao.component';

describe('TarefasExecucaoComponent', () => {
  let component: TarefasExecucaoComponent;
  let fixture: ComponentFixture<TarefasExecucaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarefasExecucaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarefasExecucaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
