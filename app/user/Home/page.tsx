"use client";

import { useState, useEffect } from "react";
import { Calendar, BarChart3, Users, ChevronRight, Flame, TrendingUp, Award, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface SessionData {
  _id: string;
  title: string;
  time: string;
  trainer: string;
  capacity: number;
}

export default function HomePage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [stats, setStats] = useState({
    weeklyWorkouts: 4,
    caloriesBurned: 2840,
    personalRecord: "50 kg",
    streak: 12
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch upcoming sessions from backend
    const fetchSessions = async () => {
      try {
        // Mock sessions for now - replace with actual API call
        setSessions([
          {
            _id: "1",
            title: "Circuit Workout",
            time: "8:00 AM - 9:00 AM",
            trainer: "John Smith",
            capacity: 12
          },
          {
            _id: "2",
            title: "HIIT Cardio",
            time: "5:00 PM - 5:45 PM",
            trainer: "Sarah Johnson",
            capacity: 8
          }
        ]);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const dashboardCards = [
    {
      title: "Sessions",
      description: "Explore available sessions",
      icon: Calendar,
      href: "/user/home/sessions",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Workout Records",
      description: "Track your workouts here",
      icon: BarChart3,
      href: "/user/home/workout-records",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Trainer Details",
      description: "Know your Trainer!",
      icon: Users,
      href: "/user/home/trainer-details",
      color: "from-purple-500 to-purple-600"
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#D4AF37] mb-2">Welcome Back!</h1>
        <p className="text-[#9FB3A6]">Here's your fitness summary for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#161B17] to-[#0F1310] border border-[#2A3630] rounded-2xl p-6 hover:border-[#D4AF37]/30 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#9FB3A6] text-sm font-medium">Weekly Workouts</h3>
            <Flame size={20} className="text-[#D4AF37]" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.weeklyWorkouts}</p>
          <p className="text-[#7C8C83] text-xs mt-2">Keep it going! 💪</p>
        </div>

        <div className="bg-gradient-to-br from-[#161B17] to-[#0F1310] border border-[#2A3630] rounded-2xl p-6 hover:border-[#D4AF37]/30 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#9FB3A6] text-sm font-medium">Calories Burned</h3>
            <TrendingUp size={20} className="text-[#D4AF37]" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.caloriesBurned}</p>
          <p className="text-[#7C8C83] text-xs mt-2">This week</p>
        </div>

        <div className="bg-gradient-to-br from-[#161B17] to-[#0F1310] border border-[#2A3630] rounded-2xl p-6 hover:border-[#D4AF37]/30 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#9FB3A6] text-sm font-medium">Personal Record</h3>
            <Award size={20} className="text-[#D4AF37]" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.personalRecord}</p>
          <p className="text-[#7C8C83] text-xs mt-2">Bench press</p>
        </div>

        <div className="bg-gradient-to-br from-[#161B17] to-[#0F1310] border border-[#2A3630] rounded-2xl p-6 hover:border-[#D4AF37]/30 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#9FB3A6] text-sm font-medium">Current Streak</h3>
            <Clock size={20} className="text-[#D4AF37]" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.streak}</p>
          <p className="text-[#7C8C83] text-xs mt-2">Days active</p>
        </div>
      </div>

      {/* Upcoming Sessions */}
      {sessions.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Upcoming Sessions</h2>
            <button
              onClick={() => router.push("/user/home/sessions")}
              className="text-[#D4AF37] hover:text-[#D4AF37]/80 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-3">
            {sessions.slice(0, 2).map((session) => (
              <div
                key={session._id}
                className="bg-gradient-to-r from-[#161B17] to-[#0F1310] border border-[#2A3630] rounded-xl p-4 hover:border-[#D4AF37]/50 transition-all group cursor-pointer"
                onClick={() => router.push("/user/home/sessions")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center border border-[#D4AF37]/20">
                      <Calendar size={20} className="text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{session.title}</h3>
                      <p className="text-[#9FB3A6] text-sm">
                        {session.time} • with {session.trainer}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[#D4AF37] text-sm font-medium">{session.capacity} spots</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {dashboardCards.map((card) => (
            <div
              key={card.title}
              onClick={() => router.push(card.href)}
              className="group bg-gradient-to-br from-[#161B17] to-[#0F1310] border border-[#2A3630] rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-[#D4AF37]/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <card.icon size={24} className="text-white" />
                </div>
                <ChevronRight size={20} className="text-[#4A5A50] group-hover:text-[#D4AF37] transition-colors" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">{card.title}</h3>
              <p className="text-[#9FB3A6] text-sm">{card.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => router.push("/user/appointments/book-pt")}
          className="bg-gradient-to-r from-[#D4AF37] to-[#E5C158] hover:from-[#c4a032] hover:to-[#d4a040] text-[#1A1008] rounded-xl p-6 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <div className="flex items-center gap-3">
            <Calendar size={24} />
            <span>Book PT Session</span>
          </div>
        </button>
        <button
          onClick={() => router.push("/user/appointments/request-plan")}
          className="bg-gradient-to-r from-[#D4AF37] to-[#E5C158] hover:from-[#c4a032] hover:to-[#d4a040] text-[#1A1008] rounded-xl p-6 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <div className="flex items-center gap-3">
            <Flame size={24} />
            <span>Request Fitness Plan</span>
          </div>
        </button>
      </div>
    </div>
  );
}
