"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import { useAlert } from "@/contexts/AlertContext";
import { useAuth } from "@/contexts/AuthContext";
import { useError } from "@/contexts/ErrorContex";

export default function AuthenticationPage() {
  const { login, register } = useAuth();
  const { showAlert } = useAlert();
  const alertOnError = useError();
  const [loading, setLoading] = useState(false);
  const [showSignin, setShowSignin] = useState(true);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSignin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      setLoading(true);
      if (!email || !password) return;

      const loginResponse = await login({ email, password });
      if (!loginResponse) {
        alertOnError("Login Failed", { status: 500 });
        return;
      }
      if (!loginResponse.ok) {
        alertOnError("Login Failed", {
          ...loginResponse,
          message: "Invalid login credentials.",
        });
        return;
      }

      router.replace("/projects");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formObject = Object.fromEntries(formData.entries()) as {
      email: string;
      password: string;
      name: string;
      confirmPassword: string;
    };

    try {
      setLoading(true);
      if (Object.keys(formObject).length < 4) {
        showAlert("Fill The Form", "Mandatory data are missing.");
        return;
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

      router.replace("/projects");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthLink = () => {
    if (containerRef.current) {
      setTimeout(() => {
        containerRef!.current!.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 500);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`mt-12 w-4/5 max-w-[1000px] mx-auto rounded-2xl border border-[#414141] bg-[#e9e9e9] shadow-md transition-all duration-500 flex overflow-hidden ${
        showSignin ? "h-[500px]" : "h-[1100px]"
      }`}
    >
      {/* LEFT INFO PANEL (only on signin) */}
      {showSignin && (
        <div className="w-1/2 h-full flex flex-col justify-center items-center text-white bg-gradient-to-br from-[#1f6fe7] to-[#013d75] p-6">
          <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-center w-4/5">
            We're glad to see you again. Log in to access your projects,
            collaborate with your team, and stay on track with your tasks.
          </p>
        </div>
      )}

      {/* RIGHT PANEL (forms) */}
      <div
        className={`flex flex-col justify-start items-center p-8 ${
          showSignin ? "w-1/2" : "w-4/5 mx-auto"
        }`}
      >
        {showSignin ? (
          <>
            <h1 className="text-3xl font-bold text-black mb-6">Sign In</h1>
            <form
              className="flex flex-col gap-6 w-full"
              onSubmit={handleSignin}
            >
              <div className="flex flex-col items-start w-full">
                <label htmlFor="email" className="text-lg text-black mb-1">
                  Email:
                </label>
                <input
                  className="w-full h-12 px-3 rounded-lg bg-[#45705a] text-white text-lg placeholder-white/40 focus:outline-none"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="example@gmail.com"
                  required
                />
              </div>
              <div className="flex flex-col items-start w-full">
                <label htmlFor="password" className="text-lg text-black mb-1">
                  Password:
                </label>
                <input
                  className="w-full h-12 px-3 rounded-lg bg-[#45705a] text-white text-lg placeholder-white/40 focus:outline-none"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="At least 8 characters"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-800 text-white text-xl py-3 rounded-lg mt-6"
              >
                Sign In
              </button>
            </form>

            <div className="flex justify-between mt-6 w-4/5 mx-auto text-black text-md cursor-pointer">
              <p className="hover:text-blue-600">Forgot Password?</p>
              <p
                className="hover:text-blue-600"
                onClick={() => {
                  handleAuthLink();
                  setShowSignin(false);
                }}
              >
                Register
              </p>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-black mb-6">Sign Up</h1>
            <form
              className="flex flex-col gap-6 w-full"
              onSubmit={handleRegister}
            >
              <div className="flex flex-col items-start w-full">
                <label htmlFor="name" className="text-lg text-black mb-1">
                  Full Name:
                </label>
                <input
                  className="w-full h-12 px-3 rounded-lg bg-[#45705a] text-white text-lg placeholder-white/40 focus:outline-none"
                  type="text"
                  name="name"
                  placeholder="John Doe..."
                  required
                />
              </div>
              <div className="flex flex-col items-start w-full">
                <label htmlFor="username" className="text-lg text-black mb-1">
                  Username:
                </label>
                <input
                  className="w-full h-12 px-3 rounded-lg bg-[#45705a] text-white text-lg placeholder-white/40 focus:outline-none"
                  type="text"
                  name="username"
                  placeholder="johndoe221 ..."
                  maxLength={20}
                  required
                />
              </div>
              <div className="flex flex-col items-start w-full">
                <label htmlFor="email" className="text-lg text-black mb-1">
                  Email:
                </label>
                <input
                  className="w-full h-12 px-3 rounded-lg bg-[#45705a] text-white text-lg placeholder-white/40 focus:outline-none"
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  required
                />
              </div>
              <div className="flex flex-col items-start w-full">
                <label htmlFor="password" className="text-lg text-black mb-1">
                  Password:
                </label>
                <input
                  className="w-full h-12 px-3 rounded-lg bg-[#45705a] text-white text-lg placeholder-white/40 focus:outline-none"
                  type="password"
                  name="password"
                  placeholder="At least 8 characters"
                  required
                />
              </div>
              <div className="flex flex-col items-start w-full">
                <label htmlFor="about" className="text-lg text-black mb-1">
                  Brief note on yourself:
                </label>
                <textarea
                  className="w-full p-3 rounded-lg bg-[#45705a] text-white text-lg placeholder-white/40 resize-none focus:outline-none"
                  name="about"
                  id="about"
                  rows={5}
                />
              </div>
              <div className="flex flex-col items-start w-full">
                <label htmlFor="avatar" className="text-lg text-black mb-1">
                  Avatar:
                </label>
                <input
                  className="w-3/5 p-2 rounded-lg bg-[#45705a] text-white text-lg file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-700 file:text-white hover:file:bg-blue-600"
                  type="file"
                  name="avatar"
                  id="avatar"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-800 text-white text-xl py-3 rounded-lg mt-6"
              >
                Register
              </button>
            </form>
            <p
              className="text-md mt-6 cursor-pointer hover:text-blue-600"
              onClick={() => {
                handleAuthLink();
                setShowSignin(true);
              }}
            >
              Have an account? Login!
            </p>
          </>
        )}
      </div>

      {/* Spinner overlay */}
      {loading && <Spinner />}
    </div>
  );
}
