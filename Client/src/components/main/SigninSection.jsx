import styles from "@styles/main/SigninSection.module.scss";
import { useState } from "react";
import { useNavigate } from "react-router";
import Spinner from "./Spinner";
import authFetch from "@services/fetch.js";

//signin function
function SigninSection() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const signin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      setLoading(true);
      const userData = await authFetch("/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!userData.loggedIn)
        throw new Error(`HTTP error! Status: ${response.status}`);

      if (userData.loggedIn) {
        localStorage.removeItem("notLoggedIn");
        navigate("/projects");
      }
    } catch (error) {
      console.log("Error during signing. ", error);
      alert(
        "Something happened wrong. Check out console to investigate what's wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Start Project Now!</h1>
      <div className={styles["signin-form"]}>
        <form onSubmit={signin}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            name="email"
            id="email"
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="At least 8 characters"
            name="password"
            id="password"
          />
          <button type="submit">Sign In</button>
        </form>
      </div>
      {loading && <Spinner />}
    </div>
  );
}

export default SigninSection;
