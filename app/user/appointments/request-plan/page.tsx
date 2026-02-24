"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth-helpers";
import { buildApiUrl } from "@/lib/api/base-url";

type PlanStatus = "pending" | "approved" | "rejected";

type PlanRequestItem = {
  _id: string;
  requestType: "diet" | "workout";
  status: PlanStatus;
  createdAt: string;
  adminResponse?: {
    respondedAt?: string;
  };
};

export default function RequestPlanPage() {
  const router = useRouter();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [job, setJob] = useState("");
  const [foodAllergy, setFoodAllergy] = useState("");
  const [dietType, setDietType] = useState<"veg" | "non-veg">("non-veg");
  const [medical, setMedical] = useState<"No" | "Yes">("No");
  const [medicalCondition, setMedicalCondition] = useState("");
  const [goal, setGoal] = useState("");
  const [dietDescription, setDietDescription] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<PlanRequestItem[]>([]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const formatTimestamp = (value: string) => {
    const date = new Date(value);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const time = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

    if (dateOnly.getTime() === today.getTime()) return `Today on ${time}`;
    if (dateOnly.getTime() === yesterday.getTime()) return `Yesterday on ${time}`;

    return date.toLocaleString();
  };

  const loadMyRequests = async () => {
    const token = getToken();
    if (!token) return;

    try {
      setIsLoading(true);
      const response = await axios.get(buildApiUrl("/api/plan-requests/my-requests"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data?.data || []);
    } catch {
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMyRequests();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    if (!height.trim() || !weight.trim() || !goal.trim()) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    const token = getToken();
    if (!token) {
      setMessage({ type: "error", text: "Please log in again" });
      return;
    }

    const mergedSpecialRequest = [
      specialRequest.trim(),
      dietDescription.trim() ? `Diet preferences: ${dietDescription.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      setIsSubmitting(true);
      await axios.post(
        buildApiUrl("/api/plan-requests"),
        {
          requestType: "diet",
          height,
          weight,
          job,
          foodAllergy: foodAllergy.trim() || "None",
          dietType,
          medicalCondition: medical === "No" ? "No" : medicalCondition,
          trainingType: "",
          goal,
          specialRequest: mergedSpecialRequest,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setHeight("");
      setWeight("");
      setJob("");
      setFoodAllergy("");
      setDietType("non-veg");
      setMedical("No");
      setMedicalCondition("");
      setGoal("");
      setDietDescription("");
      setSpecialRequest("");
      setMessage({ type: "success", text: "Request sent to Trainer" });
      loadMyRequests();
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to send request",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg text-[#9FB3A6] hover:bg-[#1A201C] hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-[#D4AF37]">Request Plan</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Height"
          className="w-full px-4 py-3 bg-[#161B17] border border-[#2A3630] rounded-2xl text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight"
            className="w-full px-4 py-3 bg-[#161B17] border border-[#2A3630] rounded-2xl text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none"
          />
          <input
            value={job}
            onChange={(e) => setJob(e.target.value)}
            placeholder="Job"
            className="w-full px-4 py-3 bg-[#161B17] border border-[#2A3630] rounded-2xl text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <input
          value={foodAllergy}
          onChange={(e) => setFoodAllergy(e.target.value)}
          placeholder="Any food allergy"
          className="w-full px-4 py-3 bg-[#161B17] border border-[#2A3630] rounded-2xl text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none"
        />

        <div>
          <p className="text-white text-sm mb-2">Diet Type</p>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-[#D9E5DC]">
              <input
                type="radio"
                checked={dietType === "veg"}
                onChange={() => setDietType("veg")}
                className="accent-[#D4AF37]"
              />
              Veg
            </label>
            <label className="flex items-center gap-2 text-[#D9E5DC]">
              <input
                type="radio"
                checked={dietType === "non-veg"}
                onChange={() => setDietType("non-veg")}
                className="accent-[#D4AF37]"
              />
              Non-Veg
            </label>
          </div>
        </div>

        <textarea
          value={dietDescription}
          onChange={(e) => setDietDescription(e.target.value)}
          placeholder="Describe your diet preferences (e.g., I am veg but eat egg and fish, no chicken etc.)"
          className="w-full h-24 px-4 py-3 bg-[#161B17] border border-[#2A3630] rounded-2xl text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none resize-none"
        />

        <div>
          <p className="text-white text-sm mb-2">Any Medical Condition</p>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-[#D9E5DC]">
              <input
                type="radio"
                checked={medical === "No"}
                onChange={() => setMedical("No")}
                className="accent-[#D4AF37]"
              />
              No
            </label>
            <label className="flex items-center gap-2 text-[#D9E5DC]">
              <input
                type="radio"
                checked={medical === "Yes"}
                onChange={() => setMedical("Yes")}
                className="accent-[#D4AF37]"
              />
              Yes
            </label>
          </div>
        </div>

        {medical === "Yes" && (
          <input
            value={medicalCondition}
            onChange={(e) => setMedicalCondition(e.target.value)}
            placeholder="Describe your medical condition"
            className="w-full px-4 py-3 bg-[#161B17] border border-[#2A3630] rounded-2xl text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none"
          />
        )}

        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Your Goal"
          className="w-full h-24 px-4 py-3 bg-[#161B17] border border-[#2A3630] rounded-2xl text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none resize-none"
        />

        <textarea
          value={specialRequest}
          onChange={(e) => setSpecialRequest(e.target.value)}
          placeholder="Any special request or suggestions ?"
          className="w-full h-24 px-4 py-3 bg-[#161B17] border border-[#2A3630] rounded-2xl text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none resize-none"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-[#D4AF37] text-[#1A1008] rounded-lg font-semibold hover:bg-[#c4a032] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Request"}
        </button>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}
      </form>

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-white">My Plans</h2>
        <div className="mt-5 space-y-4">
          {isLoading ? (
            <div className="text-[#9FB3A6]">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="text-[#9FB3A6]">No plans requested yet</div>
          ) : (
            requests.map((request) => {
              const statusColor =
                request.status === "approved"
                  ? "text-green-400 bg-green-500/10"
                  : request.status === "rejected"
                  ? "text-red-400 bg-red-500/10"
                  : "text-amber-400 bg-amber-500/10";

              const stamp = request.adminResponse?.respondedAt
                ? formatTimestamp(request.adminResponse.respondedAt)
                : formatTimestamp(request.createdAt);

              return (
                <div key={request._id} className="rounded-xl border border-[#2A3630] bg-[#161B17] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-white font-semibold capitalize">{request.requestType} Plan</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColor}`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#9FB3A6]">{stamp}</p>
                  <p className="mt-1 text-xs italic text-[#9FB3A6]">Tap to view details</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
