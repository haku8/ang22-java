import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginRequest, Role } from '../models/user.model';
import { CardComponent } from '../shared/card.component';
import { ErrorMessageComponent } from '../shared/error-message.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ErrorMessageComponent],
  template: `
    <section class="login-page">
      <app-card title="Login" subtitle="Sign in as an admin or user.">
        <form (ngSubmit)="submit()" #loginForm="ngForm" class="login-form">
          <label>
            Name
            <input
              type="text"
              name="name"
              [(ngModel)]="formState.name"
              required
              minlength="2"
            />
          </label>

          <label>
            Role
            <select name="role" [(ngModel)]="formState.role" required>
              <option *ngFor="let role of roles" [value]="role">{{ role }}</option>
            </select>
          </label>

          <app-error-message [message]="error() || auth.error()"></app-error-message>

          <div class="button-row">
            <button type="submit" [disabled]="loginForm.invalid || isSubmitting()">Sign in</button>
            <button type="button" class="logout-button" (click)="logout()">Clear</button>
          </div>
        </form>
      </app-card>
    </section>
  `,
  styles: [
    ".login-page { max-width: 480px; margin: 0 auto; padding: 1rem; }",
    ".login-form { display: grid; gap: 1rem; }",
    ".login-form label { display: grid; gap: 0.5rem; font-weight: 600; color: #0f172a; }",
    ".login-form input, .login-form select { padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 0.75rem; }",
    ".button-row { display: flex; gap: 0.75rem; flex-wrap: wrap; }",
    ".login-form button { padding: 0.75rem 1rem; border: none; border-radius: 0.75rem; background: #2563eb; color: white; cursor: pointer; }",
    ".logout-button { background: #64748b; }",
    ".login-form button:disabled { background: #94a3b8; cursor: not-allowed; }"
  ]
})
export class LoginComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly roles = ['ADMIN', 'USER'] as Role[];
  formState: LoginRequest = { name: '', role: 'USER' };
  readonly isSubmitting = signal(false);
  readonly error = signal<string | null>(null);

  submit(): void {
    this.error.set(null);
    this.isSubmitting.set(true);

    this.auth.login(this.formState).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        if (response.success) {
          this.router.navigate(['/users']);
        } else {
          this.error.set(response.message);
        }
      },
      error: (error) => {
        this.error.set(error.message || 'Login failed.');
        this.isSubmitting.set(false);
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.formState = { name: '', role: 'USER' };
    this.error.set(null);
  }
}
