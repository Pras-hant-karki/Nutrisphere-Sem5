"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Edit2, TrendingUp, Zap, Target, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface WorkoutRecord {
  id: string;
  date: string;
  exercise: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  intensity: "Light" | "Moderate" | "Heavy";
  notes?: string;
}

export default function WorkoutRecordsPage() {
  const router = useRouter();
  const [records, setRecords] = useState<WorkoutRecord[]>([
    {
      id: "1",
      date: "Today",
      exercise: "Bench Press",
      sets: 4,
      reps: 8,
      weight: 185,
      intensity: "Heavy",
      notes: "Great form today, felt strong"
    },
    {
      id: "2",
      date: "Yesterday",
      exercise: "Squats",
      sets: 3,
      reps: 10,
      weight: 225,
      intensity: "Heavy",
      notes: "Increased weight by 5 lbs"
    },
    {
      id: "3",
      date: "2 days ago",
      exercise: "Cardio",
      sets: 1,
      reps: 30,
      duration: 30,
      intensity: "Moderate",
      notes: "Treadmill run at 6.5 mph"
    },
  ]);

  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<WorkoutRecord>>({
    date: "Today",
    exercise: "",
    sets: 1,
    reps: 10,
    weight: 0,
    intensity: "Moderate",
    notes: ""
  });

  const stats = {
    thisWeekWorkouts: 12,
    totalExercises: 24,
    personalRecords: 3,
    caloriesBurned: 2840
  };

  const exercises = [
    "Bench Press", "Squats", "Deadlifts", "Pull-ups", "Dips", 
    "Cardio", "Cycling", "Swimming", "Running", "Yoga",
    "Plank", "Sit-ups", "Push-ups", "Lat Pulldown", "Leg Press"
  ];

  const handleAddRecord = () => {
    if (formData.exercise) {
      const newRecord: WorkoutRecord = {
        id: Date.now().toString(),
        date: formData.date || "Today",
        exercise: formData.exercise,
        sets: formData.sets || 1,
        reps: formData.reps || 10,
        weight: formData.weight,
        duration: formData.duration,
        intensity: formData.intensity as "Light" | "Moderate" | "Heavy",
        notes: formData.notes
      };

      if (editingId) {
        setRecords(records.map(r => r.id === editingId ? { ...newRecord, id: editingId } : r));
        setEditingId(null);
      } else {
        setRecords([newRecord, ...records]);
      }

      setFormData({
        date: "Today",
        exercise: "",
        sets: 1,
        reps: 10,
        weight: 0,
        intensity: "Moderate",
        notes: ""
      });
      setIsAddingRecord(false);
    }
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
  };

  const handleEditRecord = (record: WorkoutRecord) => {
    setFormData(record);
    setEditingId(record.id);
    setIsAddingRecord(true);
  };

  const intensityColor = (intensity: string) => {
    switch (intensity) {
      case "Light":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "Moderate":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "Heavy":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      default:
        return "bg-[#2A3630] text-[#9FB3A6]";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg text-[#9FB3A6] hover:bg-[#1A201C] hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-[#D4AF37]">Workout Records</h1>
            <p className="text-[#9FB3A6]">Track your fitness progress and achievements</p>
          </div>
        </div>
        <button
          onClick={() => {
            setIsAddingRecord(!isAddingRecord);
            setEditingId(null);
            if (isAddingRecord) {
              setFormData({
                date: "Today",
                exercise: "",
                sets: 1,
                reps: 10,
                weight: 0,
                intensity: "Moderate",
                notes: ""
              });
            }
          }}
          className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c4a032] text-[#1A1008] rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          {isAddingRecord ? "Cancel" : "Add Record"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#161B17] to-[#0F1310] border border-[#2A3630] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar size={20} className="text-[#D4AF37]" />
            <h3 className="text-[#9FB3A6] text-sm font-medium">This Week</h3>
          </div>
          <p className="text-3xl font-bold text-white">{stats.thisWeekWorkouts}</p>
          <p className="text-[#7C8C83] text-xs mt-1">Workouts completed</p>
        </div>

        <div className="bg-gradient-to-br from-[#161B17] to-[#0F1310] border border-[#2A3630] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={20} className="text-[#D4AF37]" />
            <h3 className="text-[#9FB3A6] text-sm font-medium">Total Exercises</h3>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalExercises}</p>
          <p className="text-[#7C8C83] text-xs mt-1">Different variations</p>
        </div>

        <div className="bg-gradient-to-br from-[#161B17] to-[#0F1310] border border-[#2A3630] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target size={20} className="text-[#D4AF37]" />
            <h3 className="text-[#9FB3A6] text-sm font-medium">Personal Records</h3>
          </div>
          <p className="text-3xl font-bold text-white">{stats.personalRecords}</p>
          <p className="text-[#7C8C83] text-xs mt-1">Personal bests</p>
        </div>

        <div className="bg-gradient-to-br from-[#161B17] to-[#0F1310] border border-[#2A3630] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Zap size={20} className="text-[#D4AF37]" />
            <h3 className="text-[#9FB3A6] text-sm font-medium">Calories Burned</h3>
          </div>
          <p className="text-3xl font-bold text-white">{stats.caloriesBurned}</p>
          <p className="text-[#7C8C83] text-xs mt-1">This week</p>
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAddingRecord && (
        <div className="bg-gradient-to-br from-[#161B17] to-[#0F1310] border border-[#2A3630] rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-6">
            {editingId ? "Edit Workout Record" : "Add New Workout Record"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Exercise */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">Exercise*</label>
              <select
                value={formData.exercise || ""}
                onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
                className="w-full px-4 py-2 bg-[#0F1310] border border-[#2A3630] rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="">Select an exercise</option>
                {exercises.map(ex => (
                  <option key={ex} value={ex}>{ex}</option>
                ))}
              </select>
            </div>

            {/* Intensity */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">Intensity</label>
              <select
                value={formData.intensity || "Moderate"}
                onChange={(e) => setFormData({ ...formData, intensity: e.target.value as any })}
                className="w-full px-4 py-2 bg-[#0F1310] border border-[#2A3630] rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="Light">Light</option>
                <option value="Moderate">Moderate</option>
                <option value="Heavy">Heavy</option>
              </select>
            </div>

            {/* Sets */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">Sets</label>
              <input
                type="number"
                min="1"
                value={formData.sets || 1}
                onChange={(e) => setFormData({ ...formData, sets: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-[#0F1310] border border-[#2A3630] rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Reps */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">Reps</label>
              <input
                type="number"
                min="1"
                value={formData.reps || 10}
                onChange={(e) => setFormData({ ...formData, reps: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-[#0F1310] border border-[#2A3630] rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">Weight (lbs)</label>
              <input
                type="number"
                min="0"
                value={formData.weight || 0}
                onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) })}
                placeholder="Optional"
                className="w-full px-4 py-2 bg-[#0F1310] border border-[#2A3630] rounded-lg text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">Duration (min)</label>
              <input
                type="number"
                min="0"
                value={formData.duration || 0}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                placeholder="Optional"
                className="w-full px-4 py-2 bg-[#0F1310] border border-[#2A3630] rounded-lg text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">Notes</label>
            <textarea
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes about your workout..."
              className="w-full px-4 py-2 bg-[#0F1310] border border-[#2A3630] rounded-lg text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none resize-none h-20"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAddRecord}
              className="flex-1 px-4 py-2 bg-[#D4AF37] hover:bg-[#c4a032] text-[#1A1008] rounded-lg font-semibold transition-colors"
            >
              {editingId ? "Update Record" : "Add Record"}
            </button>
            <button
              onClick={() => {
                setIsAddingRecord(false);
                setEditingId(null);
                setFormData({
                  date: "Today",
                  exercise: "",
                  sets: 1,
                  reps: 10,
                  weight: 0,
                  intensity: "Moderate",
                  notes: ""
                });
              }}
              className="flex-1 px-4 py-2 bg-[#2A3630] hover:bg-[#3A4640] text-white rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Records List */}
      <div className="space-y-3">
        {records.length === 0 ? (
          <div className="bg-[#161B17] border border-[#2A3630] rounded-2xl p-12 text-center">
            <Calendar size={48} className="mx-auto mb-4 text-[#7C8C83]" />
            <p className="text-[#9FB3A6] text-lg mb-2">No workout records yet</p>
            <p className="text-[#7C8C83]">Start tracking your workouts to see your progress</p>
          </div>
        ) : (
          records.map((record) => (
            <div
              key={record.id}
              className="bg-gradient-to-r from-[#161B17] to-[#0F1310] border border-[#2A3630] rounded-xl p-5 hover:border-[#D4AF37]/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-white">{record.exercise}</h3>
                    <span className={`px-3 py-1 rounded-lg border text-xs font-medium ${intensityColor(record.intensity)}`}>
                      {record.intensity}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-2">
                    <div>
                      <p className="text-[#7C8C83] text-xs">Sets</p>
                      <p className="text-white font-semibold">{record.sets}</p>
                    </div>
                    <div>
                      <p className="text-[#7C8C83] text-xs">Reps</p>
                      <p className="text-white font-semibold">{record.reps}</p>
                    </div>
                    {record.weight ? (
                      <div>
                        <p className="text-[#7C8C83] text-xs">Weight</p>
                        <p className="text-white font-semibold">{record.weight} lbs</p>
                      </div>
                    ) : null}
                    {record.duration ? (
                      <div>
                        <p className="text-[#7C8C83] text-xs">Duration</p>
                        <p className="text-white font-semibold">{record.duration} min</p>
                      </div>
                    ) : null}
                    <div>
                      <p className="text-[#7C8C83] text-xs">Date</p>
                      <p className="text-white font-semibold">{record.date}</p>
                    </div>
                  </div>

                  {record.notes && (
                    <p className="text-[#9FB3A6] text-sm italic">{record.notes}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditRecord(record)}
                    className="p-2 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteRecord(record.id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
