interface RequestConfig {
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
}

export class ApiClient {
  private static baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  static async request<T>(endpoint: string, config: RequestConfig): Promise<T> {
    const {
      method,
      headers = {},
      body
    } = config;

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      credentials: 'include',
    };

    if (body && method !== "GET") {
      requestConfig.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, requestConfig);

      if (response.status === 401) {
        window.location.href = "/login";
        throw new Error("Authentication expired");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return response.text() as unknown as T;

    } catch (error: any) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  static get<T>(endpoint: string): Promise<T> {
    return this.request(endpoint, { method: "GET" });
  }

  static post<T>(endpoint: string, body: any): Promise<T> {
    return this.request(endpoint, { method: "POST", body });
  }

  static put<T>(endpoint: string, body: any): Promise<T> {
    return this.request(endpoint, { method: "PUT", body });
  }

  static delete<T>(endpoint: string): Promise<T> {
    return this.request(endpoint, { method: "DELETE" });
  }
}