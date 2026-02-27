import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentEnquiries } from './recent-enquiries';

describe('RecentEnquiries', () => {
  let component: RecentEnquiries;
  let fixture: ComponentFixture<RecentEnquiries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentEnquiries]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentEnquiries);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
