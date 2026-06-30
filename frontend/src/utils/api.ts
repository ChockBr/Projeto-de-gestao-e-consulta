export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

function resolveApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function getErrorMessage(body: unknown, fallback: string): string {
  if (typeof body === 'string' && body.trim()) {
    return body;
  }

  if (body && typeof body === 'object') {
    const maybeMessage = (body as { message?: unknown }).message;
    if (typeof maybeMessage === 'string' && maybeMessage.trim()) {
      return maybeMessage;
    }
  }

  return fallback;
}

export async function apiRequest(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || undefined);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const { headers: _ignoredHeaders, ...restOptions } = options;

  const response = await fetch(resolveApiUrl(path), {
    ...restOptions,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await response.json().catch(() => null) : await response.text().catch(() => '');

  if (!response.ok) {
    const message = getErrorMessage(body, response.statusText || 'Erro na requisição');
    throw new ApiError(message, response.status, body);
  }

  if (response.status === 204) {
    return null;
  }

  return body;
}

export function authRequest(token: string | null, path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return apiRequest(path, {
    ...options,
    headers,
  });
}
