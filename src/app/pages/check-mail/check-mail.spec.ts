import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckMail } from './check-mail';

describe('CheckMail', () => {
  let component: CheckMail;
  let fixture: ComponentFixture<CheckMail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckMail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckMail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
