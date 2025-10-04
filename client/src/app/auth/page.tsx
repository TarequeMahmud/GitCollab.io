"use client";

import { useState, useRef } from "react";
import Spinner from "@/components/Spinner";
import SignInForm from "@/components/SigninForm";
import SignUpForm from "@/components/SignupForm";

export default function AuthenticationPage() {
  const [loading, setLoading] = useState(false);
  const [showSignin, setShowSignin] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAuthLink = () => {
    if (containerRef.current) {
      setTimeout(() => {
        containerRef.current!.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 500);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`mt-12 w-4/5 max-w-[1000px] mx-auto rounded-2xl border border-[#414141] bg-[#e9e9e9] shadow-md transition-all duration-500 flex overflow-hidden ${showSignin ? "h-[500px]" : "h-[1100px]"
        }`}
    >
      {/* LEFT INFO PANEL (only on signin) */}
      {showSignin && (
        <div className="w-1/2 h-full flex flex-col justify-center items-center text-white bg-gradient-to-br from-[#1f6fe7] to-[#013d75] p-6">
          <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-center w-4/5">
            We&apos;re glad to see you again. Log in to access your projects,
            collaborate with your team, and stay on track with your tasks.
          </p>
        </div>
      )}

      {/* RIGHT PANEL */}
      <div
        className={`flex flex-col justify-start items-center p-8 ${showSignin ? "w-1/2" : "w-4/5 mx-auto"
          }`}
      >
        {showSignin ? (
          <SignInForm
            handleAuthLink={handleAuthLink}
            setShowSignin={setShowSignin}
            setLoading={setLoading}
          />
        ) : (
          <SignUpForm
            handleAuthLink={handleAuthLink}
            setShowSignin={setShowSignin}
            setLoading={setLoading}
          />
        )}
      </div>

      {loading && <Spinner />}
    </div>
  );
}
