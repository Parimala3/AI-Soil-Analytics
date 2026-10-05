"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    const storedUser =
      localStorage.getItem("soilAnalyticsUser");

    if (!storedUser) {
      setError(
        "No account found. Please register first."
      );
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (
        user.email.toLowerCase() !==
        email.trim().toLowerCase()
      ) {
        setError("Incorrect email or password.");
        return;
      }

      if (user.password !== password) {
        setError("Incorrect email or password.");
        return;
      }

      localStorage.setItem(
        "soilAnalyticsLoggedIn",
        "true"
      );

      localStorage.setItem(
        "soilAnalyticsCurrentUser",
        JSON.stringify({
          name: user.name,
          email: user.email,
        })
      );

      router.push("/");
    } catch {
      setError(
        "Unable to read account information. Please register again."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f8f3] px-5 py-10">

      <div className="mx-auto flex min-h-[90vh] max-w-md items-center justify-center">

        <div className="w-full rounded-3xl bg-white p-7 shadow-lg">

          {/* Logo */}
          <div className="text-center">

            <div className="text-5xl">
              🌱
            </div>

            <h1 className="mt-3 text-3xl font-bold text-[#082b55]">
              Welcome Back
            </h1>

            <p className="mt-2 text-gray-500">
              Login to AI Soil Analytics
            </p>

          </div>


          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
              ⚠️ {error}
            </div>
          )}


          {/* Form */}
          <form
            onSubmit={handleLogin}
            className="mt-7 space-y-5"
          >

            {/* Email */}
            <div>

              <label className="mb-2 block font-semibold text-[#082b55]">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

            </div>


            {/* Password */}
            <div>

              <label className="mb-2 block font-semibold text-[#082b55]">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

            </div>


            {/* Login */}
            <button
              type="submit"
              className="w-full rounded-xl bg-green-700 px-5 py-3.5 font-bold text-white transition hover:bg-green-800"
            >
              Login
            </button>

          </form>


          {/* Register */}
          <div className="mt-6 text-center text-sm text-gray-600">

            Don't have an account?

            <button
              type="button"
              onClick={() => router.push("/register")}
              className="ml-1 font-bold text-green-700 hover:underline"
            >
              Create Account
            </button>

          </div>


          {/* Back */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-5 w-full text-center text-sm font-semibold text-gray-500 hover:text-green-700"
          >
            ← Back to Home
          </button>

        </div>

      </div>

    </main>
  );
}