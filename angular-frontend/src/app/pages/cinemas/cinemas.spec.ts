import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cinemas } from './cinemas';

describe('Cinemas', () => {
  let component: Cinemas;
  let fixture: ComponentFixture<Cinemas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cinemas],
    }).compileComponents();

    fixture = TestBed.createComponent(Cinemas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
