import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Buscador3Component } from './buscador3.component';

describe('Buscador3Component', () => {
  let component: Buscador3Component;
  let fixture: ComponentFixture<Buscador3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Buscador3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Buscador3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
