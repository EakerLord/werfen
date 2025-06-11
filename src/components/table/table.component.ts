import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../form/form.model';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-table',
  imports: [MatTableModule, MatButtonModule, DatePipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = ['username', 'date', 'enabled', 'actions'];
  dataSource: User[] = [];

  ngOnInit(): void {
    const usersString = localStorage.getItem('users');
    if (usersString) {
      this.dataSource = JSON.parse(usersString);
    }
  }

  deleteUser(username: string): void {
    this.dataSource = this.dataSource.filter(user => user.username !== username);
    localStorage.setItem('users', JSON.stringify(this.dataSource));
  }
}
