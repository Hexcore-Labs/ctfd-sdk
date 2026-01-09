# CTFd SDK - Examples

## Setup

```typescript
import { CTFdClient } from "@hexcore-labs/ctfd-sdk";

const client = new CTFdClient({
  url: process.env.CTFD_URL!,
  apiKey: process.env.CTFD_API_KEY!,
});
```

---

## Challenges

### List All Challenges

```typescript
const challenges = await client.challenges.list();
console.log(challenges);
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "SQL Injection 101",
    "value": 100,
    "category": "Web",
    "type": "standard",
    "state": "visible",
    "solves": 42,
    "solved_by_me": false,
    "template": "/plugins/challenges/assets/view.html",
    "tags": [{ "value": "sqli" }]
  },
  {
    "id": 2,
    "name": "Buffer Overflow",
    "value": 200,
    "category": "Pwn",
    "type": "standard",
    "state": "visible",
    "solves": 5,
    "solved_by_me": true
  }
]
```

### Get Challenge with Details

```typescript
const challenge = await client.challenges.get(1);
```

**Response:**

```json
{
  "id": 1,
  "name": "SQL Injection 101",
  "value": 100,
  "category": "Web",
  "type": "standard",
  "state": "visible",
  "description": "Can you bypass the login? http://web.ctf/login",
  "connection_info": "nc pwn.ctf 1337",
  "max_attempts": 0,
  "solves": 42,
  "solved_by_me": false,
  "files": ["/files/8d8f.../schema.sql"],
  "tags": ["sqli", "beginner"],
  "hints": [{ "id": 1, "cost": 10 }]
}
```

### Submit a Flag

```typescript
const result = await client.challenges.attempt(1, "flag{s3cr3t}");
```

**Response (Correct):**

```json
{
  "status": "correct",
  "message": "Correct"
}
```

**Response (Incorrect):**

```json
{
  "status": "incorrect",
  "message": "Incorrect"
}
```

---

## Users

### Get Current User

```typescript
const me = await client.users.get("me");
```

**Response:**

```json
{
  "id": 10,
  "name": "Adit",
  "email": "adit@example.com",
  "score": 1500,
  "type": "admin",
  "admin": true,
  "banned": false,
  "hidden": false,
  "verified": true,
  "affiliation": "Hexcore",
  "country": "ID",
  "team_id": 5,
  "created": "2023-01-01T10:00:00Z"
}
```

### List Users with Pagination

```typescript
const response = await client.users.list({ page: 1 });
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "User1",
      "score": 500,
      "oauth_id": null,
      "bracket_id": null
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "next": 2,
      "prev": null,
      "pages": 5,
      "per_page": 50,
      "total": 243
    }
  }
}
```

### Get User Solves

```typescript
const solves = await client.users.getSolves(1);
```

**Response:**

```json
[
  {
    "challenge_id": 1,
    "challenge": {
      "name": "SQL Injection 101",
      "category": "Web",
      "value": 100
    },
    "team_id": 5,
    "date": "2023-10-25T14:30:00Z"
  }
]
```

---

## Teams

### Get My Team

```typescript
const myTeam = await client.teams.get("me");
```

**Response:**

```json
{
  "id": 5,
  "name": "Hackers United",
  "email": null,
  "score": 4500,
  "admin": false,
  "captain_id": 10,
  "members": [10, 15, 22],
  "affiliation": "University",
  "country": "US",
  "website": "https://hackers.united"
}
```

### Create Team

```typescript
const team = await client.teams.create({
  name: "New Team",
  password: "secure",
});
```

**Response:**

```json
{
  "id": 6,
  "name": "New Team",
  "email": null,
  "score": 0,
  "members": [],
  "created": "2026-01-08T11:00:00Z"
}
```

---

## Scoreboard

### Get Top Teams

```typescript
const top10 = await client.scoreboard.getTop(10);
```

**Response:**

```json
{
  "1": {
    "id": 5,
    "name": "Hackers United",
    "score": 4500,
    "solves": [
      { "challenge_id": 1, "account_id": 5, "team_id": 5, "user_id": 10, "value": 100, "date": "..." }
    ]
  },
  "2": {
    "id": 8,
    "name": "Pwners",
    "score": 4200,
    "solves": [...]
  }
}
```

---

## Files

### Upload File (Admin)

```typescript
const uploaded = await client.files.create(file, { challenge_id: 1 });
```

**Response:**

```json
{
  "id": 42,
  "type": "challenge",
  "location": "files/abc12345/readme.txt",
  "sha1sum": "da39a3ee5e6b4b0d3255bfef95601890afd80709"
}
```

---

## Hints

### Create Hint (Admin)

```typescript
const hint = await client.hints.create({ ... });
```

**Response:**

```json
{
  "id": 5,
  "challenge_id": 1,
  "content": "Look at the HTTP headers",
  "cost": 50,
  "type": "standard",
  "requirements": null
}
```

### Unlock a Hint

```typescript
const result = await client.unlocks.create(5, "hints");
```

**Response:**

```json
{
  "success": true
}
```

---

## Awards

### Create Award (Admin)

```typescript
const award = await client.awards.create({ ... });
```

**Response:**

```json
{
  "id": 3,
  "user_id": 1,
  "team_id": null,
  "name": "First Blood",
  "description": "First solve on web challenge",
  "value": 50,
  "category": "Bonus",
  "icon": "shield",
  "date": "2026-01-08T11:00:00Z"
}
```

---

## Notifications

### List Notifications

```typescript
const notifs = await client.notifications.list();
```

**Response:**

```json
[
  {
    "id": 1,
    "title": "CTF Starting Soon!",
    "content": "The competition begins in 30 minutes.",
    "date": "2026-01-08T10:30:00Z",
    "user_id": null,
    "team_id": null
  }
]
```

---

## Statistics

### Challenge Solve Stats

```typescript
const stats = await client.statistics.challenges.solves();
```

**Response:**

```json
[
  { "id": 1, "name": "SQL Injection", "solves": 42 },
  { "id": 2, "name": "Overflow", "solves": 12 }
]
```

### Score Distribution

```typescript
const dist = await client.statistics.scores.distribution();
```

**Response:**

```json
{
  "brackets": {
    "0-100": 5,
    "101-200": 12,
    "201-300": 8
  }
}
```

---

## Tokens

### Create API Token

```typescript
const token = await client.tokens.create({ ... });
```

**Response:**

```json
{
  "id": 7,
  "type": "user",
  "user_id": 10,
  "created": "2026-01-08T11:00:00Z",
  "expiration": "2026-02-08T11:00:00Z",
  "description": "CI/CD Token",
  "value": "ctfd_abcdef1234567890" // Only shown here!
}
```

---

## Error Handling Response

If an API call fails (e.g., 404 Not Found or 403 Forbidden), the SDK throws an error. The error message is usually derived from the CTFd error response.

**CTFd Error Response Body:**

```json
{
  "success": false,
  "errors": ["Challenge not found"]
}
```

**SDK Behavior:**

```typescript
try {
  await client.challenges.get(9999);
} catch (e) {
  console.log(e.message); // Output: "Challenge not found"
}
```
