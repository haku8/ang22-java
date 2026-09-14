import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { CreateUser } from '../models/user.model';
import { CardComponent } from '../shared/card.component';
import { ErrorMessageComponent } from '../shared/error-message.component';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ErrorMessageComponent],
  template: `
    <section class="user-create">
      <app-card title="Create user" subtitle="Add a new backend user.">
        <form (ngSubmit)="submit()" #userForm="ngForm" class="create-form">
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

        <app-error-message [message]="error()"></app-error-message>
        <button type="submit" [disabled]="isSaving() || userForm.invalid">Create user</button>
      </form>
    </app-card>
  </section>
  `,
  styles: [
    ".user-create { max-width: 640px; margin: 0 auto; padding: 1rem; }",
    ".user-create h2 { margin-bottom: 1rem; font-size: 1.75rem; }",
    ".create-form { display: grid; gap: 1rem; }",
    ".create-form label { display: grid; gap: 0.5rem; font-weight: 600; color: #0f172a; }",
    ".create-form input[type='text'], .create-form input[type='number'] { padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 0.75rem; }",
    ".toggle-row { display: flex; align-items: center; gap: 0.75rem; font-weight: 500; }",
    ".error-message { padding: 0.8rem 1rem; background: #fee2e2; color: #991b1b; border-radius: 0.75rem; }",
    ".create-form button { width: min(100%, 240px); padding: 0.8rem 1rem; border: none; border-radius: 0.75rem; background: #2563eb; color: white; cursor: pointer; }",
    ".create-form button:disabled { background: #94a3b8; cursor: not-allowed; }"
  ]
})
export class UserCreateComponent {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  readonly isSaving = signal(false);
  readonly error = signal<string | null>(null);

  formState: CreateUser = {
    user: '',
    age: 0,
    role: 'USER',
    exists: true
  };

  submit(): void {
    if (!this.formState.user.trim() || this.formState.age < 0) {
      this.error.set('Please enter valid user details.');
      return;
    }

    this.isSaving.set(true);
    this.error.set(null);

    this.userService.createUser(this.formState).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.router.navigate(['/users']);
      },
      error: (error) => {
        this.error.set(error.message || 'Failed to create user.');
        this.isSaving.set(false);
      }
    });
  }
}
