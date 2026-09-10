import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state">
      {{ message }}
    </div>
  `,
  styles: [
    ".empty-state { padding: 0.9rem 1rem; border-radius: 0.75rem; background: #f8fafc; color: #334155; }"
  ]
})
export class EmptyStateComponent {
  @Input() message = 'No data available.';
}
