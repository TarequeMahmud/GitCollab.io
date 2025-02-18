import styles from "./AuthenticationPage.module.scss";
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import Spinner from "@comp/Spinner";
import { useAlert } from "@contexts/AlertContext";
import { useAuth } from "@contexts/AuthContext";
import { useError } from "@contexts/ErrorContex";

//Component
function AuthenticationPage() {
  //Necessary hooks and states

  const { login, register } = useAuth();
  const { showAlert } = useAlert();
  const alertOnError = useError();
  const [loading, setLoading] = useState(false);
  const [showSignin, setShowSingin] = useState(true);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  //if authenticated then head to the dashboard page

  //Signin handler function
  const handleSignin = async (event) => {
    //prevent reload
    event.preventDefault();

    //form inputs
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    //try to login
    try {
      setLoading(true);
      if (!email || !password) {
        return;
      }
      const loginResponse = await login({ email, password });

      if (!loginResponse) {
        alertOnError("Login Failed", { status: 500 });
        return;
      }

      if (!loginResponse.ok) {
        alertOnError("Login Failed", {
          ...loginResponse,
          message: "Invalid login credential. Please provide correct info",
        });

        return;
      }
      //navigate
      navigate("/projects", { replace: true });
      return;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  //Register handler function
  const handleRegister = async (event) => {
    //prevent reload
    event.preventDefault();

    //form inputs
    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData.entries());

    // try to login
    try {
      setLoading(true);
      if (Object.keys(formObject).length < 4) {
        showAlert("Fill The Form", "Mandatory data are missing.");
      }
      const registerResponse = await register(formObject);

      if (!registerResponse) {
        alertOnError("Register Failed", { status: 500 });
        return;
      }

      if (!registerResponse.ok) {
        alertOnError("Registration Failed", registerResponse);

        return;
      }

      //navigate
      navigate("/projects", { replace: true });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  //AuthLink handler Function
  const handleAuthlink = () => {
    if (containerRef.current) {
      setTimeout(() => {
        containerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 500);
    }
  };

  return (
    <>
      {/* main container div */}
      <div
        className={`${styles.container} ${
          !showSignin && styles["container--register"]
        }`}
        ref={containerRef}
      >
        {/* signin section */}
        {showSignin && (
          <>
            <div className={styles.information}>
              <h2>Welcome Back!</h2>
              <p>
                We're glad to see you again. Log in to access your projects,
                collaborate with your team, and stay on track with your tasks.
              </p>
            </div>
            <div className={styles["signin-form-container"]}>
              <h1>Sign in</h1>
              <form className={styles["form"]} onSubmit={handleSignin}>
                <div className={styles["input-container"]}>
                  <label htmlFor="email">Email:</label>
                  <input
                    className={styles.input}
                    type="email"
                    placeholder="example@gmail.com"
                    name="email"
                    id="email"
                    required
                  />
                </div>
                <div className={styles["input-container"]}>
                  <label htmlFor="password">Password:</label>
                  <input
                    className={styles.input}
                    type="password"
                    placeholder="At least 8 characters"
                    name="password"
                    id="password"
                    required
                  />
                </div>

                <button type="submit">Sign In</button>
              </form>
              <div className={styles["auth-links"]}>
                <p>
                  <u>Forgot Password?</u>
                </p>
                <p
                  onClick={() => {
                    handleAuthlink();
                    setShowSingin(false);
                  }}
                >
                  <u>Register</u>
                </p>
              </div>
            </div>
          </>
        )}
        {/* registration section */}
        {!showSignin && (
          <div className={styles["registration-form-container"]}>
            <h1>Sign Up</h1>
            <form className={styles["form"]} onSubmit={handleRegister}>
              <div className={styles["input-container"]}>
                <label htmlFor="name">Full Name:</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="John Doe..."
                  name="name"
                  required
                />
              </div>
              <div className={styles["input-container"]}>
                <label htmlFor="username">Username:</label>
                <input
                  className={styles.input}
                  type="text"
                  maxLength={20}
                  placeholder="johndoe221 ..."
                  name="username"
                  required
                />
              </div>
              <div className={styles["input-container"]}>
                <label htmlFor="email">Email:</label>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="example@gmail.com"
                  name="email"
                  required
                />
              </div>
              <div className={styles["input-container"]}>
                <label htmlFor="password">Password:</label>
                <input
                  className={styles.input}
                  type="password"
                  placeholder="At least 8 characters"
                  name="password"
                  required
                />
              </div>

              <div className={styles["input-container"]}>
                <label htmlFor="about">Brief note on yourself:</label>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  name="about"
                  id="about"
                  cols="30"
                  rows="10"
                ></textarea>
              </div>
              <div className={styles["input-container"]}>
                <label htmlFor="password">Avatar:</label>
                <input
                  className={`${styles.input} ${styles.avatar}`}
                  type="file"
                />
              </div>

              <button type="submit">Register</button>
            </form>
            <div className={styles["auth-links"]}>
              <p
                onClick={() => {
                  handleAuthlink();
                  setShowSingin(true);
                }}
              >
                <u>Have account? Login!</u>
              </p>
            </div>
          </div>
        )}
        {/* loading section */}
        {loading && <Spinner />}
      </div>
    </>
  );
}

export default AuthenticationPage;
