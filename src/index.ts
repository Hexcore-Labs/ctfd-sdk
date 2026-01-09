/**
 * CTFd API Client SDK
 * Generated based on CTFd Swagger/OpenAPI 2.0 Definition (v1)
 *
 * Designed for Server-Side usage (Next.js Server Actions, Node.js).
 * Includes Public, User, and Admin API endpoints.
 */

import type { HeadersInit } from "bun";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

export interface CTFdResponse<T = any> {
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

// --- Resource Interfaces ---

export interface CTFdChallenge {
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
  [key: string]: any;
}

export interface CTFdTeam {
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
  [key: string]: any;
}

export interface CTFdUser {
  id: number;
  name: string;
  email?: string;
  score?: number;
  type?: string; // 'admin' | 'user'
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
  [key: string]: any;
}

export interface CTFdAward {
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

export interface CTFdTag {
  id: number;
  challenge_id: number;
  value: string;
}

export interface CTFdTopic {
  id: number;
  value: string;
}

export interface CTFdHint {
  id: number;
  challenge_id: number;
  content: string;
  cost: number;
  type: string;
  requirements?: any;
}

export interface CTFdFlag {
  id: number;
  challenge_id: number;
  content: string;
  type: string; // 'static' | 'regex'
  data?: string; // Case insensitive info etc
}

export interface CTFdFile {
  id: number;
  type: string;
  location: string;
  sha1sum?: string;
}

export interface CTFdNotification {
  id: number;
  title: string;
  content: string;
  date: string;
  user_id?: number;
  team_id?: number;
}

export interface CTFdPage {
  id: number;
  title: string;
  route: string;
  content: string;
  draft: boolean;
  hidden: boolean;
  auth_required: boolean;
  format: string;
}

export interface CTFdConfig {
  id: number;
  key: string;
  value: string;
}

export interface CTFdSubmission {
  id: number;
  challenge_id: number;
  user_id: number;
  team_id?: number;
  ip?: string;
  provided: string;
  type: string;
  date: string;
}

export interface CTFdSolution {
  id: number;
  challenge_id: number;
  content: string;
  state: string; // 'visible' | 'hidden'
}

export interface CTFdToken {
  id: number;
  type: string;
  user_id: number;
  created: string;
  expiration: string;
  description?: string;
  value?: string; // Only visible on creation
}

// --- Client Options ---

export interface CTFdClientOptions {
  /** The base URL of the CTFd instance (e.g., https://demo.ctfd.io) */
  url: string;
  /** API Access Token generated in CTFd Settings */
  apiKey?: string;
  /** Session cookie (if not using API Key) */
  sessionCookie?: string;
  /** CSRF Token (required if using sessionCookie for state-changing requests) */
  csrfToken?: string;
}

/* -------------------------------------------------------------------------- */
/*                                MAIN CLASS                                  */
/* -------------------------------------------------------------------------- */

export class CTFdClient {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor(options: CTFdClientOptions) {
    this.baseUrl = options.url.replace(/\/$/, ""); // Remove trailing slash

    this.headers = {
      Accept: "application/json",
      // 'Content-Type': 'application/json' is set dynamically because FormData cannot have it set manually
    };

    if (options.apiKey) {
      this.headers["Authorization"] = `Token ${options.apiKey}`;
    }

    if (options.sessionCookie) {
      this.headers["Cookie"] = `session=${options.sessionCookie}`;
    }

    if (options.csrfToken) {
      this.headers["CSRF-Token"] = options.csrfToken;
    }
  }

