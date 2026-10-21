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
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function postJson<T>(
  path: string,
  body: unknown,
  responseSchema: z.ZodType<T>,
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new ApiError("서비스에 연결할 수 없습니다.", 0, "API_NOT_CONFIGURED");
  }

  let response: Response;

  try {
    response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
      method: "POST",
      credentials: "include",
      cache: "no-store",

      headers: {
        Accept: "application/jsoon",
        "Content-Type": "application/json",
      },

      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      "연결이 끊겨 생성 결과를 확인하지 못했습니다.",
      0,
      "NETWORK_ERROR",
    );
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const parsedError = errorResponseSchema.safeParse(payload);

    if (parsedError.success) {
      const { message, code, details } = parsedError.data.error;

      throw new ApiError(message, response.status, code, details);
    }

    throw new ApiError(
      "요청을 처리하지 못했습니다.",
      response.status,
      "REQUEST_FAILED",
    );
  }

  const result = responseSchema.safeParse(payload);

  if (!result.success) {
    throw new ApiError(
      "서버 응답을 확인하지 못했습니다. 생성 여부를 확인해주세요.",
      response.status,
      "INVALID_RESPONSE",
    );
  }

  return result.data;
}
