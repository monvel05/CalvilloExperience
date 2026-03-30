import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TuristaPerfilPage } from './turista-perfil.page';

describe('TuristaPerfilPage', () => {
  let component: TuristaPerfilPage;
  let fixture: ComponentFixture<TuristaPerfilPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TuristaPerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
