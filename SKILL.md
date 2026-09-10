# Skill: Integrate Angular Frontend with Java Backend (workspace-scoped)

## Summary
This skill captures a reproducible workflow for integrating an Angular frontend with a Java backend (e.g., Spring Boot). It focuses on configuration, typed API models, service patterns, and UI resilience (loading/error/empty states).

## When to use
- Creating or updating an Angular frontend that talks to a Java backend.
- Documenting best-practices for team onboarding and consistent integration patterns.

## Inputs
- Conversation or API contract (OpenAPI/Swagger, controller list, DTOs).
- Desired scope: `workspace` (default) or `personal`.
- Level of detail: `quick-checklist` or `full-workflow`.

## Outputs
- A `SKILL.md` file in the repository root summarizing the workflow.
- Example snippets (environment config, model interfaces, Angular service, UI patterns).

## Workflow (step-by-step)
1. Discover the backend contract.
   - Locate OpenAPI/Swagger, backend controllers, or DTOs under `backend/`.
   - Prefer the contract as the source of truth; avoid guessing shapes.

2. Configure environment and connectivity.
   - Put API base URLs in Angular environment files (`src/environments/environment.ts` / `environment.prod.ts`).
   - If running both services locally, add an Angular proxy (`proxy.conf.json`) or document backend ports and CORS requirements.

3. Create typed models and service methods.
   - Generate or hand-write TypeScript interfaces for DTOs.
   - Keep HTTP calls inside Angular services; return typed Observables.

4. Handle UI states gracefully.
   - Use explicit loading, error, and empty-state components or placeholders.
   - Surface actionable error messages and retry options where appropriate.

5. Verify integration.
   - Run the frontend against a running backend (via proxy or direct URL).
   - Add simple e2e/manual checks: API call returns expected shape, errors handled, and UI renders empty states.

## Examples

Environment (example)
```ts
// src/environments/environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api'
};
```

Angular proxy (optional)
```json
// proxy.conf.json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

Model and service pattern
```ts
// src/app/models/user.ts
export interface UserDto {
  id: number;
  name: string;
  email?: string;
}

// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = `${environment.apiBaseUrl}/users`;
  constructor(private http: HttpClient) {}

  list(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.base);
  }

  get(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.base}/${id}`);
  }
}
```

UI state handling (pattern)
```ts
// component.ts
isLoading = true;
error: string | null = null;
users: UserDto[] = [];

ngOnInit() {
  this.userService.list().subscribe({
    next: data => { this.users = data; this.isLoading = false; },
    error: err => { this.error = err.message || 'Failed to load'; this.isLoading = false; }
  });
}
```

In template:
```html
<ng-container *ngIf="isLoading">Loading...</ng-container>
<ng-container *ngIf="error">Error: {{error}} <button (click)="retry()">Retry</button></ng-container>
<ng-container *ngIf="!isLoading && !error">
  <div *ngIf="users.length === 0">No users found.</div>
  <ul *ngIf="users.length">
    <li *ngFor="let u of users">{{u.name}}</li>
  </ul>
</ng-container>
```

## Quality checks
- Environment URLs are centralized in environment files.
- All API calls use typed interfaces.
- UI shows clear loading, error, and empty states.
- Local dev flow documented (proxy or CORS instructions).

## Ambiguities / Questions to ask the user
1. Should the skill be workspace-scoped (store under repository) or saved to the personal prompts folder? Default: workspace.
2. Do you want generation templates (e.g., OpenAPI → TS models) included, or only hand-written examples?
3. Where should the proxy file live if used, and do you prefer `npm start` to include `--proxy-config` by default?

## Next steps
- Confirm scope and level of detail, then iterate the `SKILL.md` with additional examples or automation (codegen commands, scripts).
