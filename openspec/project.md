# Project Context

## Purpose

Build a game server based on TypeScript + TSRPC to support core features of an online multiplayer game, including: user authentication, matchmaking, room management, state synchronization, chat, basic anti-cheat logic, while maintaining good scalability and maintainability.

Goals:

- Handle a reasonable level of concurrency (e.g., 1k–10k online users)
- Clear architecture for easy future expansion (new modes, systems, features)
- Well-defined APIs for easy client integration (Cocos / Unity / Web, etc.)

## Tech Stack

- Node.js
- TypeScript
- TSRPC (RPC communication framework)
- Optional: Redis (cache/session), MongoDB/PostgreSQL (persistent storage)

---

## Code Style

> These are practical default conventions suitable for most TypeScript projects

- Enable strict TypeScript mode: `strict: true`
- Variables / functions: camelCase
- Classes / types: PascalCase
- File names: kebab-case or camelCase (stay consistent)
- Interfaces: semantic naming such as `Player`, `RoomState` (avoid unnecessary prefixes)
- Prefer `readonly` and `const` for safety
- Avoid using `any`; use `unknown` when necessary
- All exported functions/classes should include comments

Example:

```ts
interface Player {
  id: string;
  nickname: string;
  level: number;
}

class RoomService {
  createRoom(ownerId: string): Room {
    // ...
  }
}
```

---

## Architecture Patterns

Use a layered and modular architecture:

Example structure:

```
├── src/ # Source code directory
│   ├── common/ # Common components and utilities
│   │   ├── BaseComponent.js # Component base class
│   │   ├── WebsocketGameServer.js # WebSocket server implementation
│   │   └── ...
│   ├── component/ # Business components
│   │   ├── EventComponent.js # Event component
│   │   ├── GlobalVarComponent.js # Global variable component
│   │   └── ...
│   ├── shared/ # Shared type definitions and protocols
│   ├── util/ # Utility classes
│   │   ├── logger.js # Logging utility
│   │   ├── tool.js # General utilities
│   │   └── ...
│   ├── sysconfig/ # System configuration files
│   │   └── development/ # Development environment configuration
│   └── front.js # Frontend server entry point
├── dist/ # Compiled output directory
├── docs/ # Documentation directory
├── logs/ # Logs directory
├── node_modules/ # Dependencies/packages
├── package.json # Project configuration
├── tsconfig.json # TypeScript configuration
├── pm2_config.json # PM2 configuration
└── README.md # Project documentation
```

Core principles:

- No business logic in the network layer
- Business logic should be testable without the framework
- Low coupling between modules

---

## Testing Strategy

Start with lightweight testing and evolve over time:

- Unit tests: test core logic in the services layer (recommended: vitest / jest)
- Integration tests: test critical APIs (login, matchmaking, battle result, etc.)
- Minimum requirement: core rule logic must be testable

Examples:

- Matchmaking fairness
- Room capacity limits
- Reward / currency calculation correctness

---

## Git Workflow

A simple and practical Git workflow:

Branches:

- main: stable, production-ready version
- dev: daily development branch
- feature/xxx: new features
- fix/xxx: bug fixes

Commit conventions:

- feat: new feature
- fix: bug fix
- refactor: refactoring
- docs: documentation
- test: testing-related

Examples:

```
feat: add basic matchmaking system
fix: prevent room player overflow
```

---

## Domain Context

This project belongs to the game server domain. The AI assistant should understand concepts such as:

- Player
- Room
- Matchmaking
- State synchronization
- Tick / frame sync / turn-based logic
- Latency, packet loss, reconnection
- Anti-cheat (server-side validation)
- Game economy (currency, items, rewards)

Key principle:

- All critical logic must be authoritative on the server
- Client data should never be trusted by default

---

## Important Constraints

- Core gameplay logic must be fully controlled by the server
- Never trust client-provided values (prevent cheating)
- Architecture should support future scaling (e.g., microservices)
- Prioritize clarity and maintainability over premature optimization
- Prefer strong TypeScript type safety

---

## External Dependencies

Current or potential dependencies:

- TSRPC (communication framework)
- Redis (session cache / room state)
- MongoDB / PostgreSQL (player data storage)
- Docker (deployment)
- PM2 (Node.js process manager)

Possible future integrations:

- Payment SDKs
- Third-party login (Google / Apple)
- Logging systems (e.g., ELK stack)

## External attention

- console.log is replaced with gameLogger in logger.ts
