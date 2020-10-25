import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncekitComponent } from './announcekit.component';

describe('AnnouncekitComponent', () => {
  let component: AnnouncekitComponent;
  let fixture: ComponentFixture<AnnouncekitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnouncekitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncekitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
