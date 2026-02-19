"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { ArrowLeft, Send } from "lucide-react";
import { useRouter } from "next/navigation";

const requestPlanSchema = z.object({
  goals: z.string().min(10, "Please describe your goals in at least 10 characters"),
  currentFitnessLevel: z.enum(["beginner", "intermediate", "advanced"]).refine(val => val, {
    message: "Please select your current fitness level",
  }),
  dietaryRestrictions: z.string().optional(),
  preferredWorkoutDays: z.array(z.string()).min(1, "Please select at least one workout day"),
  additionalNotes: z.string().optional(),
});

type RequestPlanData = z.infer<typeof requestPlanSchema>;

export default function RequestPlanPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RequestPlanData>({
    resolver: zodResolver(requestPlanSchema),
    defaultValues: {
      preferredWorkoutDays: [],
    },
  });

  const selectedDays = watch("preferredWorkoutDays") || [];

  const workoutDays = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  const toggleDay = (day: string) => {
    const current = selectedDays;
    if (current.includes(day)) {
      setValue("preferredWorkoutDays", current.filter(d => d !== day));
    } else {
      setValue("preferredWorkoutDays", [...current, day]);
    }
  };

  const onSubmit = async (data: RequestPlanData) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Here you would make an API call to submit the request
      console.log("Submitting plan request:", data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setMessage({
        type: "success",
        text: "Your diet and workout plan request has been submitted successfully! We'll get back to you within 24 hours.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to submit request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg text-[#9FB3A6] hover:bg-[#1A201C] hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#D4AF37]">Request Diet & Workout Plan</h1>
          <p className="text-[#9FB3A6] text-sm">Get personalized plans tailored to your needs</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Goals */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Your Fitness Goals *
          </label>
          <textarea
            {...register("goals")}
            placeholder="Describe your fitness goals (e.g., lose weight, build muscle, improve endurance, etc.)"
            className="w-full h-24 px-4 py-3 bg-[#161B17] border border-[#2A3630] rounded-lg text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none resize-none"
          />
          {errors.goals && (
            <p className="text-red-400 text-sm mt-1">{errors.goals.message}</p>
          )}
        </div>

        {/* Fitness Level */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Current Fitness Level *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "beginner", label: "Beginner" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" },
            ].map((level) => (
              <label key={level.value} className="relative">
                <input
                  type="radio"
                  value={level.value}
                  {...register("currentFitnessLevel")}
                  className="sr-only peer"
                />
                <div className="p-3 bg-[#161B17] border border-[#2A3630] rounded-lg text-center text-sm text-[#9FB3A6] peer-checked:border-[#D4AF37] peer-checked:text-[#D4AF37] cursor-pointer transition-colors">
                  {level.label}
                </div>
              </label>
            ))}
          </div>
          {errors.currentFitnessLevel && (
            <p className="text-red-400 text-sm mt-1">{errors.currentFitnessLevel.message}</p>
          )}
        </div>

        {/* Dietary Restrictions */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Dietary Restrictions (Optional)
          </label>
          <input
            {...register("dietaryRestrictions")}
            placeholder="e.g., vegetarian, gluten-free, allergies, etc."
            className="w-full px-4 py-3 bg-[#161B17] border border-[#2A3630] rounded-lg text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        {/* Preferred Workout Days */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Preferred Workout Days *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {workoutDays.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                  selectedDays.includes(day.value)
                    ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]"
                    : "bg-[#161B17] border-[#2A3630] text-[#9FB3A6] hover:border-[#D4AF37]/50"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
          {errors.preferredWorkoutDays && (
            <p className="text-red-400 text-sm mt-1">{errors.preferredWorkoutDays.message}</p>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            {...register("additionalNotes")}
            placeholder="Any additional information or preferences..."
            className="w-full h-20 px-4 py-3 bg-[#161B17] border border-[#2A3630] rounded-lg text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-[#D4AF37] text-[#1A1008] rounded-lg font-semibold hover:bg-[#c4a032] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-[#1A1008] border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={18} />
              Submit Request
            </>
          )}
        </button>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}