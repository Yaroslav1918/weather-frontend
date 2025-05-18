"use client";
import { use, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const ConfirmPage = () => {
  const router = useRouter();
  const params = useParams();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const BASE_URL = "http://localhost:3001";
  useEffect(() => {
    const token = params.token;

    if (!token) return;

    axios
      .get(`${BASE_URL}/api/confirm/${token}`)
      .then(() => {
        setStatus("success");
        localStorage.setItem("subscriptionToken", token);
        localStorage.setItem("isSubscribed", "true");
      })
      .catch(() => setStatus("error"));
  }, [params.token]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      {status === "loading" && (
        <p className="text-gray-600 text-lg mb-4 animate-pulse">Loading...</p>
      )}
      {status === "error" && (
        <p className="text-red-600 text-lg font-semibold mb-4">
          Error: Invalid or expired token.
        </p>
      )}
      {status === "success" && (
        <p className="text-green-600 text-lg font-semibold mb-4">
          Subscription confirmed! Thank you.
        </p>
      )}
      <button
        onClick={() => router.push("/")}
        className="mt-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
      >
        Go back
      </button>
    </div>
  );
};
export default ConfirmPage;
