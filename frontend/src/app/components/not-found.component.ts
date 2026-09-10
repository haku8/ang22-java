import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="not-found-page">
      <section>
        <h1>Page not found</h1>
        <p>The page you requested does not exist.</p>
        <a routerLink="/" class="back-link">Return home</a>
      </section>
    </main>
  `,
  styles: [
    ".not-found-page { display: grid; place-items: center; min-height: 100vh; padding: 2rem; }",
    ".back-link { display: inline-block; margin-top: 1rem; padding: 0.75rem 1rem; background: #2563eb; color: white; border-radius: 0.75rem; text-decoration: none; }"
  ]
})
export class NotFoundComponent {}
