/**
 * CTFd API Client SDK
 * Generated based on CTFd Swagger/OpenAPI 2.0 Definition (v1)
 *
 * Designed for Server-Side usage (Next.js Server Actions, Node.js).
 * Includes Public, User, and Admin API endpoints.
 */
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
    type: string;
    data?: string;
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
    state: string;
}
export interface CTFdToken {
    id: number;
    type: string;
    user_id: number;
    created: string;
    expiration: string;
    description?: string;
    value?: string;
}
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
export declare class CTFdClient {
    private baseUrl;
    private headers;
    constructor(options: CTFdClientOptions);
    /**
     * Internal fetch wrapper
     */
    private request;
    challenges: {
        /** List challenges (public or admin view depending on auth) */
        list: (query?: Partial<CTFdChallenge> & {
            q?: string;
            field?: string;
            view?: "admin" | "user";
        }) => Promise<CTFdChallenge[]>;
        /** Get specific challenge details */
        get: (id: number) => Promise<CTFdChallenge>;
        /** Create a challenge (Admin) */
        create: (data: Partial<CTFdChallenge>) => Promise<CTFdChallenge>;
        /** Update a challenge (Admin) */
        update: (id: number, data: Partial<CTFdChallenge>) => Promise<CTFdChallenge>;
        /** Delete a challenge (Admin) */
        delete: (id: number) => Promise<boolean>;
        /** Submit a flag */
        attempt: (challengeId: number, submission: string) => Promise<{
            status: string;
            message: string;
        }>;
        /** Get list of challenge types available */
        getTypes: () => Promise<{
            type: string;
            name: string;
        }[]>;
        /** Get Solves for a challenge */
        getSolves: (id: number) => Promise<any[]>;
        /** Get Files for a challenge */
        getFiles: (id: number) => Promise<CTFdFile[]>;
        /** Get Flags for a challenge */
        getFlags: (id: number) => Promise<CTFdFlag[]>;
        /** Get Hints for a challenge */
        getHints: (id: number) => Promise<CTFdHint[]>;
        /** Get Requirements for a challenge */
        getRequirements: (id: number) => Promise<any>;
        /** Get Tags for a challenge */
        getTags: (id: number) => Promise<CTFdTag[]>;
        /** Get Topics for a challenge */
        getTopics: (id: number) => Promise<CTFdTopic[]>;
    };
    users: {
        list: (query?: {
            page?: number;
            q?: string;
            field?: string;
            affiliation?: string;
        }) => Promise<CTFdResponse<CTFdUser[]>>;
        get: (id: number | "me") => Promise<CTFdUser>;
        /** Create User (Admin) - pass ?notify=true in query if needed */
        create: (data: Partial<CTFdUser>, notify?: boolean) => Promise<CTFdUser>;
        /** Update User (Admin or 'me') */
        update: (id: number | "me", data: Partial<CTFdUser>) => Promise<CTFdUser>;
        delete: (id: number) => Promise<boolean>;
        /** Email a user (Admin) */
        email: (id: number, text: string) => Promise<boolean>;
        getSolves: (id: number | "me") => Promise<any[]>;
        getFails: (id: number | "me") => Promise<any[]>;
        getAwards: (id: number | "me") => Promise<CTFdAward[]>;
        getSubmissions: (id: "me") => Promise<CTFdSubmission[]>;
    };
    teams: {
        list: (query?: {
            page?: number;
            q?: string;
            field?: string;
        }) => Promise<CTFdResponse<CTFdTeam[]>>;
        get: (id: number | "me") => Promise<CTFdTeam>;
        create: (data: Partial<CTFdTeam>) => Promise<CTFdTeam>;
        update: (id: number | "me", data: Partial<CTFdTeam>) => Promise<CTFdTeam>;
        delete: (id: number | "me") => Promise<boolean>;
        getSolves: (id: number | "me") => Promise<any[]>;
        getFails: (id: number | "me") => Promise<any[]>;
        getAwards: (id: number | "me") => Promise<CTFdAward[]>;
        getMembers: (id: number | "me") => Promise<number[]>;
        /** Remove member from team */
        removeMember: (teamId: number, userId: number) => Promise<boolean>;
    };
    scoreboard: {
        get: () => Promise<any[]>;
        getTop: (count: number) => Promise<any>;
    };
    submissions: {
        list: (query?: {
            challenge_id?: number;
            user_id?: number;
            team_id?: number;
            type?: string;
            q?: string;
        }) => Promise<CTFdResponse<CTFdSubmission[]>>;
        get: (id: number) => Promise<CTFdSubmission>;
        delete: (id: number) => Promise<boolean>;
    };
    awards: {
        list: (query?: {
            user_id?: number;
            team_id?: number;
            q?: string;
        }) => Promise<CTFdAward[]>;
        get: (id: number) => Promise<CTFdAward>;
        create: (data: Partial<CTFdAward>) => Promise<CTFdAward>;
        delete: (id: number) => Promise<boolean>;
    };
    files: {
        list: (query?: {
            type?: string;
            location?: string;
            q?: string;
        }) => Promise<CTFdFile[]>;
        get: (id: number) => Promise<CTFdFile>;
        /**
         * Upload a file.
         * @param file The file object (Blob/File in browser, Buffer/Stream logic depends on environment, standard usage usually FormData compatible)
         * @param params Metadata like challenge_id, page_id, etc.
         */
        create: (file: Blob | File, params: {
            challenge_id?: number;
            page_id?: number;
            type?: string;
            location?: string;
        }) => Promise<CTFdFile>;
        delete: (id: number) => Promise<boolean>;
    };
    pages: {
        list: (query?: {
            draft?: boolean;
            hidden?: boolean;
            q?: string;
        }) => Promise<CTFdPage[]>;
        get: (id: number) => Promise<CTFdPage>;
        create: (data: Partial<CTFdPage>) => Promise<CTFdPage>;
        update: (id: number, data: Partial<CTFdPage>) => Promise<CTFdPage>;
        delete: (id: number) => Promise<boolean>;
    };
    notifications: {
        list: (query?: {
            since_id?: number;
            q?: string;
        }) => Promise<CTFdNotification[]>;
        create: (data: Partial<CTFdNotification>) => Promise<CTFdNotification>;
        delete: (id: number) => Promise<boolean>;
    };
    configs: {
        list: (query?: {
            key?: string;
            value?: string;
            q?: string;
        }) => Promise<CTFdConfig[]>;
        get: (key: string) => Promise<CTFdConfig>;
        create: (data: CTFdConfig) => Promise<CTFdConfig>;
        update: (key: string, value: string) => Promise<CTFdConfig>;
        delete: (key: string) => Promise<boolean>;
    };
    statistics: {
        challenges: {
            solves: () => Promise<any>;
            percentages: () => Promise<any>;
            propertyCounts: (column: string) => Promise<any>;
        };
        scores: {
            distribution: () => Promise<any>;
        };
        teams: () => Promise<any>;
        users: {
            general: () => Promise<any>;
            propertyCounts: (column: string) => Promise<any>;
        };
        submissions: {
            propertyCounts: (column: string) => Promise<any>;
        };
    };
    flags: {
        list: (query?: any) => Promise<CTFdFlag[]>;
        create: (data: Partial<CTFdFlag>) => Promise<CTFdFlag>;
        update: (id: number, data: Partial<CTFdFlag>) => Promise<CTFdFlag>;
        delete: (id: number) => Promise<boolean>;
        getTypes: () => Promise<any>;
    };
    hints: {
        list: (query?: any) => Promise<CTFdHint[]>;
        create: (data: Partial<CTFdHint>) => Promise<CTFdHint>;
        update: (id: number, data: Partial<CTFdHint>) => Promise<CTFdHint>;
        delete: (id: number) => Promise<boolean>;
    };
    tags: {
        list: (query?: any) => Promise<CTFdTag[]>;
        create: (data: Partial<CTFdTag>) => Promise<CTFdTag>;
        update: (id: number, data: Partial<CTFdTag>) => Promise<CTFdTag>;
        delete: (id: number) => Promise<boolean>;
    };
    topics: {
        list: (query?: any) => Promise<CTFdTopic[]>;
        create: (data: Partial<CTFdTopic>) => Promise<CTFdTopic>;
        delete: (id: number) => Promise<boolean>;
    };
    unlocks: {
        list: (query?: any) => Promise<any[]>;
        create: (targetId: number, type: "hints" | "solutions") => Promise<CTFdResponse<{
            success: boolean;
            errors?: any;
        }>>;
    };
    tokens: {
        list: () => Promise<CTFdToken[]>;
        create: (data: {
            expiration?: string;
            description?: string;
        }) => Promise<CTFdToken>;
        delete: (id: number) => Promise<boolean>;
    };
    solutions: {
        list: (query?: any) => Promise<CTFdSolution[]>;
        create: (data: Partial<CTFdSolution>) => Promise<CTFdSolution>;
        update: (id: number, data: Partial<CTFdSolution>) => Promise<CTFdSolution>;
        delete: (id: number) => Promise<boolean>;
    };
}
