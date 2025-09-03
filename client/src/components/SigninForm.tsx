"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useError } from "@/contexts/ErrorContex";

type Props = {
  handleAuthLink: () => void;
  setShowSignin: (val: boolean) => void;
  setLoading: (val: boolean) => void;
};

export default function SignInForm({
  handleAuthLink,
  setShowSignin,
  setLoading,
}: Props) {
  const { login } = useAuth();
  const alertOnError = useError();
  const router = useRouter();

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

  return (
    <>
      <h1 className="text-3xl font-bold text-black mb-6">Sign In</h1>
      <form
        className="flex flex-col justify-start items-center gap-6 w-full"
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
  );
}
