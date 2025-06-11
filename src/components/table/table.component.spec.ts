import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, DatePipe } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  const mockUsers = [
    { username: 'alice', date: '2025-06-10T00:00:00Z', enabled: true, password: 'passw0rd', repeatPassword: 'passw0rd' },
    { username: 'bob', date: '2025-06-11T00:00:00Z', enabled: false, password: 'passw0rd', repeatPassword: 'passw0rd' }
  ];

  beforeEach(async () => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'users') {
        return JSON.stringify(mockUsers);
      }
      return null;
    });
    spyOn(localStorage, 'setItem').and.stub();

    await TestBed.configureTestingModule({
      imports: [MatTableModule, MatButtonModule, TableComponent, CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fixture.detectChanges();
  });

  it('should create the component', () => { expect(component).toBeTruthy() });

  it('should load users from localStorage on init', () => {
    expect(component.dataSource.length).toBe(2);
    expect(component.dataSource[0].username).toBe('alice');
    expect(component.dataSource[1].username).toBe('bob');
  });

  it('should render 2 rows', () => {
    const rows = fixture.debugElement.queryAll(By.css('tr[mat-row]'));
    expect(rows.length).toBe(2);
  });

  it('should display formatted data', () => {
    const firstRowCells = fixture.debugElement.queryAll(By.css('tr[mat-row]'))[0].queryAll(By.css('td'));
    expect(firstRowCells[0].nativeElement.textContent.trim()).toBe('alice');
    expect(firstRowCells[1].nativeElement.textContent.trim()).toBe('10/06/2025');
    expect(firstRowCells[2].nativeElement.textContent.trim()).toBe('Yes');
  });

  it('should call deleteUser and update the table when Delete is clicked', () => {
    spyOn(component, 'deleteUser').and.callThrough();
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.queryAll(By.css('.table-users__actions button'))[0];
    deleteButton.nativeElement.click();
    fixture.detectChanges();

    expect(component.deleteUser).toHaveBeenCalledWith('alice');
    expect(component.dataSource.length).toBe(1);
    expect(component.dataSource[0].username).toBe('bob');
  });
});


