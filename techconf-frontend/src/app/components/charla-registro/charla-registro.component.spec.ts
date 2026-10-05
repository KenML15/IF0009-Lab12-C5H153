import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharlaRegistroComponent } from './charla-registro.component';

describe('CharlaRegistroComponent', () => {
  let component: CharlaRegistroComponent;
  let fixture: ComponentFixture<CharlaRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharlaRegistroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CharlaRegistroComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
