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
