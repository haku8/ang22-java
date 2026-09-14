import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UserCreateComponent } from './user-create.component';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

describe('UserCreateComponent', () => {
  let component: UserCreateComponent;
  let fixture: ComponentFixture<UserCreateComponent>;
  let userServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    userServiceMock = {
      createUser: vi.fn(),
    };

    routerMock = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [UserCreateComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    fixture = TestBed.createComponent(UserCreateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default form state', () => {
    expect(component.formState.user).toBe('');
    expect(component.formState.age).toBe(0);
    expect(component.formState.role).toBe('USER');
    expect(component.formState.exists).toBe(true);
  });

  it('should set error when user name is empty', () => {
    component.formState.user = '';
    component.formState.age = 25;
    component.submit();
    expect(component.error()).toBe('Please enter valid user details.');
  });

  it('should set error when user name is only whitespace', () => {
    component.formState.user = '   ';
    component.formState.age = 25;
    component.submit();
    expect(component.error()).toBe('Please enter valid user details.');
  });

  it('should set error when age is negative', () => {
    component.formState.user = 'Alice';
    component.formState.age = -1;
    component.submit();
    expect(component.error()).toBe('Please enter valid user details.');
  });

  it('should call createUser and navigate on successful submit', () => {
    const mockUser: User = { id: 1, user: 'Alice', age: 30, role: 'USER', createdAt: '2024-01-01T10:00:00', lastAccess: '2024-01-01T10:00:00', exists: true };
    userServiceMock.createUser.mockReturnValue(of(mockUser));

    component.formState.user = 'Alice';
    component.formState.age = 30;
    component.formState.role = 'USER';
    component.formState.exists = true;
    component.submit();

    expect(userServiceMock.createUser).toHaveBeenCalledWith(component.formState);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/users']);
    expect(component.isSaving()).toBe(false);
  });

  it('should set error and reset isSaving on failed submit', () => {
    const error = new Error('Creation failed');
    userServiceMock.createUser.mockReturnValue(throwError(() => error));

    component.formState.user = 'Alice';
    component.formState.age = 30;
    component.formState.role = 'USER';
    component.formState.exists = true;
    component.submit();

    expect(component.error()).toBe('Creation failed');
    expect(component.isSaving()).toBe(false);
  });

  it('should set isSaving to true during submit', () => {
    userServiceMock.createUser.mockReturnValue(of({} as User));

    component.formState.user = 'Alice';
    component.formState.age = 30;
    component.formState.role = 'USER';
    component.formState.exists = true;
    component.submit();

    expect(component.isSaving()).toBe(false);
  });

  it('should clear error before submit', () => {
    component.error.set('Previous error');
    userServiceMock.createUser.mockReturnValue(of({} as User));

    component.formState.user = 'Alice';
    component.formState.age = 30;
    component.formState.role = 'USER';
    component.formState.exists = true;
    component.submit();

    expect(component.error()).toBeNull();
  });
});
