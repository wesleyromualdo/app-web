import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroExecutorComponent } from './cadastro-executor.component';

describe('CadastroExecutorComponent', () => {
  let component: CadastroExecutorComponent;
  let fixture: ComponentFixture<CadastroExecutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroExecutorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroExecutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
