import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadosJsonComponent } from './dados-json.component';

describe('DadosJsonComponent', () => {
  let component: DadosJsonComponent;
  let fixture: ComponentFixture<DadosJsonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DadosJsonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DadosJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
