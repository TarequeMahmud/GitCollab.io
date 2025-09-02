const authFetch = async <T = any>(
  path: string,
  options: FetchOptions = {},
  setIsAuthenticated?: (val: boolean) => void
): Promise<AuthFetchResponse<T> | undefined> => {
  const baseUrl = "http://localhost:5000";

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      credentials: "include",
    });

    console.log(response);

    if (!response.ok) {
      if (response.status === 401) {
        console.log("Authentication failed", response);
        setIsAuthenticated?.(false);
      }

      const errorData = await response.json().catch(() => null);

      return {
        status: response.status,
        message: errorData?.message || `${response.status}`,
        ok: response.ok,
      };
    }

    const data = await response.json();
    return { status: response.status, data: data as T, ok: response.ok };
  } catch (error) {
    console.error("Fetch error:", error);
    setIsAuthenticated?.(false);
    return undefined;
  }
};

export default authFetch;
