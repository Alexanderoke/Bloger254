const BASE = "/api/posts";


export class ApiError extends Error{
  constructor(message, fieldErrors = {}) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}

async function request(path = "", method = "GET", body) {
  const options = {method};
  if (body !== undefined) {
    options.headers = {"Content-Type": "application/json"};
    options.body = JSON.stringify(body);
  }

  let res;
  try{
    res = await fetch(BASE + path, options);
  } catch {
    throw new ApiError("Could not reach the server. Is Flask running on port 5000?");
  }
  if (res.status ===204) return null;

  const data = await res.json().catch(() => null);
  if(!res.ok) {
    const fieldErrors =data?.errors ?? {};
    const message =
    Object.values(fieldErrors).join("") || data?.message || `Request failed (${res.status})`;
    throw new ApiError(message, fieldErrors);
  }
  return data;
}

export const listPosts = (q = "") =>
  request(q ? `?q=${encodeURIComponent(q)}` : "");

export const getPost = (id) => request(`/${id}`);

export const createPost = (post) => request("", "POST", post);

export const updatePost = (id, post) => request(`/${id}`, "PUT", post);

export const deletePost =(id) => request(`/${id}`, "DELETE");