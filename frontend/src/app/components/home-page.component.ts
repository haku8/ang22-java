import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="home-page">
      <section>
        <h1>Java / Angular demo</h1>
        <p>Browse users from the backend and keep API logic inside a reusable service.</p>
        <a routerLink="/users" class="primary-link">View users</a>
      </section>
    </main>
  `,
  styles: [
    ".home-page { display: grid; place-items: center; min-height: 100vh; padding: 2rem; }",
    ".home-page h1 { font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 0.75rem; }",
    ".home-page p { max-width: 34rem; margin-bottom: 1.5rem; color: #475569; }",
    ".primary-link { display: inline-block; padding: 0.85rem 1.25rem; background: #2563eb; color: white; border-radius: 0.75rem; text-decoration: none; }"
  ]
})
export class HomePageComponent {}
