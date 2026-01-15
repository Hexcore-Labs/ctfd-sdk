/**
 * CTFd TypeScript SDK
 * Generated based on CTFd v3 API Specification
 */

// ==========================================
// Core Types & Interfaces
// ==========================================

export interface APISuccessResponse<T> {
  success: true;
  data: T;
}

export interface APIPaginatedResponse<T> {
  success: true;
  data: T[];
  meta: {
    pagination: {
      page: number;
      next: number | null;
      prev: number | null;
      pages: number;
      per_page: number;
      total: number;
    };
  };
}

export interface APIErrorResponse {
  success: false;
  errors: string[];
}

export type APIResponse<T> = APISuccessResponse<T> | APIPaginatedResponse<T>;

// --- Model Definitions (Mapped from swagger.json) ---

export interface User {
  id: number;
  name: string;
  email?: string;
  type?: string;
  oauth_id?: number;
  team_id?: number;
  website?: string;
  affiliation?: string;
  country?: string;
  bracket?: string;
  hidden?: boolean;
  banned?: boolean;
  verified?: boolean;
  created?: string;
}

export interface Team {
  id: number;
  name: string;
  email?: string;
  oauth_id?: number;
  captain_id?: number;
  website?: string;
  affiliation?: string;
  country?: string;
  bracket?: string;
  hidden?: boolean;
  banned?: boolean;
  created?: string;
  secret?: string;
}

export interface Challenge {
  id: number;
  name: string;
  description: string;
  category: string;
  value: number;
  type: string;
  state: string;
  max_attempts?: number;
  requirements?: any;
  connection_info?: string;
  next_id?: number;
  files?: string[];
  solved_by_me?: boolean;
}

export interface Submission {
  id: number;
  challenge_id: number;
  user_id: number;
  team_id?: number;
  ip?: string;
  provided: string;
  type: string;
  date: string;
}

export interface Config {
  id: number;
  key: string;
  value: string;
}

export interface Notification {
  id: number;
  title: string;
  content: string;
  date: string;
  user_id?: number;
  team_id?: number;
}

export interface Page {
  id: number;
  title: string;
  route: string;
  content: string;
  draft: boolean;
  hidden: boolean;
  auth_required: boolean;
}

export interface Flag {
  id: number;
  challenge_id: number;
  type: string;
  content: string;
  data?: string;
}

export interface Hint {
  id: number;
  challenge_id: number;
  content: string;
  cost: number;
  type: string;
  requirements?: any;
}

export interface Award {
  id: number;
  user_id?: number;
  team_id?: number;
  name: string;
  description?: string;
  value: number;
  category?: string;
  icon?: string;
  date: string;
  requirements?: any;
}

export interface File {
  id: number;
  type: string;
  location: string;
}

export interface Tag {
  id: number;
  challenge_id: number;
  value: string;
}

export interface Token {
  id: number;
  type: string;
  user_id: number;
  value?: string;
  created: string;
  expiration: string;
}

export interface Unlock {
  id: number;
  user_id: number;
  team_id?: number;
  target: number;
  type: string;
  date: string;
}

// --- Query Parameters Interfaces ---

export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface ChallengeSearchParams extends PaginationParams {
  name?: string;
  max_attempts?: number;
  value?: number;
  category?: string;
  type?: string;
  state?: string;
  q?: string;
  field?: "name" | "description" | "category" | "type" | "state";
}

export interface UserSearchParams extends PaginationParams {
  affiliation?: string;
  country?: string;
  bracket?: string;
  q?: string;
  field?: "name" | "website" | "country" | "bracket" | "affiliation";
}

export interface TeamSearchParams extends PaginationParams {
  affiliation?: string;
  country?: string;
  bracket?: string;
  q?: string;
  field?: "name" | "website" | "country" | "bracket" | "affiliation";
}

export interface SubmissionSearchParams extends PaginationParams {
  challenge_id?: number;
  user_id?: number;
  team_id?: number;
  ip?: string;
  provided?: string;
  type?: string;
  q?: string;
  field?: "challenge_id" | "user_id" | "team_id" | "ip" | "provided" | "type";
}

// ==========================================
// Base Client
// ==========================================

export class CTFdClient {
  private baseURL: string;
  private accessToken: string;
  private headers: HeadersInit;

