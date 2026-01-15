/**
 * CTFd TypeScript SDK
 * Generated based on CTFd v3 API Specification
 */
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
export declare class CTFdClient {
    private baseURL;
    private accessToken;
    private headers;
    users: UsersResource;
    teams: TeamsResource;
    challenges: ChallengesResource;
    scoreboard: ScoreboardResource;
    submissions: SubmissionsResource;
    configs: ConfigsResource;
    notifications: NotificationsResource;
    pages: PagesResource;
    flags: FlagsResource;
    hints: HintsResource;
    files: FilesResource;
    awards: AwardsResource;
    tags: TagsResource;
    tokens: TokensResource;
    unlocks: UnlocksResource;
    statistics: StatisticsResource;
    constructor(baseURL: string, accessToken: string);
    request<T>(method: "GET" | "POST" | "PATCH" | "DELETE", endpoint: string, body?: any, params?: any): Promise<T>;
}
declare class BaseResource {
    protected client: CTFdClient;
    constructor(client: CTFdClient);
}
export declare class ChallengesResource extends BaseResource {
    list(params?: ChallengeSearchParams): Promise<APIPaginatedResponse<Challenge>>;
    get(id: number): Promise<APISuccessResponse<Challenge>>;
    create(data: Partial<Challenge>): Promise<APISuccessResponse<Challenge>>;
    update(id: number, data: Partial<Challenge>): Promise<APISuccessResponse<Challenge>>;
    delete(id: number): Promise<APISuccessResponse<null>>;
    attempt(challengeId: number, submission: string): Promise<APISuccessResponse<{
        status: string;
        message: string;
    }>>;
    getTypes(): Promise<APISuccessResponse<Record<string, any>>>;
    getSolves(id: number): Promise<APISuccessResponse<any[]>>;
    getFiles(id: number): Promise<APISuccessResponse<File[]>>;
    getFlags(id: number): Promise<APISuccessResponse<Flag[]>>;
    getHints(id: number): Promise<APISuccessResponse<Hint[]>>;
    getTags(id: number): Promise<APISuccessResponse<Tag[]>>;
}
export declare class UsersResource extends BaseResource {
    list(params?: UserSearchParams): Promise<APIPaginatedResponse<User>>;
    get(id: number): Promise<APISuccessResponse<User>>;
    create(data: Partial<User>, notify?: boolean): Promise<APISuccessResponse<User>>;
    update(id: number, data: Partial<User>): Promise<APISuccessResponse<User>>;
    delete(id: number): Promise<APISuccessResponse<null>>;
    getMe(): Promise<APISuccessResponse<User>>;
    updateMe(data: Partial<User>): Promise<APISuccessResponse<User>>;
    getSolves(id: number | "me"): Promise<APISuccessResponse<any[]>>;
    getFails(id: number | "me"): Promise<APISuccessResponse<any[]>>;
    getAwards(id: number | "me"): Promise<APISuccessResponse<Award[]>>;
    email(id: number, text: string): Promise<APISuccessResponse<null>>;
}
export declare class TeamsResource extends BaseResource {
    list(params?: TeamSearchParams): Promise<APIPaginatedResponse<Team>>;
    get(id: number): Promise<APISuccessResponse<Team>>;
    create(data: Partial<Team>): Promise<APISuccessResponse<Team>>;
    update(id: number, data: Partial<Team>): Promise<APISuccessResponse<Team>>;
    delete(id: number): Promise<APISuccessResponse<null>>;
    getMe(): Promise<APISuccessResponse<Team>>;
    updateMe(data: Partial<Team>): Promise<APISuccessResponse<Team>>;
    getSolves(id: number | "me"): Promise<APISuccessResponse<any[]>>;
    getFails(id: number | "me"): Promise<APISuccessResponse<any[]>>;
    getAwards(id: number | "me"): Promise<APISuccessResponse<Award[]>>;
    getMembers(id: number): Promise<APISuccessResponse<User[]>>;
}
export declare class SubmissionsResource extends BaseResource {
    list(params?: SubmissionSearchParams): Promise<APIPaginatedResponse<Submission>>;
    create(data: Partial<Submission>): Promise<APISuccessResponse<Submission>>;
    get(id: number): Promise<APISuccessResponse<Submission>>;
    delete(id: number): Promise<APISuccessResponse<null>>;
}
export declare class ScoreboardResource extends BaseResource {
    get(): Promise<APISuccessResponse<any[]>>;
    getTop(count: number): Promise<APISuccessResponse<any>>;
}
export declare class ConfigsResource extends BaseResource {
    list(params?: {
        key?: string;
        value?: string;
    }): Promise<APIPaginatedResponse<Config>>;
    get(key: string): Promise<APISuccessResponse<Config>>;
    create(data: {
        key: string;
        value: string;
    }): Promise<APISuccessResponse<Config>>;
    update(key: string, value: string): Promise<APISuccessResponse<Config>>;
    delete(key: string): Promise<APISuccessResponse<null>>;
}
export declare class NotificationsResource extends BaseResource {
    list(params?: {
        title?: string;
        content?: string;
    }): Promise<APIPaginatedResponse<Notification>>;
    create(data: Partial<Notification>): Promise<APISuccessResponse<Notification>>;
    get(id: number): Promise<APISuccessResponse<Notification>>;
    delete(id: number): Promise<APISuccessResponse<null>>;
}
export declare class PagesResource extends BaseResource {
    list(params?: any): Promise<APIPaginatedResponse<Page>>;
    create(data: Partial<Page>): Promise<APISuccessResponse<Page>>;
    get(id: number): Promise<APISuccessResponse<Page>>;
    update(id: number, data: Partial<Page>): Promise<APISuccessResponse<Page>>;
    delete(id: number): Promise<APISuccessResponse<null>>;
}
export declare class FlagsResource extends BaseResource {
    list(params?: {
        challenge_id?: number;
        type?: string;
    }): Promise<APIPaginatedResponse<Flag>>;
    create(data: Partial<Flag>): Promise<APISuccessResponse<Flag>>;
    get(id: number): Promise<APISuccessResponse<Flag>>;
    update(id: number, data: Partial<Flag>): Promise<APISuccessResponse<Flag>>;
    delete(id: number): Promise<APISuccessResponse<null>>;
    getTypes(): Promise<APISuccessResponse<Record<string, any>>>;
}
export declare class HintsResource extends BaseResource {
    list(params?: {
        challenge_id?: number;
    }): Promise<APIPaginatedResponse<Hint>>;
    create(data: Partial<Hint>): Promise<APISuccessResponse<Hint>>;
    get(id: number): Promise<APISuccessResponse<Hint>>;
    update(id: number, data: Partial<Hint>): Promise<APISuccessResponse<Hint>>;
    delete(id: number): Promise<APISuccessResponse<null>>;
}
export declare class FilesResource extends BaseResource {
    list(params?: {
        type?: string;
        location?: string;
    }): Promise<APIPaginatedResponse<File>>;
    create(data: any): Promise<APISuccessResponse<File>>;
    get(id: number): Promise<APISuccessResponse<File>>;
    delete(id: number): Promise<APISuccessResponse<null>>;
}
export declare class AwardsResource extends BaseResource {
    list(params?: {
        user_id?: number;
        team_id?: number;
    }): Promise<APIPaginatedResponse<Award>>;
    create(data: Partial<Award>): Promise<APISuccessResponse<Award>>;
    get(id: number): Promise<APISuccessResponse<Award>>;
    delete(id: number): Promise<APISuccessResponse<null>>;
}
export declare class TagsResource extends BaseResource {
    list(params?: {
        challenge_id?: number;
    }): Promise<APIPaginatedResponse<Tag>>;
    create(data: Partial<Tag>): Promise<APISuccessResponse<Tag>>;
    get(id: number): Promise<APISuccessResponse<Tag>>;
    update(id: number, data: Partial<Tag>): Promise<APISuccessResponse<Tag>>;
    delete(id: number): Promise<APISuccessResponse<null>>;
}
export declare class TokensResource extends BaseResource {
    list(): Promise<APIPaginatedResponse<Token>>;
    create(data: Partial<Token>): Promise<APISuccessResponse<Token>>;
    get(id: number): Promise<APISuccessResponse<Token>>;
    delete(id: number): Promise<APISuccessResponse<null>>;
}
export declare class UnlocksResource extends BaseResource {
    list(params?: {
        user_id?: number;
        team_id?: number;
        target?: number;
        type?: string;
    }): Promise<APIPaginatedResponse<Unlock>>;
    create(data: Partial<Unlock>): Promise<APISuccessResponse<Unlock>>;
}
export declare class StatisticsResource extends BaseResource {
    getChallengeSolves(): Promise<APISuccessResponse<any>>;
    getChallengeSolvePercentages(): Promise<APISuccessResponse<any>>;
    getChallengePropertyCounts(column: string): Promise<APISuccessResponse<any>>;
    getScoreDistribution(): Promise<APISuccessResponse<any>>;
    getSubmissionPropertyCounts(column: string): Promise<APISuccessResponse<any>>;
    getTeamStatistics(): Promise<APISuccessResponse<any>>;
    getUserStatistics(): Promise<APISuccessResponse<any>>;
    getUserPropertyCounts(column: string): Promise<APISuccessResponse<any>>;
}
export {};
