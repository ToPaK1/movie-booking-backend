import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Shows } from './shows';

describe('Shows', () => {
  let component: Shows;
  let fixture: ComponentFixture<Shows>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shows],
    }).compileComponents();

    fixture = TestBed.createComponent(Shows);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
