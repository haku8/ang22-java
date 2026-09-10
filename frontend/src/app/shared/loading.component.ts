import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-shell">
      <div class="spinner"></div>
      <span>Loading…</span>
    </div>
  `,
  styles: [
    ".loading-shell { display: inline-flex; align-items: center; gap: 0.75rem; padding: 0.9rem 1rem; border-radius: 0.75rem; background: #e2e8f0; color: #0f172a; }",
    ".spinner { width: 1rem; height: 1rem; border: 2px solid transparent; border-top-color: #2563eb; border-radius: 9999px; animation: spin 0.9s linear infinite; }",
    "@keyframes spin { to { transform: rotate(360deg); } }"
  ]
})
export class LoadingComponent {}
