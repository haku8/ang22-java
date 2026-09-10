import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthUser, LoginResponse, LoginRequest, Role } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/admin`;

  readonly currentUser = signal<AuthUser | null>(null);
  readonly error = signal<string | null>(null);

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, request).pipe(
      tap((response) => {
        if (response.success) {
          this.currentUser.set({ name: response.name, role: response.role });
          this.error.set(null);
        } else {
          this.currentUser.set(null);
          this.error.set(response.message);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        const message = error.error?.message || 'Unable to login. Please try again.';
        this.currentUser.set(null);
        this.error.set(message);
        return throwError(() => new Error(message));
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    this.error.set(null);
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }

  get roles(): Role[] {
    return ['ADMIN', 'USER'];
  }
}