  public users: UsersResource;
  public teams: TeamsResource;
  public challenges: ChallengesResource;
  public scoreboard: ScoreboardResource;
  public submissions: SubmissionsResource;
  public configs: ConfigsResource;
  public notifications: NotificationsResource;
  public pages: PagesResource;
  public flags: FlagsResource;
  public hints: HintsResource;
  public files: FilesResource;
  public awards: AwardsResource;
  public tags: TagsResource;
  public tokens: TokensResource;
  public unlocks: UnlocksResource;
  public statistics: StatisticsResource;

  constructor(baseURL: string, accessToken: string) {
    this.baseURL = baseURL.replace(/\/$/, ""); // Remove trailing slash
    this.accessToken = accessToken;
    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${this.accessToken}`,
    };

    // Initialize Resources
    this.users = new UsersResource(this);
    this.teams = new TeamsResource(this);
    this.challenges = new ChallengesResource(this);
    this.scoreboard = new ScoreboardResource(this);
    this.submissions = new SubmissionsResource(this);
    this.configs = new ConfigsResource(this);
    this.notifications = new NotificationsResource(this);
    this.pages = new PagesResource(this);
    this.flags = new FlagsResource(this);
    this.hints = new HintsResource(this);
    this.files = new FilesResource(this);
    this.awards = new AwardsResource(this);
    this.tags = new TagsResource(this);
    this.tokens = new TokensResource(this);
    this.unlocks = new UnlocksResource(this);
    this.statistics = new StatisticsResource(this);
  }

  public async request<T>(
    method: "GET" | "POST" | "PATCH" | "DELETE",
    endpoint: string,
    body?: any,
    params?: any
  ): Promise<T> {
    const url = new URL(`${this.baseURL}/api/v1${endpoint}`);

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined) {
          url.searchParams.append(key, String(params[key]));
        }
      });
    }

    const config: RequestInit = {
      method,
      headers: this.headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url.toString(), config);
    const data = await response.json();

    if (!response.ok || data.success === false) {
      const errorMsg = data.errors
        ? data.errors.join(", ")
        : "Unknown API Error";
      throw new Error(`CTFd API Error [${response.status}]: ${errorMsg}`);
    }

    // Return the full response object (including meta/success) or just data depending on preference.
    // Here we return data directly for single items, or the paginated wrapper for lists.
    return data as T;
  }
}

// ==========================================
// Resources
// ==========================================

class BaseResource {
  constructor(protected client: CTFdClient) {}
}

export class ChallengesResource extends BaseResource {
  async list(
    params?: ChallengeSearchParams
  ): Promise<APIPaginatedResponse<Challenge>> {
    return this.client.request("GET", "/challenges", undefined, params);
  }

  async get(id: number): Promise<APISuccessResponse<Challenge>> {
    return this.client.request("GET", `/challenges/${id}`);
  }

  async create(
    data: Partial<Challenge>
  ): Promise<APISuccessResponse<Challenge>> {
    return this.client.request("POST", "/challenges", data);
  }

  async update(
    id: number,
    data: Partial<Challenge>
  ): Promise<APISuccessResponse<Challenge>> {
    return this.client.request("PATCH", `/challenges/${id}`, data);
  }

  async delete(id: number): Promise<APISuccessResponse<null>> {
    return this.client.request("DELETE", `/challenges/${id}`);
  }

  async attempt(
    challengeId: number,
    submission: string
  ): Promise<APISuccessResponse<{ status: string; message: string }>> {
    return this.client.request("POST", "/challenges/attempt", {
      challenge_id: challengeId,
      submission: submission,
    });
  }

  async getTypes(): Promise<APISuccessResponse<Record<string, any>>> {
    return this.client.request("GET", "/challenges/types");
  }

  async getSolves(id: number): Promise<APISuccessResponse<any[]>> {
    return this.client.request("GET", `/challenges/${id}/solves`);
  }

  async getFiles(id: number): Promise<APISuccessResponse<File[]>> {
    return this.client.request("GET", `/challenges/${id}/files`);
  }

  async getFlags(id: number): Promise<APISuccessResponse<Flag[]>> {
    return this.client.request("GET", `/challenges/${id}/flags`);
  }

  async getHints(id: number): Promise<APISuccessResponse<Hint[]>> {
    return this.client.request("GET", `/challenges/${id}/hints`);
  }

  async getTags(id: number): Promise<APISuccessResponse<Tag[]>> {
    return this.client.request("GET", `/challenges/${id}/tags`);
  }
}

export class UsersResource extends BaseResource {
  async list(params?: UserSearchParams): Promise<APIPaginatedResponse<User>> {
    return this.client.request("GET", "/users", undefined, params);
  }

  async get(id: number): Promise<APISuccessResponse<User>> {
    return this.client.request("GET", `/users/${id}`);
  }

  async create(
    data: Partial<User>,
    notify?: boolean
  ): Promise<APISuccessResponse<User>> {
    return this.client.request("POST", "/users", data, { notify });
  }

  async update(
    id: number,
    data: Partial<User>
  ): Promise<APISuccessResponse<User>> {
    return this.client.request("PATCH", `/users/${id}`, data);
  }

  async delete(id: number): Promise<APISuccessResponse<null>> {
    return this.client.request("DELETE", `/users/${id}`);
  }

  async getMe(): Promise<APISuccessResponse<User>> {
    return this.client.request("GET", "/users/me");
  }

  async updateMe(data: Partial<User>): Promise<APISuccessResponse<User>> {
    return this.client.request("PATCH", "/users/me", data);
  }

  async getSolves(id: number | "me"): Promise<APISuccessResponse<any[]>> {
    return this.client.request("GET", `/users/${id}/solves`);
  }

  async getFails(id: number | "me"): Promise<APISuccessResponse<any[]>> {
    return this.client.request("GET", `/users/${id}/fails`);
  }

  async getAwards(id: number | "me"): Promise<APISuccessResponse<Award[]>> {
    return this.client.request("GET", `/users/${id}/awards`);
  }

  async email(id: number, text: string): Promise<APISuccessResponse<null>> {
    return this.client.request("POST", `/users/${id}/email`, { text });
  }
}

export class TeamsResource extends BaseResource {
  async list(params?: TeamSearchParams): Promise<APIPaginatedResponse<Team>> {
    return this.client.request("GET", "/teams", undefined, params);
  }

  async get(id: number): Promise<APISuccessResponse<Team>> {
    return this.client.request("GET", `/teams/${id}`);
  }

  async create(data: Partial<Team>): Promise<APISuccessResponse<Team>> {
    return this.client.request("POST", "/teams", data);
  }

  async update(
    id: number,
    data: Partial<Team>
  ): Promise<APISuccessResponse<Team>> {
    return this.client.request("PATCH", `/teams/${id}`, data);
  }

  async delete(id: number): Promise<APISuccessResponse<null>> {
    return this.client.request("DELETE", `/teams/${id}`);
  }

  async getMe(): Promise<APISuccessResponse<Team>> {
    return this.client.request("GET", "/teams/me");
  }

  async updateMe(data: Partial<Team>): Promise<APISuccessResponse<Team>> {
    return this.client.request("PATCH", "/teams/me", data);
  }

  async getSolves(id: number | "me"): Promise<APISuccessResponse<any[]>> {
    return this.client.request("GET", `/teams/${id}/solves`);
  }

  async getFails(id: number | "me"): Promise<APISuccessResponse<any[]>> {
    return this.client.request("GET", `/teams/${id}/fails`);
  }

  async getAwards(id: number | "me"): Promise<APISuccessResponse<Award[]>> {
    return this.client.request("GET", `/teams/${id}/awards`);
  }

  async getMembers(id: number): Promise<APISuccessResponse<User[]>> {
    return this.client.request("GET", `/teams/${id}/members`);
  }
}

export class SubmissionsResource extends BaseResource {
  async list(
    params?: SubmissionSearchParams
  ): Promise<APIPaginatedResponse<Submission>> {
    return this.client.request("GET", "/submissions", undefined, params);
  }

  // NOTE: 'create' usually refers to Admin creating a record, not a user solving a challenge (see challenges.attempt)
  async create(
    data: Partial<Submission>
  ): Promise<APISuccessResponse<Submission>> {
    return this.client.request("POST", "/submissions", data);
  }

  async get(id: number): Promise<APISuccessResponse<Submission>> {
    return this.client.request("GET", `/submissions/${id}`);
  }

  async delete(id: number): Promise<APISuccessResponse<null>> {
    return this.client.request("DELETE", `/submissions/${id}`);
  }
}

export class ScoreboardResource extends BaseResource {
  async get(): Promise<APISuccessResponse<any[]>> {
    return this.client.request("GET", "/scoreboard");
  }

  async getTop(count: number): Promise<APISuccessResponse<any>> {
    return this.client.request("GET", `/scoreboard/top/${count}`);
  }
}

export class ConfigsResource extends BaseResource {
  async list(params?: {
    key?: string;
    value?: string;
  }): Promise<APIPaginatedResponse<Config>> {
    return this.client.request("GET", "/configs", undefined, params);
  }

  async get(key: string): Promise<APISuccessResponse<Config>> {
    return this.client.request("GET", `/configs/${key}`);
  }

  async create(data: {
    key: string;
    value: string;
  }): Promise<APISuccessResponse<Config>> {
    return this.client.request("POST", "/configs", data);
  }

  async update(
    key: string,
    value: string
  ): Promise<APISuccessResponse<Config>> {
    return this.client.request("PATCH", `/configs/${key}`, { value });
  }

  async delete(key: string): Promise<APISuccessResponse<null>> {
    return this.client.request("DELETE", `/configs/${key}`);
  }
}

export class NotificationsResource extends BaseResource {
  async list(params?: {
    title?: string;
    content?: string;
  }): Promise<APIPaginatedResponse<Notification>> {
    return this.client.request("GET", "/notifications", undefined, params);
  }

  async create(
    data: Partial<Notification>
  ): Promise<APISuccessResponse<Notification>> {
    return this.client.request("POST", "/notifications", data);
  }

  async get(id: number): Promise<APISuccessResponse<Notification>> {
    return this.client.request("GET", `/notifications/${id}`);
  }

  async delete(id: number): Promise<APISuccessResponse<null>> {
    return this.client.request("DELETE", `/notifications/${id}`);
  }
}

export class PagesResource extends BaseResource {
  async list(params?: any): Promise<APIPaginatedResponse<Page>> {
    return this.client.request("GET", "/pages", undefined, params);
  }

  async create(data: Partial<Page>): Promise<APISuccessResponse<Page>> {
    return this.client.request("POST", "/pages", data);
  }

  async get(id: number): Promise<APISuccessResponse<Page>> {
    return this.client.request("GET", `/pages/${id}`);
  }

  async update(
    id: number,
    data: Partial<Page>
  ): Promise<APISuccessResponse<Page>> {
    return this.client.request("PATCH", `/pages/${id}`, data);
  }

  async delete(id: number): Promise<APISuccessResponse<null>> {
    return this.client.request("DELETE", `/pages/${id}`);
  }
}

export class FlagsResource extends BaseResource {
  async list(params?: {
    challenge_id?: number;
    type?: string;
  }): Promise<APIPaginatedResponse<Flag>> {
    return this.client.request("GET", "/flags", undefined, params);
  }

  async create(data: Partial<Flag>): Promise<APISuccessResponse<Flag>> {
    return this.client.request("POST", "/flags", data);
  }

  async get(id: number): Promise<APISuccessResponse<Flag>> {
    return this.client.request("GET", `/flags/${id}`);
  }

  async update(
    id: number,
    data: Partial<Flag>
  ): Promise<APISuccessResponse<Flag>> {
    return this.client.request("PATCH", `/flags/${id}`, data);
  }

  async delete(id: number): Promise<APISuccessResponse<null>> {
    return this.client.request("DELETE", `/flags/${id}`);
  }

  async getTypes(): Promise<APISuccessResponse<Record<string, any>>> {
    return this.client.request("GET", "/flags/types");
  }
}

export class HintsResource extends BaseResource {
  async list(params?: {
    challenge_id?: number;
  }): Promise<APIPaginatedResponse<Hint>> {
    return this.client.request("GET", "/hints", undefined, params);
  }

  async create(data: Partial<Hint>): Promise<APISuccessResponse<Hint>> {
    return this.client.request("POST", "/hints", data);
  }

  async get(id: number): Promise<APISuccessResponse<Hint>> {
    return this.client.request("GET", `/hints/${id}`);
  }

  async update(
    id: number,
    data: Partial<Hint>
  ): Promise<APISuccessResponse<Hint>> {
    return this.client.request("PATCH", `/hints/${id}`, data);
  }

  async delete(id: number): Promise<APISuccessResponse<null>> {
    return this.client.request("DELETE", `/hints/${id}`);
  }
}

export class FilesResource extends BaseResource {
  async list(params?: {
    type?: string;
    location?: string;
  }): Promise<APIPaginatedResponse<File>> {
    return this.client.request("GET", "/files", undefined, params);
  }

  // File uploading usually requires FormData, handling partial here for metadata
  async create(data: any): Promise<APISuccessResponse<File>> {
    return this.client.request("POST", "/files", data);
  }

  async get(id: number): Promise<APISuccessResponse<File>> {
    return this.client.request("GET", `/files/${id}`);
  }

  async delete(id: number): Promise<APISuccessResponse<null>> {
    return this.client.request("DELETE", `/files/${id}`);
  }
}

export class AwardsResource extends BaseResource {
  async list(params?: {
    user_id?: number;
    team_id?: number;
  }): Promise<APIPaginatedResponse<Award>> {
    return this.client.request("GET", "/awards", undefined, params);
  }

  async create(data: Partial<Award>): Promise<APISuccessResponse<Award>> {
    return this.client.request("POST", "/awards", data);
  }

  async get(id: number): Promise<APISuccessResponse<Award>> {
    return this.client.request("GET", `/awards/${id}`);
  }

  async delete(id: number): Promise<APISuccessResponse<null>> {
    return this.client.request("DELETE", `/awards/${id}`);
  }
}

export class TagsResource extends BaseResource {
  async list(params?: {
    challenge_id?: number;
  }): Promise<APIPaginatedResponse<Tag>> {
    return this.client.request("GET", "/tags", undefined, params);
  }

  async create(data: Partial<Tag>): Promise<APISuccessResponse<Tag>> {
    return this.client.request("POST", "/tags", data);
  }

  async get(id: number): Promise<APISuccessResponse<Tag>> {
    return this.client.request("GET", `/tags/${id}`);
  }

  async update(
    id: number,
    data: Partial<Tag>
  ): Promise<APISuccessResponse<Tag>> {
    return this.client.request("PATCH", `/tags/${id}`, data);
  }

  async delete(id: number): Promise<APISuccessResponse<null>> {
    return this.client.request("DELETE", `/tags/${id}`);
  }
}

export class TokensResource extends BaseResource {
  async list(): Promise<APIPaginatedResponse<Token>> {
    return this.client.request("GET", "/tokens");
  }

  async create(data: Partial<Token>): Promise<APISuccessResponse<Token>> {
    return this.client.request("POST", "/tokens", data);
  }

  async get(id: number): Promise<APISuccessResponse<Token>> {
    return this.client.request("GET", `/tokens/${id}`);
  }

  async delete(id: number): Promise<APISuccessResponse<null>> {
    return this.client.request("DELETE", `/tokens/${id}`);
  }
}

export class UnlocksResource extends BaseResource {
  async list(params?: {
    user_id?: number;
    team_id?: number;
    target?: number;
    type?: string;
  }): Promise<APIPaginatedResponse<Unlock>> {
    return this.client.request("GET", "/unlocks", undefined, params);
  }

  async create(data: Partial<Unlock>): Promise<APISuccessResponse<Unlock>> {
    return this.client.request("POST", "/unlocks", data);
  }
}

export class StatisticsResource extends BaseResource {
  async getChallengeSolves(): Promise<APISuccessResponse<any>> {
    return this.client.request("GET", "/statistics/challenges/solves");
  }

  async getChallengeSolvePercentages(): Promise<APISuccessResponse<any>> {
    return this.client.request(
      "GET",
      "/statistics/challenges/solves/percentages"
    );
  }

  async getChallengePropertyCounts(
    column: string
  ): Promise<APISuccessResponse<any>> {
    return this.client.request("GET", `/statistics/challenges/${column}`);
  }

  async getScoreDistribution(): Promise<APISuccessResponse<any>> {
    return this.client.request("GET", "/statistics/scores/distribution");
  }

  async getSubmissionPropertyCounts(
    column: string
  ): Promise<APISuccessResponse<any>> {
    return this.client.request("GET", `/statistics/submissions/${column}`);
  }

  async getTeamStatistics(): Promise<APISuccessResponse<any>> {
    return this.client.request("GET", "/statistics/teams");
  }

  async getUserStatistics(): Promise<APISuccessResponse<any>> {
    return this.client.request("GET", "/statistics/users");
  }

  async getUserPropertyCounts(
    column: string
  ): Promise<APISuccessResponse<any>> {
    return this.client.request("GET", `/statistics/users/${column}`);
  }
}
