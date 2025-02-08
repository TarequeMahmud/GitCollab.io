const authFetch = async (path, options = {}, navigate) => {
  const baseUrl = "http://localhost:5000";
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      credentials: "include",
    });
    console.log(response);

    if (response.status === 401) {
      console.log("authentication failed");
      return { error: true, status: 401 };
    }

    const data = await response.json();
    return { status: response.status, data: data };
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

export default authFetch;
