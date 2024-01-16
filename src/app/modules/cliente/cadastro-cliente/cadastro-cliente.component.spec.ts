import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroClienteComponent } from './cadastro-cliente.component';

describe('NovoClienteComponent', () => {
  let component: CadastroClienteComponent;
  let fixture: ComponentFixture<CadastroClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
