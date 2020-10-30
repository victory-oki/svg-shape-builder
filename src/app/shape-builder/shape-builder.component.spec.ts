import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeBuilderComponent } from './shape-builder.component';

describe('ShapeBuilderComponent', () => {
  let component: ShapeBuilderComponent;
  let fixture: ComponentFixture<ShapeBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapeBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapeBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
