import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: { post: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    httpMock = {
      post: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useValue: httpMock },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully and set current user', () => {
      const request: LoginRequest = { name: 'admin', role: 'ADMIN' };
      const response: LoginResponse = { success: true, message: 'Login successful', name: 'admin', role: 'ADMIN' };
      httpMock.post.mockReturnValue(of(response));

      service.login(request).subscribe((result) => {
        expect(result.success).toBe(true);
        expect(result.name).toBe('admin');
        expect(result.role).toBe('ADMIN');
      });

      expect(httpMock.post).toHaveBeenCalledWith('/api/admin/login', request);
    });

    it('should set current user on successful login', () => {
      const request: LoginRequest = { name: 'admin', role: 'ADMIN' };
      const response: LoginResponse = { success: true, message: 'Login successful', name: 'admin', role: 'ADMIN' };
      httpMock.post.mockReturnValue(of(response));

      service.login(request).subscribe();

      expect(service['currentUser']()).toEqual({ name: 'admin', role: 'ADMIN' });
      expect(service['error']()).toBeNull();
    });

    it('should clear current user on failed login', () => {
      const request: LoginRequest = { name: 'admin', role: 'ADMIN' };
      const response: LoginResponse = { success: false, message: 'Invalid credentials', name: '', role: 'USER' };
      httpMock.post.mockReturnValue(of(response));

      service.login(request).subscribe();

      expect(service['currentUser']()).toBeNull();
      expect(service['error']()).toBe('Invalid credentials');
    });

    it('should handle HTTP errors', () => {
      const request: LoginRequest = { name: 'admin', role: 'ADMIN' };
      const errorResponse = new HttpErrorResponse({ status: 401, error: { message: 'Unauthorized' } });
      httpMock.post.mockReturnValue(throwError(() => errorResponse));

      service.login(request).subscribe({
        error: (err) => {
          expect(err.message).toBe('Unauthorized');
        },
      });

      expect(service['currentUser']()).toBeNull();
      expect(service['error']()).toBe('Unauthorized');
    });

    it('should use default error message when error has no message', () => {
      const request: LoginRequest = { name: 'admin', role: 'ADMIN' };
      const errorResponse = new HttpErrorResponse({ status: 500, error: {} });
      httpMock.post.mockReturnValue(throwError(() => errorResponse));

      service.login(request).subscribe({
        error: () => {
          expect(service['error']()).toBe('Unable to login. Please try again.');
        },
      });
    });
  });

  describe('logout', () => {
    it('should clear current user and error', () => {
      service['currentUser'].set({ name: 'admin', role: 'ADMIN' });
      service['error'].set('Some error');

      service.logout();

      expect(service['currentUser']()).toBeNull();
      expect(service['error']()).toBeNull();
    });
  });

  describe('isAdmin', () => {
    it('should return true when current user is ADMIN', () => {
      service['currentUser'].set({ name: 'admin', role: 'ADMIN' });

      expect(service.isAdmin()).toBe(true);
    });

    it('should return false when current user is USER', () => {
      service['currentUser'].set({ name: 'user', role: 'USER' });

      expect(service.isAdmin()).toBe(false);
    });

    it('should return false when no current user', () => {
      service['currentUser'].set(null);

      expect(service.isAdmin()).toBe(false);
    });
  });

  describe('roles', () => {
    it('should return array of roles', () => {
      const roles = service.roles;

      expect(roles).toEqual(['ADMIN', 'USER']);
    });
  });
});
