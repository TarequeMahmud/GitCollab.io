const authFetch = async (path, options = {}, setIsAuthenticated) => {
  const baseUrl = "http://localhost:5000";
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      credentials: "include",
    });
    console.log(response);

    if (response.status === 401) {
      console.log("authentication failed");
      setIsAuthenticated(false);
    }

    const data = await response.json();
    return { status: response.status, data: data };
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

export default authFetch;
