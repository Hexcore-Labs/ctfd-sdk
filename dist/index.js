// src/index.ts
class CTFdClient {
  baseURL;
  accessToken;
  headers;
  users;
  teams;
  challenges;
  scoreboard;
  submissions;
  configs;
  notifications;
  pages;
  flags;
  hints;
  files;
  awards;
  tags;
  tokens;
  unlocks;
  statistics;
  constructor(baseURL, accessToken) {
    this.baseURL = baseURL.replace(/\/$/, "");
    this.accessToken = accessToken;
    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${this.accessToken}`
    };
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
  async request(method, endpoint, body, params) {
    const url = new URL(`${this.baseURL}/api/v1${endpoint}`);
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined) {
          url.searchParams.append(key, String(params[key]));
        }
      });
    }
    const config = {
      method,
      headers: this.headers
    };
    if (body) {
      config.body = JSON.stringify(body);
    }
    const response = await fetch(url.toString(), config);
    const data = await response.json();
    if (!response.ok || data.success === false) {
      const errorMsg = data.errors ? data.errors.join(", ") : "Unknown API Error";
      throw new Error(`CTFd API Error [${response.status}]: ${errorMsg}`);
    }
    return data;
  }
}

class BaseResource {
  client;
  constructor(client) {
    this.client = client;
  }
}

class ChallengesResource extends BaseResource {
  async list(params) {
    return this.client.request("GET", "/challenges", undefined, params);
  }
  async get(id) {
    return this.client.request("GET", `/challenges/${id}`);
  }
  async create(data) {
    return this.client.request("POST", "/challenges", data);
  }
  async update(id, data) {
    return this.client.request("PATCH", `/challenges/${id}`, data);
  }
  async delete(id) {
    return this.client.request("DELETE", `/challenges/${id}`);
  }
  async attempt(challengeId, submission) {
    return this.client.request("POST", "/challenges/attempt", {
      challenge_id: challengeId,
      submission
    });
  }
  async getTypes() {
    return this.client.request("GET", "/challenges/types");
  }
  async getSolves(id) {
    return this.client.request("GET", `/challenges/${id}/solves`);
  }
  async getFiles(id) {
    return this.client.request("GET", `/challenges/${id}/files`);
  }
  async getFlags(id) {
    return this.client.request("GET", `/challenges/${id}/flags`);
  }
  async getHints(id) {
    return this.client.request("GET", `/challenges/${id}/hints`);
  }
  async getTags(id) {
    return this.client.request("GET", `/challenges/${id}/tags`);
  }
}

class UsersResource extends BaseResource {
  async list(params) {
    return this.client.request("GET", "/users", undefined, params);
  }
  async get(id) {
    return this.client.request("GET", `/users/${id}`);
  }
  async create(data, notify) {
    return this.client.request("POST", "/users", data, { notify });
  }
  async update(id, data) {
    return this.client.request("PATCH", `/users/${id}`, data);
  }
  async delete(id) {
    return this.client.request("DELETE", `/users/${id}`);
  }
  async getMe() {
    return this.client.request("GET", "/users/me");
  }
  async updateMe(data) {
    return this.client.request("PATCH", "/users/me", data);
  }
  async getSolves(id) {
    return this.client.request("GET", `/users/${id}/solves`);
  }
  async getFails(id) {
    return this.client.request("GET", `/users/${id}/fails`);
  }
  async getAwards(id) {
    return this.client.request("GET", `/users/${id}/awards`);
  }
  async email(id, text) {
    return this.client.request("POST", `/users/${id}/email`, { text });
  }
}

class TeamsResource extends BaseResource {
  async list(params) {
    return this.client.request("GET", "/teams", undefined, params);
  }
  async get(id) {
    return this.client.request("GET", `/teams/${id}`);
  }
  async create(data) {
    return this.client.request("POST", "/teams", data);
  }
  async update(id, data) {
    return this.client.request("PATCH", `/teams/${id}`, data);
  }
  async delete(id) {
    return this.client.request("DELETE", `/teams/${id}`);
  }
  async getMe() {
    return this.client.request("GET", "/teams/me");
  }
  async updateMe(data) {
    return this.client.request("PATCH", "/teams/me", data);
  }
  async getSolves(id) {
    return this.client.request("GET", `/teams/${id}/solves`);
  }
  async getFails(id) {
    return this.client.request("GET", `/teams/${id}/fails`);
  }
  async getAwards(id) {
    return this.client.request("GET", `/teams/${id}/awards`);
  }
  async getMembers(id) {
    return this.client.request("GET", `/teams/${id}/members`);
  }
}

class SubmissionsResource extends BaseResource {
  async list(params) {
    return this.client.request("GET", "/submissions", undefined, params);
  }
  async create(data) {
    return this.client.request("POST", "/submissions", data);
  }
  async get(id) {
    return this.client.request("GET", `/submissions/${id}`);
  }
  async delete(id) {
    return this.client.request("DELETE", `/submissions/${id}`);
  }
}

class ScoreboardResource extends BaseResource {
  async get() {
    return this.client.request("GET", "/scoreboard");
  }
  async getTop(count) {
    return this.client.request("GET", `/scoreboard/top/${count}`);
  }
}

class ConfigsResource extends BaseResource {
  async list(params) {
    return this.client.request("GET", "/configs", undefined, params);
  }
  async get(key) {
    return this.client.request("GET", `/configs/${key}`);
  }
  async create(data) {
    return this.client.request("POST", "/configs", data);
  }
  async update(key, value) {
    return this.client.request("PATCH", `/configs/${key}`, { value });
  }
  async delete(key) {
    return this.client.request("DELETE", `/configs/${key}`);
  }
}

class NotificationsResource extends BaseResource {
  async list(params) {
    return this.client.request("GET", "/notifications", undefined, params);
  }
  async create(data) {
    return this.client.request("POST", "/notifications", data);
  }
  async get(id) {
    return this.client.request("GET", `/notifications/${id}`);
  }
  async delete(id) {
    return this.client.request("DELETE", `/notifications/${id}`);
  }
}

class PagesResource extends BaseResource {
  async list(params) {
    return this.client.request("GET", "/pages", undefined, params);
  }
  async create(data) {
    return this.client.request("POST", "/pages", data);
  }
  async get(id) {
    return this.client.request("GET", `/pages/${id}`);
  }
  async update(id, data) {
    return this.client.request("PATCH", `/pages/${id}`, data);
  }
  async delete(id) {
    return this.client.request("DELETE", `/pages/${id}`);
  }
}

class FlagsResource extends BaseResource {
  async list(params) {
    return this.client.request("GET", "/flags", undefined, params);
  }
  async create(data) {
    return this.client.request("POST", "/flags", data);
  }
  async get(id) {
    return this.client.request("GET", `/flags/${id}`);
  }
  async update(id, data) {
    return this.client.request("PATCH", `/flags/${id}`, data);
  }
  async delete(id) {
    return this.client.request("DELETE", `/flags/${id}`);
  }
  async getTypes() {
    return this.client.request("GET", "/flags/types");
  }
}

class HintsResource extends BaseResource {
  async list(params) {
    return this.client.request("GET", "/hints", undefined, params);
  }
  async create(data) {
    return this.client.request("POST", "/hints", data);
  }
  async get(id) {
    return this.client.request("GET", `/hints/${id}`);
  }
  async update(id, data) {
    return this.client.request("PATCH", `/hints/${id}`, data);
  }
  async delete(id) {
    return this.client.request("DELETE", `/hints/${id}`);
  }
}

class FilesResource extends BaseResource {
  async list(params) {
    return this.client.request("GET", "/files", undefined, params);
  }
  async create(data) {
    return this.client.request("POST", "/files", data);
  }
  async get(id) {
    return this.client.request("GET", `/files/${id}`);
  }
  async delete(id) {
    return this.client.request("DELETE", `/files/${id}`);
  }
}

class AwardsResource extends BaseResource {
  async list(params) {
    return this.client.request("GET", "/awards", undefined, params);
  }
  async create(data) {
    return this.client.request("POST", "/awards", data);
  }
  async get(id) {
    return this.client.request("GET", `/awards/${id}`);
  }
  async delete(id) {
    return this.client.request("DELETE", `/awards/${id}`);
  }
}

class TagsResource extends BaseResource {
  async list(params) {
    return this.client.request("GET", "/tags", undefined, params);
  }
  async create(data) {
    return this.client.request("POST", "/tags", data);
  }
  async get(id) {
    return this.client.request("GET", `/tags/${id}`);
  }
  async update(id, data) {
    return this.client.request("PATCH", `/tags/${id}`, data);
  }
  async delete(id) {
    return this.client.request("DELETE", `/tags/${id}`);
  }
}

class TokensResource extends BaseResource {
  async list() {
    return this.client.request("GET", "/tokens");
  }
  async create(data) {
    return this.client.request("POST", "/tokens", data);
  }
  async get(id) {
    return this.client.request("GET", `/tokens/${id}`);
  }
  async delete(id) {
    return this.client.request("DELETE", `/tokens/${id}`);
  }
}

class UnlocksResource extends BaseResource {
  async list(params) {
    return this.client.request("GET", "/unlocks", undefined, params);
  }
  async create(data) {
    return this.client.request("POST", "/unlocks", data);
  }
}

class StatisticsResource extends BaseResource {
  async getChallengeSolves() {
    return this.client.request("GET", "/statistics/challenges/solves");
  }
  async getChallengeSolvePercentages() {
    return this.client.request("GET", "/statistics/challenges/solves/percentages");
  }
  async getChallengePropertyCounts(column) {
    return this.client.request("GET", `/statistics/challenges/${column}`);
  }
  async getScoreDistribution() {
    return this.client.request("GET", "/statistics/scores/distribution");
  }
  async getSubmissionPropertyCounts(column) {
    return this.client.request("GET", `/statistics/submissions/${column}`);
  }
  async getTeamStatistics() {
    return this.client.request("GET", "/statistics/teams");
  }
  async getUserStatistics() {
    return this.client.request("GET", "/statistics/users");
  }
  async getUserPropertyCounts(column) {
    return this.client.request("GET", `/statistics/users/${column}`);
  }
}
export {
  UsersResource,
  UnlocksResource,
  TokensResource,
  TeamsResource,
  TagsResource,
  SubmissionsResource,
  StatisticsResource,
  ScoreboardResource,
  PagesResource,
  NotificationsResource,
  HintsResource,
  FlagsResource,
  FilesResource,
  ConfigsResource,
  ChallengesResource,
  CTFdClient,
  AwardsResource
};
