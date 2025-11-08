// api.js — central API wrapper that normalizes your CommonResponse
const BASE_URL = "http://localhost:5000/api";

function normalize(json) {
  // supports formats:
  // {statusCode, message, data}, {status, message, data}, {data}, Array, or error object
  const status =
    json?.statusCode ??
    json?.status ??
    (Array.isArray(json?.data) || Array.isArray(json) ? 200 : 500);
  const message = json?.message ?? (status !== 200 ? "Request failed" : "OK");
  const data = json?.data ?? (Array.isArray(json) ? json : json?.results ?? []);
  return { status, message, data };
}

export async function api(path, method = "GET", body = null) {
  const opt = { method, headers: { "Content-Type": "application/json" } };
  if (body) opt.body = JSON.stringify(body);
  try {
    const res = await fetch(`${BASE_URL}${path}`, opt);
    const json = await res.json().catch(() => ({}));
    return normalize(json);
  } catch (e) {
    return { status: 500, message: "Backend not reachable", data: [] };
  }
}
