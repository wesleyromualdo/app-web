import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarefasFinalizadasComponent } from './tarefas-finalizadas.component';

describe('TarefasFinalizadasComponent', () => {
  let component: TarefasFinalizadasComponent;
  let fixture: ComponentFixture<TarefasFinalizadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarefasFinalizadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarefasFinalizadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
