const BASE_URL = "https://services.wallper.app";
const USER_AGENT = "Wallper/1 CFNetwork/3860.300.31 Darwin/25.2.0";

export const json = async <T, B = undefined>(
  method: string,
  path: string,
  body?: B,
): Promise<T> => {
  const headers = new Headers();
  headers.set("User-Agent", USER_AGENT);

  if (body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(BASE_URL + path, {
    method,
    headers,
    body: body && JSON.stringify(body),
  });

  const json = await response.json();
  return json as T;
};
