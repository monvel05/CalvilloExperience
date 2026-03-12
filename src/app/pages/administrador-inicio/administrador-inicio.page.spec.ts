import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministradorInicioPage } from './administrador-inicio.page';

describe('AdministradorInicioPage', () => {
  let component: AdministradorInicioPage;
  let fixture: ComponentFixture<AdministradorInicioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministradorInicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
