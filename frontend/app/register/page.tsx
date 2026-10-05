"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const existingUser = localStorage.getItem("soilAnalyticsUser");

    if (existingUser) {
      try {
        const user = JSON.parse(existingUser);

        if (
          user.email.toLowerCase() === email.trim().toLowerCase()
        ) {
          setError(
            "An account with this email already exists."
          );
          return;
        }
      } catch {
        localStorage.removeItem("soilAnalyticsUser");
      }
    }

    const user = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
    };

    localStorage.setItem(
      "soilAnalyticsUser",
      JSON.stringify(user)
    );

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
              Create Account
            </h1>

            <p className="mt-2 text-gray-500">
              Join AI Soil Analytics
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
            onSubmit={handleRegister}
            className="mt-7 space-y-5"
          >

            {/* Name */}
            <div>

              <label className="mb-2 block font-semibold text-[#082b55]">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

            </div>


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
                placeholder="Create a password"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

            </div>


            {/* Confirm Password */}
            <div>

              <label className="mb-2 block font-semibold text-[#082b55]">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm your password"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

            </div>


            {/* Register */}
            <button
              type="submit"
              className="w-full rounded-xl bg-green-700 px-5 py-3.5 font-bold text-white transition hover:bg-green-800"
            >
              Register
            </button>

          </form>


          {/* Login */}
          <div className="mt-6 text-center text-sm text-gray-600">

            Already have an account?

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="ml-1 font-bold text-green-700 hover:underline"
            >
              Login
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