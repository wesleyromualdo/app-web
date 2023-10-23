import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoTarefaComponent } from './historico-tarefa.component';

describe('DetalhamentoTarefasComponent', () => {
  let component: HistoricoTarefaComponent;
  let fixture: ComponentFixture<HistoricoTarefaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricoTarefaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoTarefaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
