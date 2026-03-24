# Auth0 Public Client - Angular + C# API Demo

Dieses Projekt demonstriert eine moderne **Single Page Application (SPA)** mit **Auth0** für die Authentifizierung und Autorisierung. Ein Angular Frontend kommuniziert mit einer C# .NET API, die JWT-Token-basierte Security mit Scopes verwendet.

## 🏗️ Architektur

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

## 📁 Projektstruktur

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

## 🚀 Setup & Start

### Voraussetzungen

- Docker & Docker Compose
- Node.js 20+ (für lokale Entwicklung)
- .NET 10.0 SDK (für lokale Entwicklung)
- Auth0 Account (kostenlos bei [auth0.com](https://auth0.com))

### Mit Docker starten (empfohlen)

```bash
# Alle Services bauen und starten
docker compose up --build

# Im Hintergrund starten
docker compose up -d --build

# Logs anzeigen
docker compose logs -f

# Stoppen
docker compose down
```

**Services erreichbar unter:**
- Frontend: http://localhost:4000
- API: http://localhost:3000

### Lokal starten (ohne Docker)

```bash
# Terminal 1: API starten
cd api
dotnet run --urls "http://localhost:3000"

# Terminal 2: Frontend starten
cd public-client
npm install
npm start
```

## 🔐 Auth0 Setup

### 1. Auth0 Application erstellen

1. Gehe zu [Auth0 Dashboard](https://manage.auth0.com)
2. Erstelle eine neue **Single Page Application**
3. Notiere dir:
   - **Domain** (z.B. `dev-codekittey.eu.auth0.com`)
   - **Client ID** (z.B. `PqrUSlrGpMGqBFK9NbjHWZBej8yV8oNY`)

### 2. Application Settings konfigurieren

**Allowed Callback URLs:**
```
http://localhost:4000
```

**Allowed Logout URLs:**
```
http://localhost:4000
```

**Allowed Web Origins:**
```
http://localhost:4000
```

### 3. API erstellen (Auth0 Dashboard)

1. Gehe zu **Applications → APIs**
2. Erstelle eine neue API
3. **Identifier:** `http://localhost:3010` (deine Audience)
4. **Signing Algorithm:** RS256

### 4. Permissions (Scopes) hinzufügen

Füge folgende Scopes zur API hinzu:

| Scope | Beschreibung |
|-------|--------------|
| `users:read` | Benutzer lesen |
| `users:write` | Benutzer erstellen |

### 5. Konfiguration anpassen

**Frontend (`public-client/src/app/auth/auth.config.ts`):**
```typescript
export const authConfig: AuthConfig = {
  domain: 'DEINE-AUTH0-DOMAIN.auth0.com',
  clientId: 'DEINE-CLIENT-ID',
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: 'http://localhost:3010',
    scope: 'openid profile email users:read users:write',
  },
  useRefreshTokens: true,
  httpInterceptor: {
    allowedList: ['http://localhost:3000/api/*'],
  },
};
```

**Backend (`api/appsettings.json`):**
```json
{
  "Auth0": {
    "Domain": "DEINE-AUTH0-DOMAIN.auth0.com",
    "Audience": "http://localhost:3010"
  }
}
```

## 📡 API Endpoints

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

## 🎨 Frontend Features

### Komponenten

**Header (Navigation)**
- Zeigt Login/Logout Button basierend auf Auth-Status
- Navigation zu About, Profile, User (geschützt)
- Verwendet Auth0 `AuthService` und Signals

**About (Öffentlich)**
- Startseite, für alle zugänglich
- Zeigt Informationen über die App

**Profile (Geschützt)**
- Zeigt Benutzerprofil von Auth0
- Name, Email, Avatar
- Nur für eingeloggte User

**User List (Geschützt)**
- Grid-View mit allen Usern
- Avatar (erster Buchstabe des Namens)
- Klickbar für Details
- "Neuen Nutzer anlegen" Button
- Loading & Error States

**Create User (Geschützt)**
- Reactive Form mit Validierung
- Name (min. 2 Zeichen) und Email (Format-Check)
- Inline Field-Errors
- Abbrechen-Button


## 🔧 Technologie-Stack

### Frontend

| Technologie | Version | Zweck |
|-------------|---------|-------|
| Angular | 21 | SPA Framework |
| TypeScript | 5.7+ | Typsicheres JavaScript |
| RxJS | 7.8+ | Reactive Programming |
| Auth0 Angular SDK | 2.x | Authentication & Authorization |
| Nginx | Alpine | Production Web Server |

### Backend

| Technologie | Version | Zweck |
|-------------|---------|-------|
| .NET | 10.0 | Web API Framework |
| C# | 14 | Programmiersprache |
| JWT Bearer Auth | 10.0 | Token Validation |
| Auth0 | - | Identity Provider |

## 🔒 Security Features

### Backend (API)

- **JWT Token Validation** mit Auth0 public keys
- **Scope-basierte Authorization** (HasScopeHandler)
- **CORS konfiguriert** für localhost:4000 und 4200
- **HTTPS Ready** (aktuell HTTP für Development)

### Frontend (SPA)

- **Auth0 SDK** mit PKCE Flow
- **HTTP Interceptor** für automatisches Token-Handling
- **Route Guards** (`AuthGuard`) für geschützte Routen
- **Refresh Tokens** für längere Sessions
- **Silent Authentication** für nahtlose UX

### Authorization Flow

1. User klickt "Login" → Redirect zu Auth0
2. Auth0 authentifiziert User
3. Redirect zurück mit Authorization Code
4. Angular tauscht Code gegen Access Token (PKCE)
5. Token wird automatisch bei API-Calls mitgeschickt
6. API validiert Token und prüft Scopes

## 📊 User Management Flow

```
┌──────────────┐
│ User List    │  ← GET /api/users (scope: users:read)
└──────┬───────┘
       │
       │ Click "Neuen Nutzer anlegen"
       ▼
┌──────────────┐
│ Create User  │
│              │  1. Formular ausfüllen
│              │  2. Validierung
│              │  3. POST /api/users (scope: users:write)
└──────┬───────┘
       │
       │ Success
       ▼
┌──────────────┐
│ User List    │  ← Zeigt neuen User in Liste
└──────────────┘
```

## 🐳 Docker Details

### Frontend Image

- **Base:** `node:24-alpine` (Build) → `nginx:alpine` (Runtime)
- **Build:** Angular Production Build
- **Size:** ~50 MB (komprimiert)
- **Features:** 
  - SPA Routing (try_files)
  - Static Asset Caching
  - Gzip Compression

### Backend Image

- **Base:** `mcr.microsoft.com/dotnet/sdk:10.0` (Build) → `aspnet:10.0` (Runtime)
- **Build:** Release Configuration
- **Size:** ~220 MB (komprimiert)
- **Port:** 3000

### Docker Compose

- **Network:** `app-network` (Bridge) für Service-to-Service Kommunikation
- **Depends On:** Frontend wartet auf API
- **Environment:** Development-Modus aktiviert

## 🔧 Troubleshooting

### Problem: "Unauthorized" bei API-Calls

**Lösung:** 
- Prüfe ob Access Token vorhanden ist (Browser DevTools → Network)
- Verifiziere `audience` in auth.config.ts
- Stelle sicher, dass Scopes in Auth0 API konfiguriert sind

### Problem: Route Guard leitet nicht weiter nach Login

**Lösung:**
- Verwende `AuthGuard` statt `isAuthenticated$` Observable
- `canActivate: [AuthGuard]` ist korrekt

### Problem: Frontend baut nicht im Docker

**Lösung:**
- Stelle sicher, dass `package.json` und `package-lock.json` vorhanden sind
- Überprüfe Node Version in Dockerfile
- Versuche `npm ci` statt `npm install`

## 📝 Development Notes

### Lokale Entwicklung ohne Docker

```bash
# API mit Hot Reload
cd api
dotnet watch run --urls "http://localhost:3000"

# Frontend mit Hot Reload
cd public-client
npm start  # Läuft auf Port 4200
```

### Code-Styling

- **Frontend:** ESLint + Prettier (Angular defaults)
- **Backend:** .editorconfig + Rider/VS defaults

### Testing

```bash
# Frontend Unit Tests
cd public-client
npm test

# Backend Tests
cd api
dotnet test
```

## 🚀 Deployment Hinweise

Für Production Deployment:

1. **HTTPS aktivieren** - Niemals HTTP in Produktion!
2. **Secrets externalisieren** - Environment Variables oder Key Vault
3. **CORS restriktiv** - Nur benötigte Origins
4. **Rate Limiting** - API-Calls limitieren
5. **Logging** - Structured Logging (Serilog, ELK Stack)
6. **Monitoring** - Application Insights, Prometheus

## 📚 Weiterführende Links

- [Auth0 Documentation](https://auth0.com/docs)
- [Auth0 Angular SDK](https://github.com/auth0/auth0-angular)
- [Angular Documentation](https://angular.dev)
- [.NET Web API](https://learn.microsoft.com/aspnet/core/web-api/)
- [JWT.io](https://jwt.io) - Token Decoder
