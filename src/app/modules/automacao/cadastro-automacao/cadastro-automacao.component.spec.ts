import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroAutomacaoComponent } from './cadastro-automacao.component';

describe('CadastroAutomacaoComponent', () => {
  let component: CadastroAutomacaoComponent;
  let fixture: ComponentFixture<CadastroAutomacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroAutomacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroAutomacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
