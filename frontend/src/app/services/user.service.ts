import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateUser, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/users`;

  readonly users = signal<User[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl).pipe(catchError((error) => this.handleError(error)));
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`).pipe(catchError((error) => this.handleError(error)));
  }

  createUser(user: CreateUser): Observable<User> {
    return this.http.post<User>(this.baseUrl, user).pipe(
      tap((createdUser) => {
        this.users.update((list) => [...list, createdUser]);
      }),
      catchError((error) => this.handleError(error))
    );
  }

  updateUser(id: number, user: CreateUser): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, user).pipe(
      tap((updatedUser) => {
        this.users.update((list) => list.map((item) => item.id === updatedUser.id ? updatedUser : item));
      }),
      catchError((error) => this.handleError(error))
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { responseType: 'text' as 'json' }).pipe(catchError((error) => this.handleError(error)));
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.http.get<User[]>(this.baseUrl).pipe(
      tap((data) => this.users.set(data)),
      catchError((error) => {
        this.users.set([]);
        this.error.set(this.formatError(error));
        return throwError(() => error);
      })
    )
    .subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false)
    });
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    return throwError(() => new Error(this.formatError(error)));
  };

  private formatError(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return `Network error: ${error.error.message}`;
    }

    if (error.status === 0) {
      return 'Unable to reach the backend. Start the Java server and try again.';
    }

    return error.error?.message || `Request failed with status ${error.status}`;
  }
}
