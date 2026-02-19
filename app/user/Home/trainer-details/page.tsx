"use client";

import { useState } from "react";
import { ArrowLeft, Star, MapPin, Clock, Users, Award, Mail, Phone, Facebook, Instagram, Twitter, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface Trainer {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  experienceYears: number;
  clients: number;
  successRate: number;
  sessionRate: number;
  location: string;
  email: string;
  phone: string;
  bio: string;
  specialties: string[];
  certifications: string[];
  availability: { day: string; hours: string }[];
}

const trainers: Trainer[] = [
  {
    id: "t1",
    name: "Sarah Johnson",
    title: "Strength & Conditioning Coach",
    rating: 4.8,
    reviews: 156,
    experienceYears: 10,
    clients: 24,
    successRate: 75,
    sessionRate: 60,
    location: "Downtown Fitness Studio",
    email: "sarah.johnson@nutrisphere.com",
    phone: "+1 (555) 123-4567",
    bio: "Sarah is a certified strength coach focused on functional training and long-term habit change. She specializes in program design for busy professionals and post-injury strength rebuilding.",
    specialties: ["Functional Training", "Strength Building", "Mobility", "Post-injury Rehab"],
    certifications: [
      "NASM Certified Personal Trainer",
      "NSCA Strength & Conditioning Specialist",
      "Precision Nutrition Level 1",
      "TRX Certified Coach",
    ],
    availability: [
      { day: "Mon - Fri", hours: "6:00 AM - 9:00 PM" },
      { day: "Saturday", hours: "8:00 AM - 4:00 PM" },
      { day: "Sunday", hours: "By appointment" },
    ],
  },
  {
    id: "t2",
    name: "John Smith",
    title: "HIIT & Performance Trainer",
    rating: 4.7,
    reviews: 132,
    experienceYears: 8,
    clients: 18,
    successRate: 70,
    sessionRate: 55,
    location: "Northside Training Hub",
    email: "john.smith@nutrisphere.com",
    phone: "+1 (555) 234-5678",
    bio: "John builds high-energy programs for fat loss and performance. He specializes in HIIT, conditioning, and sport-specific training blocks.",
    specialties: ["HIIT", "Athletic Performance", "Fat Loss", "Conditioning"],
    certifications: [
      "ACE Certified Personal Trainer",
      "CrossFit Level 1",
      "CPR/AED",
      "Kettlebell Specialist",
    ],
    availability: [
      { day: "Mon - Thu", hours: "7:00 AM - 8:00 PM" },
      { day: "Friday", hours: "7:00 AM - 6:00 PM" },
      { day: "Weekend", hours: "Limited slots" },
    ],
  },
  {
    id: "t3",
    name: "Emma Wilson",
    title: "Yoga & Mobility Coach",
    rating: 4.9,
    reviews: 189,
    experienceYears: 12,
    clients: 30,
    successRate: 80,
    sessionRate: 50,
    location: "Wellness Studio",
    email: "emma.wilson@nutrisphere.com",
    phone: "+1 (555) 345-6789",
    bio: "Emma combines yoga, mobility, and breathwork to improve performance and recovery. Her sessions emphasize flexibility and stress management.",
    specialties: ["Yoga", "Mobility", "Recovery", "Breathwork"],
    certifications: [
      "RYT-500 Yoga Teacher",
      "NASM Stretching Specialist",
      "Mindfulness Coach",
    ],
    availability: [
      { day: "Mon - Fri", hours: "9:00 AM - 7:00 PM" },
      { day: "Saturday", hours: "9:00 AM - 2:00 PM" },
    ],
  },
];

const tabs = ["About", "Specialties", "Certifications", "Availability"] as const;
type TabKey = (typeof tabs)[number];

export default function TrainerDetailsPage() {
  const router = useRouter();
  const [activeTrainerId, setActiveTrainerId] = useState(trainers[0].id);
  const [activeTab, setActiveTab] = useState<TabKey>("About");

  const trainer = trainers.find((item) => item.id === activeTrainerId) ?? trainers[0];

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-[#1A1008]/50 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-[#D4AF37]" />
        </button>
        <h1 className="text-4xl font-bold text-white">Trainer Details</h1>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {trainers.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTrainerId(item.id)}
            className={`px-4 py-2 rounded-full text-sm border transition-colors ${
              activeTrainerId === item.id
                ? "bg-[#D4AF37] text-[#1A1008] border-[#D4AF37]"
                : "bg-[#161B17] text-[#9FB3A6] border-[#2A3630] hover:border-[#D4AF37]/40"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-br from-[#161B17] to-[#0F1310] border border-[#2A3630] rounded-3xl p-8 mb-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#26322B] to-[#171C18] border border-[#D4AF37]/40 flex items-center justify-center text-4xl font-bold text-[#D4AF37]">
            {trainer.name.charAt(0)}
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">{trainer.name}</h2>
            <p className="text-[#9FB3A6] mb-4">{trainer.title}</p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <Star size={18} />
                <span className="font-semibold">{trainer.rating}</span>
              </div>
              <span className="text-[#7C8C83]">{trainer.reviews} reviews</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#171C18] border border-[#26322B] rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{trainer.experienceYears}</p>
                <p className="text-xs text-[#7C8C83]">Years Exp</p>
              </div>
              <div className="bg-[#171C18] border border-[#26322B] rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{trainer.clients}</p>
                <p className="text-xs text-[#7C8C83]">Active Clients</p>
              </div>
              <div className="bg-[#171C18] border border-[#26322B] rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{trainer.successRate}%</p>
                <p className="text-xs text-[#7C8C83]">Success Rate</p>
              </div>
              <div className="bg-[#171C18] border border-[#26322B] rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">${trainer.sessionRate}</p>
                <p className="text-xs text-[#7C8C83]">Per Session</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="px-5 py-3 bg-[#D4AF37] hover:bg-[#c4a032] text-[#1A1008] rounded-lg font-semibold transition-colors flex items-center gap-2">
                <Calendar size={18} />
                Book Session
              </button>
              <button className="px-5 py-3 bg-[#2A3630] hover:bg-[#3A4640] text-white rounded-lg font-semibold transition-colors flex items-center gap-2">
                <Mail size={18} />
                Message
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-[#161B17] border border-[#2A3630] rounded-2xl p-6">
          <div className="flex flex-wrap gap-3 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                  activeTab === tab
                    ? "bg-[#D4AF37] text-[#1A1008] border-[#D4AF37]"
                    : "bg-[#0F1310] text-[#9FB3A6] border-[#2A3630] hover:border-[#D4AF37]/40"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "About" && (
            <div className="space-y-3 text-[#9FB3A6]">
              <p className="text-white/90 whitespace-pre-line leading-relaxed">{trainer.bio}</p>
            </div>
          )}

          {activeTab === "Specialties" && (
            <div className="flex flex-wrap gap-3">
              {trainer.specialties.map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 bg-[#0F1310] border border-[#2A3630] rounded-full text-sm text-[#D4AF37]"
                >
                  {item}
                </span>
              ))}
            </div>
          )}

          {activeTab === "Certifications" && (
            <div className="space-y-3">
              {trainer.certifications.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Award size={18} className="text-[#D4AF37]" />
                  <span className="text-[#9FB3A6]">{item}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Availability" && (
            <div className="space-y-3">
              {trainer.availability.map((slot) => (
                <div key={slot.day} className="flex items-center gap-3">
                  <Clock size={18} className="text-[#D4AF37]" />
                  <span className="text-[#9FB3A6]">
                    {slot.day}: {slot.hours}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#161B17] border border-[#2A3630] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-[#D4AF37]" />
            <span className="text-[#9FB3A6]">{trainer.location}</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-[#D4AF37]" />
            <span className="text-[#9FB3A6]">{trainer.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-[#D4AF37]" />
            <span className="text-[#9FB3A6]">{trainer.phone}</span>
          </div>

          <div className="border-t border-[#2A3630] pt-4">
            <p className="text-sm text-[#7C8C83] mb-3">Connect</p>
            <div className="flex items-center gap-3">
              <button className="p-2 bg-[#0F1310] border border-[#2A3630] rounded-lg hover:border-[#D4AF37]/40 transition-colors">
                <Facebook size={18} className="text-[#9FB3A6]" />
              </button>
              <button className="p-2 bg-[#0F1310] border border-[#2A3630] rounded-lg hover:border-[#D4AF37]/40 transition-colors">
                <Instagram size={18} className="text-[#9FB3A6]" />
              </button>
              <button className="p-2 bg-[#0F1310] border border-[#2A3630] rounded-lg hover:border-[#D4AF37]/40 transition-colors">
                <Twitter size={18} className="text-[#9FB3A6]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#161B17] border border-[#2A3630] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users size={18} className="text-[#D4AF37]" />
          <h3 className="text-lg font-semibold text-white">Program Focus</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {trainer.specialties.map((item) => (
            <span
              key={item}
              className="px-4 py-2 bg-[#0F1310] border border-[#2A3630] rounded-full text-sm text-[#9FB3A6]"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}