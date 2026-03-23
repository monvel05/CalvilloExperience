import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TuristaInicioPage } from './turista-inicio.page';

describe('TuristaInicioPage', () => {
  let component: TuristaInicioPage;
  let fixture: ComponentFixture<TuristaInicioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TuristaInicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
