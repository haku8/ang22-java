import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-message" *ngIf="message">
      {{ message }}
    </div>
  `,
  styles: [
    ".error-message { padding: 0.9rem 1rem; border-radius: 0.75rem; background: #fee2e2; color: #991b1b; }"
  ]
})
export class ErrorMessageComponent {
  @Input() message?: string | null;
}
