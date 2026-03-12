import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NegocioInicioPage } from './negocio-inicio.page';

describe('NegocioInicioPage', () => {
  let component: NegocioInicioPage;
  let fixture: ComponentFixture<NegocioInicioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NegocioInicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
