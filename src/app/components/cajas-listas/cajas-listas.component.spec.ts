import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajasListasComponent } from './cajas-listas.component';

describe('CajasListasComponent', () => {
  let component: CajasListasComponent;
  let fixture: ComponentFixture<CajasListasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CajasListasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CajasListasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
