# CTFd SDK

A TypeScript SDK for the CTFd API. Designed for server-side usage (Next.js Server Actions, Node.js).

## Installation

```bash
npm install @hexcore-labs/ctfd-sdk
```

## Quick Start

```typescript
import { CTFdClient } from "@hexcore-labs/ctfd-sdk";

const client = new CTFdClient({
  url: "https://your-ctfd-instance.com",
  apiKey: "ctfd_xxx", // From CTFd Settings > Access Tokens
});

// List challenges
const challenges = await client.challenges.list();

// Get current user
const me = await client.users.get("me");

// Submit a flag
const result = await client.challenges.attempt(1, "flag{example}");
```

## Authentication Methods

### API Token (Recommended)

```typescript
const client = new CTFdClient({
  url: "https://ctfd.example.com",
  apiKey: "ctfd_your_token_here",
});
```

### Session Cookie + CSRF

```typescript
const client = new CTFdClient({
  url: "https://ctfd.example.com",
  sessionCookie: "session_value",
  csrfToken: "csrf_token_value",
});
```

## Features

| Resource      | List | Get | Create | Update | Delete | Extras                          |
| ------------- | ---- | --- | ------ | ------ | ------ | ------------------------------- |
| Challenges    | ✓    | ✓   | ✓      | ✓      | ✓      | attempt, solves, files, flags   |
| Users         | ✓    | ✓   | ✓      | ✓      | ✓      | email, solves, fails, awards    |
| Teams         | ✓    | ✓   | ✓      | ✓      | ✓      | members, solves, fails, awards  |
| Submissions   | ✓    | ✓   | -      | -      | ✓      |                                 |
| Awards        | ✓    | ✓   | ✓      | -      | ✓      |                                 |
| Files         | ✓    | ✓   | ✓      | -      | ✓      | Upload with FormData            |
| Pages         | ✓    | ✓   | ✓      | ✓      | ✓      |                                 |
| Notifications | ✓    | -   | ✓      | -      | ✓      |                                 |
| Configs       | ✓    | ✓   | ✓      | ✓      | ✓      |                                 |
| Flags         | ✓    | -   | ✓      | ✓      | ✓      | types                           |
| Hints         | ✓    | -   | ✓      | ✓      | ✓      |                                 |
| Tags          | ✓    | -   | ✓      | ✓      | ✓      |                                 |
| Topics        | ✓    | -   | ✓      | -      | ✓      |                                 |
| Tokens        | ✓    | -   | ✓      | -      | ✓      |                                 |
| Solutions     | ✓    | -   | ✓      | ✓      | ✓      |                                 |
| Unlocks       | ✓    | -   | ✓      | -      | -      |                                 |
| Scoreboard    | ✓    | -   | -      | -      | -      | top N                           |
| Statistics    | -    | -   | -      | -      | -      | challenges, users, scores, etc. |

## Documentation

- [Full API Reference](./docs/docs.md)
- [Examples](./docs/examples.md)

## License

MIT
