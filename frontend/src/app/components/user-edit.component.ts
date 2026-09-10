import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { CreateUser } from '../models/user.model';
import { CardComponent } from '../shared/card.component';
import { ErrorMessageComponent } from '../shared/error-message.component';
import { LoadingComponent } from '../shared/loading.component';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingComponent, ErrorMessageComponent, CardComponent],
  template: `
    <section class="user-edit">
      <app-card title="Edit user" subtitle="Update the selected backend user.">
        <app-loading *ngIf="isLoading()"></app-loading>
        <app-error-message [message]="error()"></app-error-message>

        <form *ngIf="!isLoading() && !error()" (ngSubmit)="submit()" #editForm="ngForm" class="edit-form">
        <label>
          Name
          <input
            type="text"
            name="user"
            [(ngModel)]="formState.user"
            required
            minlength="2"
          />
        </label>

        <label>
          Age
          <input
            type="number"
            name="age"
            [(ngModel)]="formState.age"
            required
            min="0"
          />
        </label>

        <label>
          Role
          <select name="role" [(ngModel)]="formState.role" required>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>
        </label>

        <label class="toggle-row">
          <input
            type="checkbox"
            name="exists"
            [(ngModel)]="formState.exists"
          />
          Active user
        </label>

        <div class="button-row">
          <button type="submit" [disabled]="isSaving() || editForm.invalid">Save changes</button>
          <a routerLink="/users" class="cancel-link">Cancel</a>
        </div>
      </form>
    </app-card>
  </section>
  `,
  styles: [
    ".user-edit { max-width: 640px; margin: 0 auto; padding: 1rem; }",
    ".user-edit h2 { margin-bottom: 1rem; font-size: 1.75rem; }",
    ".edit-form { display: grid; gap: 1rem; }",
    ".edit-form label { display: grid; gap: 0.5rem; font-weight: 600; color: #0f172a; }",
    ".edit-form input[type='text'], .edit-form input[type='number'] { padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 0.75rem; }",
    ".toggle-row { display: flex; align-items: center; gap: 0.75rem; font-weight: 500; }",
    ".status-message, .error-message { margin-bottom: 1rem; padding: 0.9rem 1rem; border-radius: 0.75rem; }",
    ".error-message { background: #fee2e2; color: #991b1b; }",
    ".button-row { display: flex; gap: 0.75rem; flex-wrap: wrap; }",
    ".edit-form button { padding: 0.75rem 1rem; border: none; border-radius: 0.75rem; background: #2563eb; color: white; cursor: pointer; }",
    ".cancel-link { display: inline-flex; align-items: center; padding: 0.75rem 1rem; border-radius: 0.75rem; background: #e2e8f0; text-decoration: none; color: #0f172a; }",
    ".edit-form button:disabled { background: #94a3b8; cursor: not-allowed; }"
  ]
})
export class UserEditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly error = signal<string | null>(null);

  formState: CreateUser = { user: '', age: 0, role: 'USER', exists: true };
  private userId = 0;

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.userId = idParam ? Number(idParam) : 0;

    if (!this.userId) {
      this.error.set('Invalid user ID.');
      this.isLoading.set(false);
      return;
    }

    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.formState = {
          user: user.user,
          age: user.age,
          role: user.role,
          exists: user.exists
        };
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set(error.message || 'Unable to load the selected user.');
        this.isLoading.set(false);
      }
    });
  }

  submit(): void {
    if (!this.formState.user.trim() || this.formState.age < 0) {
      this.error.set('Please enter valid user details.');
      return;
    }

    this.isSaving.set(true);
    this.error.set(null);

    this.userService.updateUser(this.userId, this.formState).subscribe({
      next: () => this.router.navigate(['/users']),
      error: (error) => {
        this.error.set(error.message || 'Unable to update the user.');
        this.isSaving.set(false);
      }
    });
  }
}
