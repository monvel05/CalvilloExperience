import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NegocioPresentacionPage } from './negocio-presentacion.page';

describe('NegocioPresentacionPage', () => {
  let component: NegocioPresentacionPage;
  let fixture: ComponentFixture<NegocioPresentacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NegocioPresentacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
