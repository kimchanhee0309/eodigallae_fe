import { z } from "zod";

const errorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),

    details: z
      .array(
        z.object({
          field: z.string(),
          message: z.string(),
        }),
      )
      .optional(),
  }),
});

type ValidationIssue = {
  field: string;
  message: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly details: ValidationIssue[] = [],
    public readonly retryAt: number | null = null,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function readRetryAt(response: Response): number | null {
  if (response.status !== 429 && response.status !== 503) {
    return null;
  }

  const header = response.headers.get("Retry-After")?.trim();

  if (!header) {
    return null;
  }

  const now = Date.now();

  if (/^\d+$/.test(header)) {
    const seconds = Number(header);
    const retryAt = now + seconds * 1_000;

    if (!Number.isSafeInteger(seconds) || !Number.isSafeInteger(retryAt)) {
      return null;
    }

    return retryAt;
  }

  const retryAt = Date.parse(header);

  if (!Number.isFinite(retryAt)) {
    return null;
  }

  return Math.max(now, retryAt);
}

async function requestJson<T>(
  path: string,
  responseSchema: z.ZodType<T>,
  options: RequestInit,
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new ApiError("서비스에 연결할 수 없습니다.", 0, "API_NOT_CONFIGURED");
  }

  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  let response: Response;

  try {
    response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
      ...options,
      headers,
      credentials: "include",
      cache: "no-store",
    });
  } catch (error) {
    // React Query가 취소한 요청은 취소 상태로 전달합니다.
    if (options.signal?.aborted) {
      throw error;
    }

    throw new ApiError(
      "연결이 끊겨 요청 결과를 확인하지 못했습니다.",
      0,
      "NETWORK_ERROR",
    );
  }

  const retryAt = readRetryAt(response);
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const parsedError = errorResponseSchema.safeParse(payload);

    if (parsedError.success) {
      const { message, code, details } = parsedError.data.error;

      throw new ApiError(message, response.status, code, details, retryAt);
    }

    throw new ApiError(
      "요청을 처리하지 못했습니다.",
      response.status,
      "REQUEST_FAILED",
      [],
      retryAt,
    );
  }

  const result = responseSchema.safeParse(payload);

  if (!result.success) {
    throw new ApiError(
      "서버 응답을 확인하지 못했습니다.",
      response.status,
      "INVALID_RESPONSE",
    );
  }

  return result.data;
}

export function postJson<T>(
  path: string,
  body: unknown,
  responseSchema: z.ZodType<T>,
): Promise<T> {
  return requestJson(path, responseSchema, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export function getJson<T>(
  path: string,
  responseSchema: z.ZodType<T>,
  signal?: AbortSignal,
): Promise<T> {
  return requestJson(path, responseSchema, {
    method: "GET",
    signal,
  });
}
