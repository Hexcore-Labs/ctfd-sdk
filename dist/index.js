// src/index.ts
class CTFdClient {
  baseUrl;
  headers;
  constructor(options) {
    this.baseUrl = options.url.replace(/\/$/, "");
    this.headers = {
      Accept: "application/json"
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
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = { ...this.headers, ...options.headers };
    if (options.body instanceof FormData) {
      delete headers["Content-Type"];
    } else if (!headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }
    const fetchOptions = {
      ...options,
      headers,
      credentials: "include"
    };
    const response = await fetch(url, fetchOptions);
    let body;
    try {
      if (options.method === "HEAD")
        return { success: response.ok };
      body = await response.json();
    } catch (e) {
      if (response.ok)
        return { success: true };
      throw new Error(`CTFd API Error: Failed to parse JSON from ${endpoint}. Status: ${response.status}`);
    }
    if (!response.ok) {
      throw new Error(body.errors?.join(", ") || body.message || `API Error ${response.status}`);
    }
    return body;
  }
  challenges = {
    list: async (query = {}) => {
      const qs = new URLSearchParams(query).toString();
      return (await this.request(`/api/v1/challenges?${qs}`)).data;
    },
    get: async (id) => {
      return (await this.request(`/api/v1/challenges/${id}`)).data;
    },
    create: async (data) => {
      return (await this.request("/api/v1/challenges", {
        method: "POST",
        body: JSON.stringify(data)
      })).data;
    },
    update: async (id, data) => {
      return (await this.request(`/api/v1/challenges/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data)
      })).data;
    },
    delete: async (id) => {
      return (await this.request(`/api/v1/challenges/${id}`, {
        method: "DELETE"
      })).success;
    },
    attempt: async (challengeId, submission) => {
      return (await this.request("/api/v1/challenges/attempt", {
        method: "POST",
        body: JSON.stringify({ challenge_id: challengeId, submission })
      })).data;
    },
    getTypes: async () => (await this.request("/api/v1/challenges/types")).data,
    getSolves: async (id) => (await this.request(`/api/v1/challenges/${id}/solves`)).data,
    getFiles: async (id) => (await this.request(`/api/v1/challenges/${id}/files`)).data,
    getFlags: async (id) => (await this.request(`/api/v1/challenges/${id}/flags`)).data,
    getHints: async (id) => (await this.request(`/api/v1/challenges/${id}/hints`)).data,
    getRequirements: async (id) => (await this.request(`/api/v1/challenges/${id}/requirements`)).data,
    getTags: async (id) => (await this.request(`/api/v1/challenges/${id}/tags`)).data,
    getTopics: async (id) => (await this.request(`/api/v1/challenges/${id}/topics`)).data
  };
  users = {
    list: async (query = {}) => {
      const qs = new URLSearchParams(query).toString();
      return await this.request(`/api/v1/users?${qs}`);
    },
    get: async (id) => {
      return (await this.request(`/api/v1/users/${id}`)).data;
    },
    create: async (data, notify = false) => {
      return (await this.request(`/api/v1/users?notify=${notify}`, {
        method: "POST",
        body: JSON.stringify(data)
      })).data;
    },
    update: async (id, data) => {
      return (await this.request(`/api/v1/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data)
      })).data;
    },
    delete: async (id) => {
      return (await this.request(`/api/v1/users/${id}`, { method: "DELETE" })).success;
    },
    email: async (id, text) => {
      return (await this.request(`/api/v1/users/${id}/email`, {
        method: "POST",
        body: JSON.stringify({ text })
      })).success;
    },
    getSolves: async (id) => (await this.request(`/api/v1/users/${id}/solves`)).data,
    getFails: async (id) => (await this.request(`/api/v1/users/${id}/fails`)).data,
    getAwards: async (id) => (await this.request(`/api/v1/users/${id}/awards`)).data,
    getSubmissions: async (id) => (await this.request(`/api/v1/users/${id}/submissions`)).data
  };
  teams = {
    list: async (query = {}) => {
      const qs = new URLSearchParams(query).toString();
      return await this.request(`/api/v1/teams?${qs}`);
    },
    get: async (id) => {
      return (await this.request(`/api/v1/teams/${id}`)).data;
    },
    create: async (data) => {
      return (await this.request("/api/v1/teams", {
        method: "POST",
        body: JSON.stringify(data)
      })).data;
    },
    update: async (id, data) => {
      return (await this.request(`/api/v1/teams/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data)
      })).data;
    },
    delete: async (id) => {
      return (await this.request(`/api/v1/teams/${id}`, { method: "DELETE" })).success;
    },
    getSolves: async (id) => (await this.request(`/api/v1/teams/${id}/solves`)).data,
    getFails: async (id) => (await this.request(`/api/v1/teams/${id}/fails`)).data,
    getAwards: async (id) => (await this.request(`/api/v1/teams/${id}/awards`)).data,
    getMembers: async (id) => (await this.request(`/api/v1/teams/${id}/members`)).data,
    removeMember: async (teamId, userId) => {
      return (await this.request(`/api/v1/teams/${teamId}/members`, {
        method: "DELETE",
        body: JSON.stringify({ user_id: userId })
      })).success;
    }
  };
  scoreboard = {
    get: async () => (await this.request("/api/v1/scoreboard")).data,
    getTop: async (count) => (await this.request(`/api/v1/scoreboard/top/${count}`)).data
  };
  submissions = {
    list: async (query = {}) => {
      const qs = new URLSearchParams(query).toString();
      return await this.request(`/api/v1/submissions?${qs}`);
    },
    get: async (id) => (await this.request(`/api/v1/submissions/${id}`)).data,
    delete: async (id) => (await this.request(`/api/v1/submissions/${id}`, { method: "DELETE" })).success
  };
  awards = {
    list: async (query = {}) => {
      const qs = new URLSearchParams(query).toString();
      return (await this.request(`/api/v1/awards?${qs}`)).data;
    },
    get: async (id) => (await this.request(`/api/v1/awards/${id}`)).data,
    create: async (data) => (await this.request("/api/v1/awards", {
      method: "POST",
      body: JSON.stringify(data)
    })).data,
    delete: async (id) => (await this.request(`/api/v1/awards/${id}`, { method: "DELETE" })).success
  };
  files = {
    list: async (query = {}) => {
      const qs = new URLSearchParams(query).toString();
      return (await this.request(`/api/v1/files?${qs}`)).data;
    },
    get: async (id) => (await this.request(`/api/v1/files/${id}`)).data,
    create: async (file, params) => {
      const formData = new FormData;
      formData.append("file", file);
      if (params.challenge_id)
        formData.append("challenge_id", params.challenge_id.toString());
      if (params.page_id)
        formData.append("page_id", params.page_id.toString());
      if (params.type)
        formData.append("type", params.type);
      if (params.location)
        formData.append("location", params.location);
      return (await this.request("/api/v1/files", {
        method: "POST",
        body: formData
      })).data;
    },
    delete: async (id) => (await this.request(`/api/v1/files/${id}`, { method: "DELETE" })).success
  };
  pages = {
    list: async (query = {}) => {
      const qs = new URLSearchParams(query).toString();
      return (await this.request(`/api/v1/pages?${qs}`)).data;
    },
    get: async (id) => (await this.request(`/api/v1/pages/${id}`)).data,
    create: async (data) => (await this.request("/api/v1/pages", {
      method: "POST",
      body: JSON.stringify(data)
    })).data,
    update: async (id, data) => (await this.request(`/api/v1/pages/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data)
    })).data,
    delete: async (id) => (await this.request(`/api/v1/pages/${id}`, { method: "DELETE" })).success
  };
  notifications = {
    list: async (query = {}) => {
      const qs = new URLSearchParams(query).toString();
      return (await this.request(`/api/v1/notifications?${qs}`)).data;
    },
    create: async (data) => (await this.request("/api/v1/notifications", {
      method: "POST",
      body: JSON.stringify(data)
    })).data,
    delete: async (id) => (await this.request(`/api/v1/notifications/${id}`, { method: "DELETE" })).success
  };
  configs = {
    list: async (query = {}) => {
      const qs = new URLSearchParams(query).toString();
      return (await this.request(`/api/v1/configs?${qs}`)).data;
    },
    get: async (key) => (await this.request(`/api/v1/configs/${key}`)).data,
    create: async (data) => (await this.request("/api/v1/configs", {
      method: "POST",
      body: JSON.stringify(data)
    })).data,
    update: async (key, value) => (await this.request(`/api/v1/configs/${key}`, {
      method: "PATCH",
      body: JSON.stringify({ value })
    })).data,
    delete: async (key) => (await this.request(`/api/v1/configs/${key}`, { method: "DELETE" })).success
  };
  statistics = {
    challenges: {
      solves: async () => (await this.request("/api/v1/statistics/challenges/solves")).data,
      percentages: async () => (await this.request("/api/v1/statistics/challenges/solves/percentages")).data,
      propertyCounts: async (column) => (await this.request(`/api/v1/statistics/challenges/${column}`)).data
    },
    scores: {
      distribution: async () => (await this.request("/api/v1/statistics/scores/distribution")).data
    },
    teams: async () => (await this.request("/api/v1/statistics/teams")).data,
    users: {
      general: async () => (await this.request("/api/v1/statistics/users")).data,
      propertyCounts: async (column) => (await this.request(`/api/v1/statistics/users/${column}`)).data
    },
    submissions: {
      propertyCounts: async (column) => (await this.request(`/api/v1/statistics/submissions/${column}`)).data
    }
  };
  flags = {
    list: async (query) => (await this.request(`/api/v1/flags?${new URLSearchParams(query)}`)).data,
    create: async (data) => (await this.request("/api/v1/flags", {
      method: "POST",
      body: JSON.stringify(data)
    })).data,
    update: async (id, data) => (await this.request(`/api/v1/flags/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data)
    })).data,
    delete: async (id) => (await this.request(`/api/v1/flags/${id}`, { method: "DELETE" })).success,
    getTypes: async () => (await this.request("/api/v1/flags/types")).data
  };
  hints = {
    list: async (query) => (await this.request(`/api/v1/hints?${new URLSearchParams(query)}`)).data,
    create: async (data) => (await this.request("/api/v1/hints", {
      method: "POST",
      body: JSON.stringify(data)
    })).data,
    update: async (id, data) => (await this.request(`/api/v1/hints/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data)
    })).data,
    delete: async (id) => (await this.request(`/api/v1/hints/${id}`, { method: "DELETE" })).success
  };
  tags = {
    list: async (query) => (await this.request(`/api/v1/tags?${new URLSearchParams(query)}`)).data,
    create: async (data) => (await this.request("/api/v1/tags", {
      method: "POST",
      body: JSON.stringify(data)
    })).data,
    update: async (id, data) => (await this.request(`/api/v1/tags/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data)
    })).data,
    delete: async (id) => (await this.request(`/api/v1/tags/${id}`, { method: "DELETE" })).success
  };
  topics = {
    list: async (query) => (await this.request(`/api/v1/topics?${new URLSearchParams(query)}`)).data,
    create: async (data) => (await this.request("/api/v1/topics", {
      method: "POST",
      body: JSON.stringify(data)
    })).data,
    delete: async (id) => (await this.request(`/api/v1/topics/${id}`, { method: "DELETE" })).success
  };
  unlocks = {
    list: async (query) => (await this.request(`/api/v1/unlocks?${new URLSearchParams(query)}`)).data,
    create: async (targetId, type) => {
      return await this.request("/api/v1/unlocks", {
        method: "POST",
        body: JSON.stringify({ target: targetId, type })
      });
    }
  };
  tokens = {
    list: async () => (await this.request("/api/v1/tokens")).data,
    create: async (data) => (await this.request("/api/v1/tokens", {
      method: "POST",
      body: JSON.stringify(data)
    })).data,
    delete: async (id) => (await this.request(`/api/v1/tokens/${id}`, { method: "DELETE" })).success
  };
  solutions = {
    list: async (query) => (await this.request(`/api/v1/solutions?${new URLSearchParams(query)}`)).data,
    create: async (data) => (await this.request("/api/v1/solutions", {
      method: "POST",
      body: JSON.stringify(data)
    })).data,
    update: async (id, data) => (await this.request(`/api/v1/solutions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data)
    })).data,
    delete: async (id) => (await this.request(`/api/v1/solutions/${id}`, { method: "DELETE" })).success
  };
}
export {
  CTFdClient
};
