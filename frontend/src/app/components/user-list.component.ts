import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { EmptyStateComponent } from '../shared/empty-state.component';
import { ErrorMessageComponent } from '../shared/error-message.component';
import { LoadingComponent } from '../shared/loading.component';
import { CardComponent } from '../shared/card.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingComponent, ErrorMessageComponent, EmptyStateComponent, CardComponent],
  template: `
    <section class="user-list">
      <app-card title="Users" subtitle="Browse and manage backend users.">
        <div class="header-row">
          <a routerLink="/users/create" class="create-link">Add user</a>
        </div>

        <app-loading *ngIf="isLoading()"></app-loading>
        <app-error-message [message]="error()"></app-error-message>
        <app-empty-state *ngIf="!isLoading() && !error() && users().length === 0" message="No users found. Use the backend to add users or refresh the page."></app-empty-state>

        <ul *ngIf="!isLoading() && !error() && users().length > 0" class="user-items">
          <li *ngFor="let user of users()" class="user-item">
            <div>
              <a routerLink="/users/{{ user.id }}" class="user-link"><strong>{{ user.user }}</strong></a>
              <span>ID: {{ user.id }}</span>
            </div>
            <div class="item-meta">Age: {{ user.age }} • Role: {{ user.role }} • Active: {{ user.exists ? 'yes' : 'no' }}</div>
            <div class="action-row">
              <a routerLink="/users/{{ user.id }}/edit" class="edit-link">Edit</a>
              <button type="button" (click)="delete(user.id)" class="delete-button">Delete</button>
            </div>
          </li>
        </ul>

        <button type="button" (click)="reload()" class="reload-button">Refresh</button>
    </app-card>
  </section>
  `,
  styles: [
    ".user-list { max-width: 720px; margin: 0 auto; padding: 1rem; }",
    ".header-row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1rem; }",
    ".user-list h2 { margin: 0; font-size: 1.75rem; }",
    ".create-link { padding: 0.65rem 1rem; background: #2563eb; color: white; border-radius: 0.75rem; text-decoration: none; }",
    ".status-message, .error-message, .empty-state { margin-bottom: 1rem; padding: 0.9rem 1rem; border-radius: 0.75rem; }",
    ".error-message { background: #ffe4e6; color: #9b1c1c; }",
    ".empty-state { background: #f8fafc; color: #334155; }",
    ".user-items { list-style: none; padding: 0; margin: 0 0 1rem; display: grid; gap: 0.75rem; }",
    ".user-item { padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; display: grid; gap: 0.75rem; }",
    ".item-meta { color: #475569; font-size: 0.95rem; }",
    ".user-link { color: #2563eb; text-decoration: none; }",
    ".user-link:hover { text-decoration: underline; }",
    ".action-row { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.75rem; }",
    ".reload-button, .delete-button, .edit-link { padding: 0.75rem 1rem; border: none; border-radius: 0.75rem; cursor: pointer; }",
    ".reload-button { background: #2563eb; color: white; }",
    ".delete-button { background: #ef4444; color: white; }",
    ".edit-link { display: inline-flex; align-items: center; justify-content: center; background: #0f172a; color: white; text-decoration: none; }"
  ]
})
export class UserListComponent implements OnInit {
  private readonly userService = inject(UserService);

  readonly users = computed(() => this.userService.users());
  readonly isLoading = computed(() => this.userService.isLoading());
  readonly error = computed(() => this.userService.error());

  ngOnInit(): void {
    if (!this.userService.users().length) {
      this.userService.loadUsers();
    }
  }

  reload(): void {
    this.userService.loadUsers();
  }

  delete(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: () => this.userService.loadUsers(),
      error: (error) => this.userService.error.set(error.message || 'Unable to delete user.')
    });
  }
}
