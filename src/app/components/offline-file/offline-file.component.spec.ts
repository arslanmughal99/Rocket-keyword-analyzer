import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineFileComponent } from './offline-file.component';

describe('OfflineFileComponent', () => {
  let component: OfflineFileComponent;
  let fixture: ComponentFixture<OfflineFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
