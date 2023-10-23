import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarSenhaComponent } from './editar-senha.component';

describe('EditarSenhaComponent', () => {
  let component: EditarSenhaComponent;
  let fixture: ComponentFixture<EditarSenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarSenhaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
