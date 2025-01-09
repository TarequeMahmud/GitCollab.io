import styles from "@styles/main/SigninSection.module.scss";
function SigninSection() {
  return (
    <div className={styles.container}>
      <div className={styles["signin-form"]}>
        <form action="/" method="post">
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
