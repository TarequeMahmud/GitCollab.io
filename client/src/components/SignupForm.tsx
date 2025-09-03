"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useError } from "@/contexts/ErrorContex";
import { useAlert } from "@/contexts/AlertContext";

type Props = {
  handleAuthLink: () => void;
  setShowSignin: (val: boolean) => void;
  setLoading: (val: boolean) => void;
};

export default function SignUpForm({
  handleAuthLink,
  setShowSignin,
  setLoading,
}: Props) {
  const { register } = useAuth();
  const alertOnError = useError();
  const { showAlert } = useAlert();
  const router = useRouter();

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

  return (
    <>
      <h1 className="text-3xl font-bold text-black mb-6">Sign Up</h1>
      <form
        className="flex flex-col justify-start items-center gap-6 w-full"
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
  );
}
