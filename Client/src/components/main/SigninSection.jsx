import styles from "@styles/main/SigninSection.module.scss";
import { useNavigate } from "react-router";
function SigninSection() {
  const navigate = useNavigate();
  const signin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json;
      navigate("/projects");
      console.log("Signin successful:", result);
    } catch (error) {
      console.log("Error during signing. ", error);
      alert(
        "Something happened wrong. Check out console to investigate what's wrong"
      );
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
    </div>
  );
}

export default SigninSection;
