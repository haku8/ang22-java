import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { UserService } from './user.service';
import { User, CreateUser } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: { get: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn>; put: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    httpMock = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: HttpClient, useValue: httpMock },
      ],
    });

    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should return an array of users', () => {
      const mockUsers: User[] = [
        { id: 1, user: 'Alice', age: 30, role: 'USER', createdAt: '2024-01-01T10:00:00', lastAccess: '2024-01-01T10:00:00', exists: true },
        { id: 2, user: 'Bob', age: 25, role: 'ADMIN', createdAt: '2024-01-01T10:00:00', lastAccess: '2024-01-01T10:00:00', exists: true },
      ];
      httpMock.get.mockReturnValue(of(mockUsers));

      const result = service.getUsers();

      expect(result).toBeTruthy();
      expect(httpMock.get).toHaveBeenCalledWith('/api/users');
    });
  });

  describe('getUser', () => {
    it('should return a single user', () => {
      const mockUser: User = { id: 1, user: 'Alice', age: 30, role: 'USER', createdAt: '2024-01-01T10:00:00', lastAccess: '2024-01-01T10:00:00', exists: true };
      httpMock.get.mockReturnValue(of(mockUser));

      const result = service.getUser(1);

      expect(httpMock.get).toHaveBeenCalledWith('/api/users/1');
    });
  });

  describe('createUser', () => {
    it('should create a new user', () => {
      const newUser: CreateUser = { user: 'Charlie', age: 35, role: 'USER', exists: true };
      const createdUser: User = { id: 3, user: 'Charlie', age: 35, role: 'USER', createdAt: '2024-01-01T10:00:00', lastAccess: '2024-01-01T10:00:00', exists: true };
      httpMock.post.mockReturnValue(of(createdUser));

      service.createUser(newUser).subscribe((user) => {
        expect(user.user).toBe('Charlie');
      });

      expect(httpMock.post).toHaveBeenCalledWith('/api/users', newUser);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', () => {
      const updateUser: CreateUser = { user: 'Alice Updated', age: 31, role: 'ADMIN', exists: true };
      const updatedUser: User = { id: 1, user: 'Alice Updated', age: 31, role: 'ADMIN', createdAt: '2024-01-01T10:00:00', lastAccess: '2024-01-01T10:00:00', exists: true };
      httpMock.put.mockReturnValue(of(updatedUser));

      service.updateUser(1, updateUser).subscribe((user) => {
        expect(user.user).toBe('Alice Updated');
      });

      expect(httpMock.put).toHaveBeenCalledWith('/api/users/1', updateUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', () => {
      httpMock.delete.mockReturnValue(of(undefined));

      service.deleteUser(1).subscribe();

      expect(httpMock.delete).toHaveBeenCalledWith('/api/users/1', { responseType: 'text' as 'json' });
    });
  });

  describe('loadUsers', () => {
    it('should load users and update signals', () => {
      const mockUsers: User[] = [
        { id: 1, user: 'Alice', age: 30, role: 'USER', createdAt: '2024-01-01T10:00:00', lastAccess: '2024-01-01T10:00:00', exists: true },
      ];
      httpMock.get.mockReturnValue(of(mockUsers));

      service.loadUsers();

      expect(service['isLoading']()).toBe(false);
      expect(service.users()).toEqual(mockUsers);
    });

    it('should handle errors and set error signal', () => {
      const errorResponse = new HttpErrorResponse({ status: 0, error: { message: 'Network error' } });
      httpMock.get.mockReturnValue(throwError(() => errorResponse));

      service.loadUsers();

      expect(service['isLoading']()).toBe(false);
      expect(service.error()).toContain('Unable to reach the backend');
    });
  });

  describe('handleError', () => {
    it('should format network error', () => {
      const error = new HttpErrorResponse({ error: new ErrorEvent('Network error', { message: 'Connection failed' }) });
      const formatted = service['formatError'](error);
      expect(formatted).toContain('Network error');
    });

    it('should format backend unreachable error', () => {
      const error = new HttpErrorResponse({ status: 0 });
      const formatted = service['formatError'](error);
      expect(formatted).toContain('Unable to reach the backend');
    });

    it('should format HTTP error with status', () => {
      const error = new HttpErrorResponse({ status: 404, error: { message: 'Not found' } });
      const formatted = service['formatError'](error);
      expect(formatted).toBe('Not found');
    });
  });
});
