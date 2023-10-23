import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenhaAcessoComponent } from './senha-acesso.component';

describe('SenhaAcessoComponent', () => {
  let component: SenhaAcessoComponent;
  let fixture: ComponentFixture<SenhaAcessoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SenhaAcessoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SenhaAcessoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
