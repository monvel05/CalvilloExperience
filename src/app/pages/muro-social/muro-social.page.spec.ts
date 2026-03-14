import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MuroSocialPage } from './muro-social.page';

describe('MuroSocialPage', () => {
  let component: MuroSocialPage;
  let fixture: ComponentFixture<MuroSocialPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MuroSocialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