  /**
   * Internal fetch wrapper
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<CTFdResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    // Manage Content-Type: If body is FormData, delete Content-Type to let browser/node set boundary
    const headers = { ...this.headers, ...options.headers } as Record<
      string,
      string
    >;
    if (options.body instanceof FormData) {
      delete headers["Content-Type"];
    } else if (!headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const fetchOptions: RequestInit = {
      ...options,
      headers,
      credentials: "include",
    };

    const response = await fetch(url, fetchOptions);

    let body: any;
    try {
      // HEAD requests might not have body
      if (options.method === "HEAD") return { success: response.ok } as any;
      body = await response.json();
    } catch (e) {
      // If delete or other methods return 200 OK but empty body
      if (response.ok) return { success: true } as any;
      throw new Error(
        `CTFd API Error: Failed to parse JSON from ${endpoint}. Status: ${response.status}`
      );
    }

    if (!response.ok) {
      // CTFd usually returns { success: false, errors: [] }
      throw new Error(
        body.errors?.join(", ") ||
          body.message ||
          `API Error ${response.status}`
      );
    }

    return body;
  }

  // =========================================================================
  // Challenges
  // =========================================================================

  public challenges = {
    /** List challenges (public or admin view depending on auth) */
    list: async (
      query: Partial<CTFdChallenge> & {
        q?: string;
        field?: string;
        view?: "admin" | "user";
      } = {}
    ) => {
      const qs = new URLSearchParams(query as any).toString();
      return (await this.request<CTFdChallenge[]>(`/api/v1/challenges?${qs}`))
        .data!;
    },
    /** Get specific challenge details */
    get: async (id: number) => {
      return (await this.request<CTFdChallenge>(`/api/v1/challenges/${id}`))
        .data!;
    },
    /** Create a challenge (Admin) */
    create: async (data: Partial<CTFdChallenge>) => {
      return (
        await this.request<CTFdChallenge>("/api/v1/challenges", {
          method: "POST",
          body: JSON.stringify(data),
        })
      ).data!;
    },
    /** Update a challenge (Admin) */
    update: async (id: number, data: Partial<CTFdChallenge>) => {
      return (
        await this.request<CTFdChallenge>(`/api/v1/challenges/${id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        })
      ).data!;
    },
    /** Delete a challenge (Admin) */
    delete: async (id: number) => {
      return (
        await this.request<{ success: boolean }>(`/api/v1/challenges/${id}`, {
          method: "DELETE",
        })
      ).success;
    },
    /** Submit a flag */
    attempt: async (challengeId: number, submission: string) => {
      return (
        await this.request<{ status: string; message: string }>(
          "/api/v1/challenges/attempt",
          {
            method: "POST",
            body: JSON.stringify({ challenge_id: challengeId, submission }),
          }
        )
      ).data!;
    },
    /** Get list of challenge types available */
    getTypes: async () =>
      (
        await this.request<{ type: string; name: string }[]>(
          "/api/v1/challenges/types"
        )
      ).data!,
    /** Get Solves for a challenge */
    getSolves: async (id: number) =>
      (await this.request<any[]>(`/api/v1/challenges/${id}/solves`)).data!,
    /** Get Files for a challenge */
    getFiles: async (id: number) =>
      (await this.request<CTFdFile[]>(`/api/v1/challenges/${id}/files`)).data!,
    /** Get Flags for a challenge */
    getFlags: async (id: number) =>
      (await this.request<CTFdFlag[]>(`/api/v1/challenges/${id}/flags`)).data!,
    /** Get Hints for a challenge */
    getHints: async (id: number) =>
      (await this.request<CTFdHint[]>(`/api/v1/challenges/${id}/hints`)).data!,
    /** Get Requirements for a challenge */
    getRequirements: async (id: number) =>
      (await this.request<any>(`/api/v1/challenges/${id}/requirements`)).data!,
    /** Get Tags for a challenge */
    getTags: async (id: number) =>
      (await this.request<CTFdTag[]>(`/api/v1/challenges/${id}/tags`)).data!,
    /** Get Topics for a challenge */
    getTopics: async (id: number) =>
      (await this.request<CTFdTopic[]>(`/api/v1/challenges/${id}/topics`))
        .data!,
  };

  // =========================================================================
  // Users
  // =========================================================================

  public users = {
    list: async (
      query: {
        page?: number;
        q?: string;
        field?: string;
        affiliation?: string;
      } = {}
    ) => {
      const qs = new URLSearchParams(query as any).toString();
      return await this.request<CTFdUser[]>(`/api/v1/users?${qs}`);
    },
    get: async (id: number | "me") => {
      return (await this.request<CTFdUser>(`/api/v1/users/${id}`)).data!;
    },
    /** Create User (Admin) - pass ?notify=true in query if needed */
    create: async (data: Partial<CTFdUser>, notify = false) => {
      return (
        await this.request<CTFdUser>(`/api/v1/users?notify=${notify}`, {
          method: "POST",
          body: JSON.stringify(data),
        })
      ).data!;
    },
    /** Update User (Admin or 'me') */
    update: async (id: number | "me", data: Partial<CTFdUser>) => {
      return (
        await this.request<CTFdUser>(`/api/v1/users/${id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        })
      ).data!;
    },
    delete: async (id: number) => {
      return (await this.request(`/api/v1/users/${id}`, { method: "DELETE" }))
        .success;
    },
    /** Email a user (Admin) */
    email: async (id: number, text: string) => {
      return (
        await this.request(`/api/v1/users/${id}/email`, {
          method: "POST",
          body: JSON.stringify({ text }),
        })
      ).success;
    },
    getSolves: async (id: number | "me") =>
      (await this.request<any[]>(`/api/v1/users/${id}/solves`)).data!,
    getFails: async (id: number | "me") =>
      (await this.request<any[]>(`/api/v1/users/${id}/fails`)).data!,
    getAwards: async (id: number | "me") =>
      (await this.request<CTFdAward[]>(`/api/v1/users/${id}/awards`)).data!,
    getSubmissions: async (id: "me") =>
      (await this.request<CTFdSubmission[]>(`/api/v1/users/${id}/submissions`))
        .data!,
  };

