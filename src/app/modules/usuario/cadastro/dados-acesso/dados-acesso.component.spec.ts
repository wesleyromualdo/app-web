import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadosAcessoComponent } from './dados-acesso.component';

describe('DadosAcessoComponent', () => {
  let component: DadosAcessoComponent;
  let fixture: ComponentFixture<DadosAcessoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DadosAcessoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DadosAcessoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
