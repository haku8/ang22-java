import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="card-shell">
      <header *ngIf="title || subtitle" class="card-header">
        <h2 *ngIf="title">{{ title }}</h2>
        <p *ngIf="subtitle">{{ subtitle }}</p>
      </header>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
    </section>
  `,
  styles: [
    ".card-shell { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 1rem; box-shadow: 0 24px 50px rgba(15, 23, 42, 0.05); padding: 1.5rem; }",
    ".card-header { margin-bottom: 1rem; }",
    ".card-header h2 { margin: 0; font-size: 1.75rem; color: #0f172a; }",
    ".card-header p { margin: 0.5rem 0 0; color: #475569; }",
    ".card-body { display: grid; gap: 1rem; }"
  ]
})
export class CardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
}
