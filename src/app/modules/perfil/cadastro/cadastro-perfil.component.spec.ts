import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroPerfilComponent } from './cadastro-perfil.component';

describe('NovoPerfilComponent', () => {
  let component: CadastroPerfilComponent;
  let fixture: ComponentFixture<CadastroPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroPerfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
