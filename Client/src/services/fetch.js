const authFetch = async (path, options = {}, navigate) => {
  const baseUrl = "http://localhost:5000";
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      credentials: "include",
    });

    if (response.status === 401) {
      localStorage.setItem("notLoggedIn", JSON.stringify(true));
      navigate("/");
      console.log("authentication failed");
      return null;
    }
    if (response.ok) {
      localStorage.removeItem("notLoggedIn");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

export default authFetch;
