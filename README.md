# Szenario 1: Authorization Code Flow mit PKCE – Angular SPA + C# API

Dieses Projekt demonstriert eine moderne **Single Page Application (SPA)** mit **Auth0** für die Authentifizierung und Autorisierung. Ein Angular Frontend kommuniziert mit einer C# .NET API, die JWT-Token-basierte Security mit Scopes verwendet.

## Technologie-Stack

### Frontend

| Technologie | Version | Zweck |
|-------------|---------|-------|
| Angular | 21 | SPA Framework |
| Nginx | Alpine | Production Web Server |

### Backend

| Technologie | Version | Zweck |
|-------------|---------|-------|
| .NET | 10.0 | Web API Framework |
| C# | 14 | Programmiersprache |
| Auth0 | - | Identity Provider |

## Projektstruktur

```
auth0-public-client-c_sharp-api/
├── docker-compose.yml          # Docker Compose Konfiguration
├── .dockerignore              # Docker ignore patterns
├── README.md                  # Diese Datei
│
├── api/                       # C# .NET 10 Web API (Port 3000)
│   ├── Dockerfile
│   ├── Program.cs             # JWT Authentication Setup
│   ├── api.csproj
│   ├── appsettings.json       # Auth0 Konfiguration
│   ├── Controllers/
│   │   └── ApiController.cs   # User CRUD Endpoints
│   ├── HasScopeHandler.cs     # Custom Authorization Handler
│   └── HasScopeRequirement.cs # Scope-basierte Policies
│
└── public-client/             # Angular 19 SPA (Port 4000)
    ├── Dockerfile
    ├── nginx.conf             # Nginx SPA Routing Config
    ├── angular.json
    ├── package.json
    └── src/
        └── app/
            ├── about/         # Öffentliche About-Seite
            ├── profile/       # Geschützte Profil-Seite
            ├── header/        # Navigation mit Login/Logout
            ├── user/          # User-Verwaltung (Liste)
            ├── create-user/   # User erstellen (Formular)
            ├── services/
            │   └── user-api.service.ts  # HTTP Service für API
            └── auth/
                └── auth.config.ts       # Auth0 Konfiguration
```

## Architektur

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Angular SPA    │────▶│     Auth0       │────▶│   C# API        │
│   (Port 4000)   │     │  Identity Mgmt  │     │  (Port 3000)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
      │                         │                        │
      │  1. Login (Redirect)    │                        │
      │────────────────────────▶│                        │
      │◀────────────────────────│                        │
      │   Access Token          │                        │
      │   + ID Token            │                        │
      │                         │                        │
      │  2. API Call mit Token  │                        │
      │────────────────────────────────────────────────▶│
      │                         │                        │
      │                         │  3. Token validieren   │
      │                         │◀───────────────────────│
      │                         │                        │
      │◀────────────────────────────────────────────────│
      │         API Response                             │
```

## Setup & Start

### Voraussetzungen

- Docker & Docker Compose – siehe [Auth-Handbuch/einstieg](https://github.com/Auth-Handbuch/einstieg) für allgemeine Setup-Anleitungen
- Auth0 Account (kostenlos bei [auth0.com](https://auth0.com)) – siehe [AUTH0_SETUP.md](AUTH0_SETUP.md)

### Mit Docker starten (empfohlen)

```bash
# Alle Services bauen und starten
docker compose up -d --build
```

**Services erreichbar unter:**
- Frontend: http://localhost:4000
- API: http://localhost:3000


## Auth0 Setup

Die vollständige Auth0-Konfiguration – Tenant, Application, API, Scopes und Nutzer – ist in [SETUP_AUTH0.md](SETUP_AUTH0.md) beschrieben.

## API Endpoints

### Public Endpoints

| Methode | Endpoint | Beschreibung |
|---------|----------|--------------|
| `GET` | `/api/claims` | Zeigt alle Claims des aktuellen Users |

### Protected Endpoints (Auth erforderlich)

| Methode | Endpoint | Scope | Beschreibung |
|---------|----------|-------|--------------|
| `GET` | `/api/users` | `users:read` | Alle User abrufen |
| `GET` | `/api/users/{id}` | `users:read` | Einzelnen User abrufen |
| `POST` | `/api/users` | `users:write` | Neuen User erstellen |

### Beispiel-User Daten

```json
[
  {
    "id": 1,
    "name": "Max Mustermann",
    "email": "max@example.com"
  },
  {
    "id": 2,
    "name": "Erika Musterfrau",
    "email": "erika@example.com"
  },
  {
    "id": 3,
    "name": "Hans Schmidt",
    "email": "hans@example.com"
  }
]
```


## Weiterführende Links

- [Auth0 Documentation](https://auth0.com/docs)
- [Auth0 Angular SDK](https://github.com/auth0/auth0-angular)
- [Angular Documentation](https://angular.dev)
- [.NET Web API](https://learn.microsoft.com/aspnet/core/web-api/)
- [JWT.io](https://jwt.io) - Token Decoder
