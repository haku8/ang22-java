import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UserEditComponent } from './user-edit.component';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

describe('UserEditComponent', () => {
  let component: UserEditComponent;
  let fixture: ComponentFixture<UserEditComponent>;
  let userServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  beforeEach(() => {
    userServiceMock = {
      getUser: vi.fn().mockReturnValue(of({
        id: 1,
        user: 'Alice',
        age: 30,
        role: 'USER',
        createdAt: '2024-01-01T10:00:00',
        lastAccess: '2024-01-01T10:00:00',
        exists: true,
      })),
      updateUser: vi.fn(),
    };

    routerMock = {
      navigate: vi.fn(),
    };

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue('1'),
        },
      },
    };

    TestBed.configureTestingModule({
      imports: [UserEditComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    });

    fixture = TestBed.createComponent(UserEditComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on init with valid ID', () => {
    const mockUser: User = { id: 1, user: 'Alice', age: 30, role: 'USER', createdAt: '2024-01-01T10:00:00', lastAccess: '2024-01-01T10:00:00', exists: true };
    userServiceMock.getUser.mockReturnValue(of(mockUser));

    component = TestBed.createComponent(UserEditComponent).componentInstance;
    fixture.detectChanges();

    expect(component.formState.user).toBe('Alice');
    expect(component.formState.age).toBe(30);
    expect(component.isLoading()).toBe(false);
  });

  it('should set error when user ID is invalid', () => {
    activatedRouteMock.snapshot.paramMap.get.mockReturnValue(null);

    component = TestBed.createComponent(UserEditComponent).componentInstance;
    fixture.detectChanges();

    expect(component.error()).toBe('Invalid user ID.');
    expect(component.isLoading()).toBe(false);
  });

  it('should set error when user ID is zero', () => {
    activatedRouteMock.snapshot.paramMap.get.mockReturnValue('0');

    component = TestBed.createComponent(UserEditComponent).componentInstance;
    fixture.detectChanges();

    expect(component.error()).toBe('Invalid user ID.');
    expect(component.isLoading()).toBe(false);
  });

  it('should set error when user load fails', () => {
    const error = new Error('User not found');
    userServiceMock.getUser.mockReturnValue(throwError(() => error));

    component = TestBed.createComponent(UserEditComponent).componentInstance;
    fixture.detectChanges();

    expect(component.error()).toBe('User not found');
    expect(component.isLoading()).toBe(false);
  });

  it('should set error when user name is empty on submit', () => {
    component.formState.user = '';
    component.formState.age = 25;
    component.submit();
    expect(component.error()).toBe('Please enter valid user details.');
  });

  it('should set error when user name is only whitespace on submit', () => {
    component.formState.user = '   ';
    component.formState.age = 25;
    component.submit();
    expect(component.error()).toBe('Please enter valid user details.');
  });

  it('should set error when age is negative on submit', () => {
    component.formState.user = 'Alice';
    component.formState.age = -1;
    component.submit();
    expect(component.error()).toBe('Please enter valid user details.');
  });

  it('should call updateUser and navigate on successful submit', () => {
    const mockUser: User = { id: 1, user: 'Alice Updated', age: 31, role: 'ADMIN', createdAt: '2024-01-01T10:00:00', lastAccess: '2024-01-01T10:00:00', exists: true };
    userServiceMock.updateUser.mockReturnValue(of(mockUser));

    component.formState.user = 'Alice Updated';
    component.formState.age = 31;
    component.formState.role = 'ADMIN';
    component.formState.exists = true;
    component.submit();

    expect(userServiceMock.updateUser).toHaveBeenCalledWith(1, component.formState);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/users']);
    expect(component.isSaving()).toBe(false);
  });

  it('should set error and reset isSaving on failed submit', () => {
    const error = new Error('Update failed');
    userServiceMock.updateUser.mockReturnValue(throwError(() => error));

    component.formState.user = 'Alice';
    component.formState.age = 30;
    component.formState.role = 'USER';
    component.formState.exists = true;
    component.submit();

    expect(component.error()).toBe('Update failed');
    expect(component.isSaving()).toBe(false);
  });

  it('should set isSaving to true during submit', () => {
    userServiceMock.updateUser.mockReturnValue(of({} as User));

    component.formState.user = 'Alice';
    component.formState.age = 30;
    component.formState.role = 'USER';
    component.formState.exists = true;
    component.submit();

    expect(component.isSaving()).toBe(false);
  });

  it('should clear error before submit', () => {
    component.error.set('Previous error');
    userServiceMock.updateUser.mockReturnValue(of({} as User));

    component.formState.user = 'Alice';
    component.formState.age = 30;
    component.formState.role = 'USER';
    component.formState.exists = true;
    component.submit();

    expect(component.error()).toBeNull();
  });
});
