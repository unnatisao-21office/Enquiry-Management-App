import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryCategory } from './enquiry-category';

describe('EnquiryCategory', () => {
  let component: EnquiryCategory;
  let fixture: ComponentFixture<EnquiryCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnquiryCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnquiryCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
