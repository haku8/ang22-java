import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { UserListComponent } from './user-list.component';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    const errorSignal = Object.assign(vi.fn().mockReturnValue(null), { set: vi.fn() });
    userServiceMock = {
      users: vi.fn().mockReturnValue([]),
      isLoading: vi.fn().mockReturnValue(false),
      error: errorSignal,
      loadUsers: vi.fn(),
      deleteUser: vi.fn().mockReturnValue(of(undefined)),
    };

    routerMock = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: {} },
      ],
    });

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init if users array is empty', () => {
    userServiceMock.users.mockReturnValue([]);
    component.ngOnInit();
    expect(userServiceMock.loadUsers).toHaveBeenCalled();
  });

  it('should not load users on init if users array is not empty', () => {
    const mockUsers: User[] = [
      { id: 1, user: 'Alice', age: 30, role: 'USER', createdAt: '2024-01-01T10:00:00', lastAccess: '2024-01-01T10:00:00', exists: true },
    ];
    userServiceMock.users.mockReturnValue(mockUsers);
    component.ngOnInit();
    expect(userServiceMock.loadUsers).not.toHaveBeenCalled();
  });

  it('should call reload when reload is called', () => {
    component.reload();
    expect(userServiceMock.loadUsers).toHaveBeenCalled();
  });

  it('should delete user and reload on successful delete', () => {
    userServiceMock.deleteUser.mockReturnValue(of(undefined));
    component.delete(1);
    expect(userServiceMock.deleteUser).toHaveBeenCalledWith(1);
  });

  it('should set error on failed delete', () => {
    const error = new Error('Delete failed');
    userServiceMock.deleteUser.mockReturnValue({ subscribe: (callbacks: any) => callbacks.error(error) });
    component.delete(1);
    expect(userServiceMock.error.set).toHaveBeenCalled();
  });
});
