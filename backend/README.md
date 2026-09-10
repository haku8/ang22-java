# Backend — Ports and CORS

This document explains the default backend ports and common CORS configuration approaches for a Java Spring Boot backend used with the frontend in this repository.

Default port
- By convention this project assumes the backend runs on port `8080` during local development.
- To change the port, set in `application.properties` or `application.yml`:

application.properties
```
server.port=8080
```

application.yml
```yaml
server:
  port: 8080
```

CORS (Cross-Origin Resource Sharing)
- In local development the frontend runs on `http://localhost:4200` (Vite dev server). If you don't use a dev proxy, the backend must allow CORS from the frontend origin.
- Preferred dev setup: keep the frontend using the Vite proxy (`/api` → `http://localhost:8080`) so the browser sees same-origin requests. If you cannot use a proxy, enable CORS on the backend.

Example — Global CORS configuration (Spring Boot)
```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowCredentials(true);
    }
}
```

Example — Controller-level CORS
```java
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    // endpoints...
}
```

Spring Security
- If your app uses Spring Security, enable CORS in the security configuration and provide a `CorsConfigurationSource` bean, or call `http.cors()` in the `HttpSecurity` config so the global mappings are applied.

Production notes
- For production, restrict `allowedOrigins` to your production frontend host(s) (for example `https://app.example.com`).
- For public APIs consider stricter CORS policies and proper authentication.

Troubleshooting
- If you see CORS errors in the browser console, verify:
  - The request origin matches an allowed origin.
  - The backend response includes `Access-Control-Allow-Origin`.
  - Preflight (`OPTIONS`) requests are handled and return the appropriate headers.

See `../frontend/README.md` for local frontend run instructions (proxy usage recommended).
