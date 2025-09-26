export default async function authFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  if (typeof window === "undefined") {
    throw new Error(
      "authFetch can only be called in the browser (client-side)"
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const accessToken = sessionStorage.getItem("access_token");
  const headers = new Headers(options.headers || {});
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    console.warn("Access token expired. Refreshing...");

    const refreshRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh/`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (refreshRes.ok) {
      const { access } = await refreshRes.json();

      if (access) {
        sessionStorage.setItem("access_token", access);
        headers.set("Authorization", `Bearer ${access}`);
        res = await fetch(`${baseUrl}${path}`, {
          ...options,
          headers,
          credentials: "include",
        });
      }
    } else {
      console.error("Refresh token invalid/expired.");
      throw new Error("Unauthorized - please login again.");
    }
  }

  return res;
}
