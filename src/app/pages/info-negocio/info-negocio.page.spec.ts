import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoNegocioPage } from './info-negocio.page';

describe('InfoNegocioPage', () => {
  let component: InfoNegocioPage;
  let fixture: ComponentFixture<InfoNegocioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoNegocioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