  // =========================================================================
  // Teams
  // =========================================================================

  public teams = {
    list: async (query: { page?: number; q?: string; field?: string } = {}) => {
      const qs = new URLSearchParams(query as any).toString();
      return await this.request<CTFdTeam[]>(`/api/v1/teams?${qs}`);
    },
    get: async (id: number | "me") => {
      return (await this.request<CTFdTeam>(`/api/v1/teams/${id}`)).data!;
    },
    create: async (data: Partial<CTFdTeam>) => {
      return (
        await this.request<CTFdTeam>("/api/v1/teams", {
          method: "POST",
          body: JSON.stringify(data),
        })
      ).data!;
    },
    update: async (id: number | "me", data: Partial<CTFdTeam>) => {
      return (
        await this.request<CTFdTeam>(`/api/v1/teams/${id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        })
      ).data!;
    },
    delete: async (id: number | "me") => {
      return (await this.request(`/api/v1/teams/${id}`, { method: "DELETE" }))
        .success;
    },
    getSolves: async (id: number | "me") =>
      (await this.request<any[]>(`/api/v1/teams/${id}/solves`)).data!,
    getFails: async (id: number | "me") =>
      (await this.request<any[]>(`/api/v1/teams/${id}/fails`)).data!,
    getAwards: async (id: number | "me") =>
      (await this.request<CTFdAward[]>(`/api/v1/teams/${id}/awards`)).data!,
    getMembers: async (id: number | "me") =>
      (await this.request<number[]>(`/api/v1/teams/${id}/members`)).data!,
    /** Remove member from team */
    removeMember: async (teamId: number, userId: number) => {
      return (
        await this.request(`/api/v1/teams/${teamId}/members`, {
          method: "DELETE",
          body: JSON.stringify({ user_id: userId }),
        })
      ).success;
    },
  };

  // =========================================================================
  // Scoreboard
  // =========================================================================

  public scoreboard = {
    get: async () => (await this.request<any[]>("/api/v1/scoreboard")).data!,
    getTop: async (count: number) =>
      (await this.request<any>(`/api/v1/scoreboard/top/${count}`)).data!,
  };

  // =========================================================================
  // Submissions (Review)
  // =========================================================================

  public submissions = {
    list: async (
      query: {
        challenge_id?: number;
        user_id?: number;
        team_id?: number;
        type?: string;
        q?: string;
      } = {}
    ) => {
      const qs = new URLSearchParams(query as any).toString();
      return await this.request<CTFdSubmission[]>(`/api/v1/submissions?${qs}`);
    },
    get: async (id: number) =>
      (await this.request<CTFdSubmission>(`/api/v1/submissions/${id}`)).data!,
    delete: async (id: number) =>
      (await this.request(`/api/v1/submissions/${id}`, { method: "DELETE" }))
        .success,
  };

  // =========================================================================
  // Awards
  // =========================================================================

  public awards = {
    list: async (
      query: { user_id?: number; team_id?: number; q?: string } = {}
    ) => {
      const qs = new URLSearchParams(query as any).toString();
      return (await this.request<CTFdAward[]>(`/api/v1/awards?${qs}`)).data!;
    },
    get: async (id: number) =>
      (await this.request<CTFdAward>(`/api/v1/awards/${id}`)).data!,
    create: async (data: Partial<CTFdAward>) =>
      (
        await this.request<CTFdAward>("/api/v1/awards", {
          method: "POST",
          body: JSON.stringify(data),
        })
      ).data!,
    delete: async (id: number) =>
      (await this.request(`/api/v1/awards/${id}`, { method: "DELETE" }))
        .success,
  };

  // =========================================================================
  // Files
  // =========================================================================

  public files = {
    list: async (
      query: { type?: string; location?: string; q?: string } = {}
    ) => {
      const qs = new URLSearchParams(query as any).toString();
      return (await this.request<CTFdFile[]>(`/api/v1/files?${qs}`)).data!;
    },
    get: async (id: number) =>
      (await this.request<CTFdFile>(`/api/v1/files/${id}`)).data!,
    /**
     * Upload a file.
     * @param file The file object (Blob/File in browser, Buffer/Stream logic depends on environment, standard usage usually FormData compatible)
     * @param params Metadata like challenge_id, page_id, etc.
     */
    create: async (
      file: Blob | File,
      params: {
        challenge_id?: number;
        page_id?: number;
        type?: string;
        location?: string;
      }
    ) => {
      const formData = new FormData();
      formData.append("file", file);
      if (params.challenge_id)
        formData.append("challenge_id", params.challenge_id.toString());
      if (params.page_id) formData.append("page_id", params.page_id.toString());
      if (params.type) formData.append("type", params.type);
      if (params.location) formData.append("location", params.location);

      return (
        await this.request<CTFdFile>("/api/v1/files", {
          method: "POST",
          body: formData,
        })
      ).data!;
    },
    delete: async (id: number) =>
      (await this.request(`/api/v1/files/${id}`, { method: "DELETE" })).success,
  };

  // =========================================================================
  // Pages
  // =========================================================================

  public pages = {
    list: async (
      query: { draft?: boolean; hidden?: boolean; q?: string } = {}
    ) => {
      const qs = new URLSearchParams(query as any).toString();
      return (await this.request<CTFdPage[]>(`/api/v1/pages?${qs}`)).data!;
    },
    get: async (id: number) =>
      (await this.request<CTFdPage>(`/api/v1/pages/${id}`)).data!,
    create: async (data: Partial<CTFdPage>) =>
      (
        await this.request<CTFdPage>("/api/v1/pages", {
          method: "POST",
          body: JSON.stringify(data),
        })
      ).data!,
    update: async (id: number, data: Partial<CTFdPage>) =>
      (
        await this.request<CTFdPage>(`/api/v1/pages/${id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        })
      ).data!,
    delete: async (id: number) =>
      (await this.request(`/api/v1/pages/${id}`, { method: "DELETE" })).success,
  };

  // =========================================================================
  // Notifications
  // =========================================================================

  public notifications = {
    list: async (query: { since_id?: number; q?: string } = {}) => {
      const qs = new URLSearchParams(query as any).toString();
      return (
        await this.request<CTFdNotification[]>(`/api/v1/notifications?${qs}`)
      ).data!;
    },
    create: async (data: Partial<CTFdNotification>) =>
      (
        await this.request<CTFdNotification>("/api/v1/notifications", {
          method: "POST",
          body: JSON.stringify(data),
        })
      ).data!,
    delete: async (id: number) =>
      (await this.request(`/api/v1/notifications/${id}`, { method: "DELETE" }))
        .success,
  };

  // =========================================================================
  // Configs
  // =========================================================================

  public configs = {
    list: async (query: { key?: string; value?: string; q?: string } = {}) => {
      const qs = new URLSearchParams(query as any).toString();
      return (await this.request<CTFdConfig[]>(`/api/v1/configs?${qs}`)).data!;
    },
    get: async (key: string) =>
      (await this.request<CTFdConfig>(`/api/v1/configs/${key}`)).data!,
    create: async (data: CTFdConfig) =>
      (
        await this.request<CTFdConfig>("/api/v1/configs", {
          method: "POST",
          body: JSON.stringify(data),
        })
      ).data!,
    update: async (key: string, value: string) =>
      (
        await this.request<CTFdConfig>(`/api/v1/configs/${key}`, {
          method: "PATCH",
          body: JSON.stringify({ value }),
        })
      ).data!,
    delete: async (key: string) =>
      (await this.request(`/api/v1/configs/${key}`, { method: "DELETE" }))
        .success,
  };

  // =========================================================================
  // Statistics
  // =========================================================================

  public statistics = {
    challenges: {
      solves: async () =>
        (await this.request<any>("/api/v1/statistics/challenges/solves")).data!,
      percentages: async () =>
        (
          await this.request<any>(
            "/api/v1/statistics/challenges/solves/percentages"
          )
        ).data!,
      propertyCounts: async (column: string) =>
        (await this.request<any>(`/api/v1/statistics/challenges/${column}`))
          .data!,
    },
    scores: {
      distribution: async () =>
        (await this.request<any>("/api/v1/statistics/scores/distribution"))
          .data!,
    },
    teams: async () =>
      (await this.request<any>("/api/v1/statistics/teams")).data!,
    users: {
      general: async () =>
        (await this.request<any>("/api/v1/statistics/users")).data!,
      propertyCounts: async (column: string) =>
        (await this.request<any>(`/api/v1/statistics/users/${column}`)).data!,
    },
    submissions: {
      propertyCounts: async (column: string) =>
        (await this.request<any>(`/api/v1/statistics/submissions/${column}`))
          .data!,
    },
  };

  // =========================================================================
  // System / Misc (Flags, Hints, Tags, Topics, Unlocks, Tokens)
  // =========================================================================

  public flags = {
    list: async (query?: any) =>
      (
        await this.request<CTFdFlag[]>(
          `/api/v1/flags?${new URLSearchParams(query)}`
        )
      ).data!,
    create: async (data: Partial<CTFdFlag>) =>
      (
        await this.request<CTFdFlag>("/api/v1/flags", {
          method: "POST",
          body: JSON.stringify(data),
        })
      ).data!,
    update: async (id: number, data: Partial<CTFdFlag>) =>
      (
        await this.request<CTFdFlag>(`/api/v1/flags/${id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        })
      ).data!,
    delete: async (id: number) =>
      (await this.request(`/api/v1/flags/${id}`, { method: "DELETE" })).success,
    getTypes: async () => (await this.request<any>("/api/v1/flags/types")).data,
  };

  public hints = {
    list: async (query?: any) =>
      (
        await this.request<CTFdHint[]>(
          `/api/v1/hints?${new URLSearchParams(query)}`
        )
      ).data!,
    create: async (data: Partial<CTFdHint>) =>
      (
        await this.request<CTFdHint>("/api/v1/hints", {
          method: "POST",
          body: JSON.stringify(data),
        })
      ).data!,
    update: async (id: number, data: Partial<CTFdHint>) =>
      (
        await this.request<CTFdHint>(`/api/v1/hints/${id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        })
      ).data!,
    delete: async (id: number) =>
      (await this.request(`/api/v1/hints/${id}`, { method: "DELETE" })).success,
  };

  public tags = {
    list: async (query?: any) =>
      (
        await this.request<CTFdTag[]>(
          `/api/v1/tags?${new URLSearchParams(query)}`
        )
      ).data!,
    create: async (data: Partial<CTFdTag>) =>
      (
        await this.request<CTFdTag>("/api/v1/tags", {
          method: "POST",
          body: JSON.stringify(data),
        })
      ).data!,
    update: async (id: number, data: Partial<CTFdTag>) =>
      (
        await this.request<CTFdTag>(`/api/v1/tags/${id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        })
      ).data!,
    delete: async (id: number) =>
      (await this.request(`/api/v1/tags/${id}`, { method: "DELETE" })).success,
  };

  public topics = {
    list: async (query?: any) =>
      (
        await this.request<CTFdTopic[]>(
          `/api/v1/topics?${new URLSearchParams(query)}`
        )
      ).data!,
    create: async (data: Partial<CTFdTopic>) =>
      (
        await this.request<CTFdTopic>("/api/v1/topics", {
          method: "POST",
          body: JSON.stringify(data),
        })
      ).data!,
    delete: async (id: number) =>
      (await this.request(`/api/v1/topics/${id}`, { method: "DELETE" }))
        .success,
  };

  public unlocks = {
    list: async (query?: any) =>
      (
        await this.request<any[]>(
          `/api/v1/unlocks?${new URLSearchParams(query)}`
        )
      ).data!,
    create: async (targetId: number, type: "hints" | "solutions") => {
      return await this.request<{ success: boolean; errors?: any }>(
        "/api/v1/unlocks",
        {
          method: "POST",
          body: JSON.stringify({ target: targetId, type }),
        }
      );
    },
  };

  public tokens = {
    list: async () => (await this.request<CTFdToken[]>("/api/v1/tokens")).data!,
    create: async (data: { expiration?: string; description?: string }) =>
      (
        await this.request<CTFdToken>("/api/v1/tokens", {
          method: "POST",
          body: JSON.stringify(data),
        })
      ).data!,
    delete: async (id: number) =>
      (await this.request(`/api/v1/tokens/${id}`, { method: "DELETE" }))
        .success,
  };

  public solutions = {
    list: async (query?: any) =>
      (
        await this.request<CTFdSolution[]>(
          `/api/v1/solutions?${new URLSearchParams(query)}`
        )
      ).data!,
    create: async (data: Partial<CTFdSolution>) =>
      (
        await this.request<CTFdSolution>("/api/v1/solutions", {
          method: "POST",
          body: JSON.stringify(data),
        })
      ).data!,
    update: async (id: number, data: Partial<CTFdSolution>) =>
      (
        await this.request<CTFdSolution>(`/api/v1/solutions/${id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        })
      ).data!,
    delete: async (id: number) =>
      (await this.request(`/api/v1/solutions/${id}`, { method: "DELETE" }))
        .success,
  };
}
