# CTFd SDK - API Reference

## Table of Contents

- [Initialization](#initialization)
- [Challenges](#challenges)
- [Users](#users)
- [Teams](#teams)
- [Scoreboard](#scoreboard)
- [Submissions](#submissions)
- [Awards](#awards)
- [Files](#files)
- [Pages](#pages)
- [Notifications](#notifications)
- [Configs](#configs)
- [Statistics](#statistics)
- [Flags](#flags)
- [Hints](#hints)
- [Tags](#tags)
- [Topics](#topics)
- [Unlocks](#unlocks)
- [Tokens](#tokens)
- [Solutions](#solutions)
- [Types](#types)

---

## Initialization

```typescript
import { CTFdClient, CTFdClientOptions } from "@hexcore-labs/ctfd-sdk";

const client = new CTFdClient(options: CTFdClientOptions);
```

### CTFdClientOptions

| Property        | Type     | Required | Description                        |
| --------------- | -------- | -------- | ---------------------------------- |
| `url`           | `string` | Yes      | Base URL of CTFd instance          |
| `apiKey`        | `string` | No       | API access token                   |
| `sessionCookie` | `string` | No       | Session cookie value               |
| `csrfToken`     | `string` | No       | CSRF token (required with session) |

---

## Challenges

### `challenges.list(query?)`

List all challenges.

| Parameter     | Type                     | Description         |
| ------------- | ------------------------ | ------------------- |
| `query.q`     | `string`                 | Search query        |
| `query.field` | `string`                 | Field to search     |
| `query.view`  | `"admin" \| "user"`      | View mode           |
| `query.*`     | `Partial<CTFdChallenge>` | Filter by any field |

**Returns:** `CTFdChallenge[]`

### `challenges.get(id)`

Get a single challenge.

| Parameter | Type     | Description  |
| --------- | -------- | ------------ |
| `id`      | `number` | Challenge ID |

**Returns:** `CTFdChallenge`

### `challenges.create(data)` [Admin]

Create a new challenge.

| Parameter | Type                     | Description    |
| --------- | ------------------------ | -------------- |
| `data`    | `Partial<CTFdChallenge>` | Challenge data |

**Returns:** `CTFdChallenge`

### `challenges.update(id, data)` [Admin]

Update a challenge.

| Parameter | Type                     | Description      |
| --------- | ------------------------ | ---------------- |
| `id`      | `number`                 | Challenge ID     |
| `data`    | `Partial<CTFdChallenge>` | Fields to update |

**Returns:** `CTFdChallenge`

### `challenges.delete(id)` [Admin]

Delete a challenge.

**Returns:** `boolean`

### `challenges.attempt(challengeId, submission)`

Submit a flag attempt.

| Parameter     | Type     | Description     |
| ------------- | -------- | --------------- |
| `challengeId` | `number` | Challenge ID    |
| `submission`  | `string` | Flag submission |

**Returns:** `{ status: string; message: string }`

### `challenges.getTypes()`

Get available challenge types.

**Returns:** `{ type: string; name: string }[]`

### `challenges.getSolves(id)`

Get solves for a challenge.

**Returns:** `any[]`

### `challenges.getFiles(id)`

Get files attached to a challenge.

**Returns:** `CTFdFile[]`

### `challenges.getFlags(id)` [Admin]

Get flags for a challenge.

**Returns:** `CTFdFlag[]`

### `challenges.getHints(id)`

Get hints for a challenge.

**Returns:** `CTFdHint[]`

### `challenges.getRequirements(id)`

Get requirements for a challenge.

**Returns:** `any`

### `challenges.getTags(id)`

Get tags for a challenge.

**Returns:** `CTFdTag[]`

### `challenges.getTopics(id)`

Get topics for a challenge.

**Returns:** `CTFdTopic[]`

---

## Users

### `users.list(query?)`

List users with pagination.

| Parameter           | Type     | Description        |
| ------------------- | -------- | ------------------ |
| `query.page`        | `number` | Page number        |
| `query.q`           | `string` | Search query       |
| `query.field`       | `string` | Field to search    |
| `query.affiliation` | `string` | Filter affiliation |

**Returns:** `CTFdResponse<CTFdUser[]>` (includes pagination meta)

### `users.get(id)`

Get a user by ID or current user with `"me"`.

| Parameter | Type             | Description     |
| --------- | ---------------- | --------------- |
| `id`      | `number \| "me"` | User ID or "me" |

**Returns:** `CTFdUser`

### `users.create(data, notify?)` [Admin]

Create a new user.

| Parameter | Type                | Description             |
| --------- | ------------------- | ----------------------- |
| `data`    | `Partial<CTFdUser>` | User data               |
| `notify`  | `boolean`           | Send email notification |

**Returns:** `CTFdUser`

### `users.update(id, data)`

Update a user.

**Returns:** `CTFdUser`

### `users.delete(id)` [Admin]

Delete a user.

**Returns:** `boolean`

### `users.email(id, text)` [Admin]

Send email to a user.

| Parameter | Type     | Description   |
| --------- | -------- | ------------- |
| `id`      | `number` | User ID       |
| `text`    | `string` | Email content |

**Returns:** `boolean`

### `users.getSolves(id)`

Get user's solves.

**Returns:** `any[]`

### `users.getFails(id)`

Get user's failed attempts.

**Returns:** `any[]`

### `users.getAwards(id)`

Get user's awards.

**Returns:** `CTFdAward[]`

### `users.getSubmissions(id)`

Get current user's submissions (only works with `"me"`).

**Returns:** `CTFdSubmission[]`

---

## Teams

### `teams.list(query?)`

List teams with pagination.

**Returns:** `CTFdResponse<CTFdTeam[]>`

### `teams.get(id)`

Get a team by ID or current team with `"me"`.

**Returns:** `CTFdTeam`

### `teams.create(data)`

Create a new team.

**Returns:** `CTFdTeam`

### `teams.update(id, data)`

Update a team.

**Returns:** `CTFdTeam`

### `teams.delete(id)`

Delete a team.

**Returns:** `boolean`

### `teams.getSolves(id)`

Get team's solves.

**Returns:** `any[]`

### `teams.getFails(id)`

Get team's failed attempts.

**Returns:** `any[]`

### `teams.getAwards(id)`

Get team's awards.

**Returns:** `CTFdAward[]`

### `teams.getMembers(id)`

Get team member IDs.

**Returns:** `number[]`

### `teams.removeMember(teamId, userId)` [Admin/Captain]

Remove a member from a team.

**Returns:** `boolean`

---

## Scoreboard

### `scoreboard.get()`

Get full scoreboard.

**Returns:** `any[]`

### `scoreboard.getTop(count)`

Get top N entries.

| Parameter | Type     | Description       |
| --------- | -------- | ----------------- |
| `count`   | `number` | Number of entries |

**Returns:** `any`

---

## Submissions

### `submissions.list(query?)`

List submissions with filters.

| Parameter            | Type     | Description     |
| -------------------- | -------- | --------------- |
| `query.challenge_id` | `number` | Filter by chall |
| `query.user_id`      | `number` | Filter by user  |
| `query.team_id`      | `number` | Filter by team  |
| `query.type`         | `string` | Submission type |

**Returns:** `CTFdResponse<CTFdSubmission[]>`

### `submissions.get(id)`

Get a submission.

**Returns:** `CTFdSubmission`

### `submissions.delete(id)` [Admin]

Delete a submission.

**Returns:** `boolean`

---

## Awards

### `awards.list(query?)`

List awards.

**Returns:** `CTFdAward[]`

### `awards.get(id)`

Get an award.

**Returns:** `CTFdAward`

### `awards.create(data)` [Admin]

Create an award.

**Returns:** `CTFdAward`

### `awards.delete(id)` [Admin]

Delete an award.

**Returns:** `boolean`

---

## Files

### `files.list(query?)`

List files.

**Returns:** `CTFdFile[]`

### `files.get(id)`

Get a file.

**Returns:** `CTFdFile`

### `files.create(file, params)` [Admin]

Upload a file.

| Parameter             | Type           | Description         |
| --------------------- | -------------- | ------------------- |
| `file`                | `Blob \| File` | File to upload      |
| `params.challenge_id` | `number`       | Attach to challenge |
| `params.page_id`      | `number`       | Attach to page      |
| `params.type`         | `string`       | File type           |
| `params.location`     | `string`       | Storage location    |

**Returns:** `CTFdFile`

### `files.delete(id)` [Admin]

Delete a file.

**Returns:** `boolean`

---

## Pages

### `pages.list(query?)`

List pages.

**Returns:** `CTFdPage[]`

### `pages.get(id)`

Get a page.

**Returns:** `CTFdPage`

### `pages.create(data)` [Admin]

Create a page.

**Returns:** `CTFdPage`

### `pages.update(id, data)` [Admin]

Update a page.

**Returns:** `CTFdPage`

### `pages.delete(id)` [Admin]

Delete a page.

**Returns:** `boolean`

---

## Notifications

### `notifications.list(query?)`

List notifications.

| Parameter        | Type     | Description                |
| ---------------- | -------- | -------------------------- |
| `query.since_id` | `number` | Get notifications after ID |

**Returns:** `CTFdNotification[]`

### `notifications.create(data)` [Admin]

Create a notification.

**Returns:** `CTFdNotification`

### `notifications.delete(id)` [Admin]

Delete a notification.

**Returns:** `boolean`

---

## Configs

### `configs.list(query?)`

List config entries.

**Returns:** `CTFdConfig[]`

### `configs.get(key)`

Get a config value.

**Returns:** `CTFdConfig`

### `configs.create(data)` [Admin]

Create a config entry.

**Returns:** `CTFdConfig`

### `configs.update(key, value)` [Admin]

Update a config value.

**Returns:** `CTFdConfig`

### `configs.delete(key)` [Admin]

Delete a config entry.

**Returns:** `boolean`

---

## Statistics

### `statistics.challenges.solves()`

Get challenge solve statistics.

### `statistics.challenges.percentages()`

Get solve percentages.

### `statistics.challenges.propertyCounts(column)`

Get counts grouped by column.

### `statistics.scores.distribution()`

Get score distribution.

### `statistics.teams()`

Get team statistics.

### `statistics.users.general()`

Get user statistics.

### `statistics.users.propertyCounts(column)`

Get user counts grouped by column.

### `statistics.submissions.propertyCounts(column)`

Get submission counts grouped by column.

---

## Flags

### `flags.list(query?)`

**Returns:** `CTFdFlag[]`

### `flags.create(data)` [Admin]

**Returns:** `CTFdFlag`

### `flags.update(id, data)` [Admin]

**Returns:** `CTFdFlag`

### `flags.delete(id)` [Admin]

**Returns:** `boolean`

### `flags.getTypes()`

Get available flag types.

---

## Hints

### `hints.list(query?)`

**Returns:** `CTFdHint[]`

### `hints.create(data)` [Admin]

**Returns:** `CTFdHint`

### `hints.update(id, data)` [Admin]

**Returns:** `CTFdHint`

### `hints.delete(id)` [Admin]

**Returns:** `boolean`

---

## Tags

### `tags.list(query?)`

**Returns:** `CTFdTag[]`

### `tags.create(data)` [Admin]

**Returns:** `CTFdTag`

### `tags.update(id, data)` [Admin]

**Returns:** `CTFdTag`

### `tags.delete(id)` [Admin]

**Returns:** `boolean`

---

## Topics

### `topics.list(query?)`

**Returns:** `CTFdTopic[]`

### `topics.create(data)` [Admin]

**Returns:** `CTFdTopic`

### `topics.delete(id)` [Admin]

**Returns:** `boolean`

---

## Unlocks

### `unlocks.list(query?)`

List user's unlocks.

**Returns:** `any[]`

### `unlocks.create(targetId, type)`

Unlock a hint or solution.

| Parameter  | Type                     | Description      |
| ---------- | ------------------------ | ---------------- |
| `targetId` | `number`                 | Hint/Solution ID |
| `type`     | `"hints" \| "solutions"` | Resource type    |

**Returns:** `CTFdResponse<{ success: boolean }>`

---

## Tokens

### `tokens.list()`

List API tokens.

**Returns:** `CTFdToken[]`

### `tokens.create(data)`

Create an API token.

| Parameter          | Type     | Description       |
| ------------------ | -------- | ----------------- |
| `data.expiration`  | `string` | ISO date string   |
| `data.description` | `string` | Token description |

**Returns:** `CTFdToken` (includes `value` on creation only)

### `tokens.delete(id)`

Delete an API token.

**Returns:** `boolean`

---

## Solutions

### `solutions.list(query?)`

**Returns:** `CTFdSolution[]`

### `solutions.create(data)` [Admin]

**Returns:** `CTFdSolution`

### `solutions.update(id, data)` [Admin]

**Returns:** `CTFdSolution`

### `solutions.delete(id)` [Admin]

**Returns:** `boolean`

---

## Types

### CTFdResponse\<T\>

```typescript
interface CTFdResponse<T = any> {
  success: boolean;
  data?: T;
  errors?: string[];
  message?: string;
  meta?: {
    pagination?: {
      page: number;
      next?: number;
      prev?: number;
      pages: number;
      per_page: number;
      total: number;
    };
  };
}
```

### CTFdChallenge

```typescript
interface CTFdChallenge {
  id: number;
  name: string;
  value: number;
  category: string;
  type: string;
  state: string;
  description?: string;
  connection_info?: string;
  max_attempts?: number;
  next_id?: number;
  attribution?: string;
  solves?: number;
  solved_by_me?: boolean;
  requirements?: any;
}
```

### CTFdUser

```typescript
interface CTFdUser {
  id: number;
  name: string;
  email?: string;
  score?: number;
  type?: string;
  admin?: boolean;
  banned?: boolean;
  hidden?: boolean;
  verified?: boolean;
  country?: string;
  affiliation?: string;
  website?: string;
  oauth_id?: number;
  team_id?: number;
  bracket_id?: number;
  created?: string;
}
```

### CTFdTeam

```typescript
interface CTFdTeam {
  id: number;
  name: string;
  email?: string;
  score?: number;
  admin?: boolean;
  banned?: boolean;
  hidden?: boolean;
  country?: string;
  affiliation?: string;
  website?: string;
  captain_id?: number;
  oauth_id?: number;
  bracket_id?: number;
  members?: number[];
  created?: string;
}
```

### CTFdFlag

```typescript
interface CTFdFlag {
  id: number;
  challenge_id: number;
  content: string;
  type: string; // 'static' | 'regex'
  data?: string;
}
```

### CTFdHint

```typescript
interface CTFdHint {
  id: number;
  challenge_id: number;
  content: string;
  cost: number;
  type: string;
  requirements?: any;
}
```

### CTFdFile

```typescript
interface CTFdFile {
  id: number;
  type: string;
  location: string;
  sha1sum?: string;
}
```

### CTFdAward

```typescript
interface CTFdAward {
  id: number;
  user_id?: number;
  team_id?: number;
  name?: string;
  description?: string;
  value: number;
  category?: string;
  icon?: string;
  date?: string;
  requirements?: any;
}
```

### CTFdSubmission

```typescript
interface CTFdSubmission {
  id: number;
  challenge_id: number;
  user_id: number;
  team_id?: number;
  ip?: string;
  provided: string;
  type: string;
  date: string;
}
```

### CTFdNotification

```typescript
interface CTFdNotification {
  id: number;
  title: string;
  content: string;
  date: string;
  user_id?: number;
  team_id?: number;
}
```

### CTFdPage

```typescript
interface CTFdPage {
  id: number;
  title: string;
  route: string;
  content: string;
  draft: boolean;
  hidden: boolean;
  auth_required: boolean;
  format: string;
}
```

### CTFdConfig

```typescript
interface CTFdConfig {
  id: number;
  key: string;
  value: string;
}
```

### CTFdToken

```typescript
interface CTFdToken {
  id: number;
  type: string;
  user_id: number;
  created: string;
  expiration: string;
  description?: string;
  value?: string; // Only on creation
}
```

### CTFdSolution

```typescript
interface CTFdSolution {
  id: number;
  challenge_id: number;
  content: string;
  state: string; // 'visible' | 'hidden'
}
```

### CTFdTag

```typescript
interface CTFdTag {
  id: number;
  challenge_id: number;
  value: string;
}
```

### CTFdTopic

```typescript
interface CTFdTopic {
  id: number;
  value: string;
}
```
