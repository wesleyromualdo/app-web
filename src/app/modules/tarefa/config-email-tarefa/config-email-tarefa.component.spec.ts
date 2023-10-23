import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigEmailTarefaComponent } from './config-email-tarefa.component';

describe('ConfigEmailTarefaComponent', () => {
  let component: ConfigEmailTarefaComponent;
  let fixture: ComponentFixture<ConfigEmailTarefaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigEmailTarefaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigEmailTarefaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
