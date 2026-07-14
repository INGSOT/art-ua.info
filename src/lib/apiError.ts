import { AxiosError } from "axios";

type FieldErrors = Record<string, string[]>;

/**
 * Достаёт из ответа сервера объект ошибок валидации по полям
 * ({ email: [...], password: [...] }), если он есть в ответе.
 */
export function getApiFieldErrors(err: unknown): FieldErrors | null {
  const data = (err as AxiosError)?.response?.data as { errors?: unknown } | undefined;
  if (data?.errors && typeof data.errors === "object") {
    return data.errors as FieldErrors;
  }
  return null;
}

/**
 * Достаёт из ответа сервера реальный текст ошибки (сообщения валидации по
 * полям или общий message), вместо абстрактных фраз на клиенте.
 */
export function getApiErrorMessage(err: unknown, fallback = "Сталася помилка"): string {
  const errors = getApiFieldErrors(err);

  if (errors) {
    // Каждое поле — отдельной строкой, чтобы не склеивать в одну фразу
    // не связанные друг с другом ошибки разных полей.
    const messages = Object.values(errors).flat();
    if (messages.length > 0) return messages.join("\n");
  }

  const data = (err as AxiosError)?.response?.data as { message?: string } | undefined;
  if (data?.message) return data.message;

  return fallback;
}
