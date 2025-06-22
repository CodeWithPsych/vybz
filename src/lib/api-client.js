class ApiClient {
    async fetch(endpoint, options = {}) {
      const { method = "GET", body, headers = {} } = options;
  
      const defaultHeaders = {
        "Content-Type": "application/json",
        ...headers,
      };
  
      const response = await fetch(`/api${endpoint}`, {
        method,
        headers: defaultHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });
  
      if (!response.ok) {
        throw new Error(await response.text());
      }
  
      return response.json();
    }
  
    async getVideos() {
      return this.fetch("/videos");
    }
  
    async getVideo(id) {
      return this.fetch(`/videos/${id}`);
    }
  
    async createVideo(videoData) {
      return this.fetch("/videos", {
        method: "POST",
        body: videoData,
      });
    }
  }
  
  export const apiClient = new ApiClient();
  