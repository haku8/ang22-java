import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { CardComponent } from '../shared/card.component';
import { ErrorMessageComponent } from '../shared/error-message.component';
import { LoadingComponent } from '../shared/loading.component';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, LoadingComponent, ErrorMessageComponent],
  template: `
    <section class="user-detail">
      <app-card title="User details" subtitle="Review the selected backend user.">
        <app-loading *ngIf="isLoading()"></app-loading>
        <app-error-message [message]="error()"></app-error-message>

        <article *ngIf="user() as user" class="detail-card">
          <h2>{{ user.user }}</h2>
        <dl>
          <div>
            <dt>ID</dt>
            <dd>{{ user.id }}</dd>
          </div>
          <div>
            <dt>Age</dt>
            <dd>{{ user.age }}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{{ user.role }}</dd>
          </div>
          <div>
            <dt>Last access</dt>
            <dd>{{ user.lastAccess }}</dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>{{ user.createdAt }}</dd>
          </div>
          <div>
            <dt>Active</dt>
            <dd>{{ user.exists ? 'Yes' : 'No' }}</dd>
          </div>
        </dl>

        <div class="actions">
          <a routerLink="/users/{{ user.id }}/edit" class="primary-button">Edit</a>
          <a routerLink="/users" class="secondary-button">Back to list</a>
        </div>
      </article>
    </app-card>
  </section>
  `,
  styles: [
    ".user-detail { max-width: 720px; margin: 0 auto; padding: 1rem; }",
    ".status-message, .error-message { margin-bottom: 1rem; padding: 0.9rem 1rem; border-radius: 0.75rem; }",
    ".error-message { background: #fee2e2; color: #991b1b; }",
    ".detail-card { padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 1rem; background: white; }",
    ".detail-card h2 { margin-top: 0; margin-bottom: 1rem; font-size: 1.75rem; }",
    "dl { display: grid; gap: 0.75rem; margin: 0; }",
    "dt { font-weight: 700; color: #0f172a; }",
    "dd { margin: 0; color: #475569; }",
    ".actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1.5rem; }",
    ".primary-button, .secondary-button { padding: 0.75rem 1rem; border-radius: 0.75rem; text-decoration: none; color: white; }",
    ".primary-button { background: #2563eb; }",
    ".secondary-button { background: #e2e8f0; color: #0f172a; }"
  ]
})
export class UserDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);

  readonly user = signal<User | null>(null);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : 0;

    if (!id) {
      this.error.set('Invalid user ID.');
      this.isLoading.set(false);
      return;
    }

    this.userService.getUser(id).subscribe({
      next: (user) => {
        this.user.set(user);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set(error.message || 'Unable to load user details.');
        this.isLoading.set(false);
      }
    });
  }
}
