import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    // Mock para BreakpointObserver
    const mockBreakpointObserver = jasmine.createSpyObj('BreakpointObserver', ['observe']);
    // Por defecto, no es handset
    mockBreakpointObserver.observe.and.returnValue(of({ matches: false }));

    await TestBed.configureTestingModule({
      imports: [ NavbarComponent ],
      providers: [
        provideRouter([], withComponentInputBinding()),
        { provide: BreakpointObserver, useValue: mockBreakpointObserver,  },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the navbar component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the sidenav container', () => {
    const sidenavContainer = fixture.debugElement.query(By.css('mat-sidenav-container'));
    expect(sidenavContainer).toBeTruthy();
  });

  it('should render the navigation links', () => {
    const links = fixture.debugElement.queryAll(By.css('mat-nav-list a[mat-list-item]'));
    const linkTexts = links.map(link => link.nativeElement.textContent.trim());
    expect(linkTexts).toContain('Form');
    expect(linkTexts).toContain('Data table');
  });

  it('should show the menu button in handset mode', () => {
    const breakpointObserver = TestBed.inject(BreakpointObserver) as jasmine.SpyObj<BreakpointObserver>;
    breakpointObserver.observe.and.returnValue(of({
      matches: true,
      breakpoints: {
        '(max-width: 599px)': true
      }
    }));
    fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();

    const menuButton = fixture.debugElement.query(By.css('button[mat-icon-button]'));
    expect(menuButton).toBeTruthy();
  });

  it('should not show the menu button in desktop mode', () => {
    const menuButton = fixture.debugElement.query(By.css('button[mat-icon-button]'));
    expect(menuButton).toBeFalsy();
  });

  it('should have a router-outlet', () => {
    const outlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(outlet).toBeTruthy();
  });
});
