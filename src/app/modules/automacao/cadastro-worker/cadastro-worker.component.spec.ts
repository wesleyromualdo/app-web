import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroWorkerComponent } from './cadastro-worker.component';

describe('CadastroWorkerComponent', () => {
  let component: CadastroWorkerComponent;
  let fixture: ComponentFixture<CadastroWorkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroWorkerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
