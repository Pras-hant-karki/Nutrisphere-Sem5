"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Menu, X, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface WorkoutNote {
  id: string;
  title: string;
  date: string;
  content: string;
  manualTitle?: boolean;
}

export default function WorkoutRecordsPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notes, setNotes] = useState<WorkoutNote[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string>("");
  const [isEditingTitle, setIsEditingTitle] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const activeNote = notes.find(n => n.id === activeNoteId) || null;

  const handleContentChange = (newContent: string) => {
    setNotes(prev => prev.map(n => {
      if (n.id === activeNoteId) {
        const words = newContent.trim().split(/\s+/).filter(Boolean);
        const autoTitle = words.slice(0, 3).join(" ") || "New note";
        return { ...n, content: newContent, title: n.manualTitle ? n.title : autoTitle };
      }
      return n;
    }));
  };

  const createNewNote = () => {
    const newNote: WorkoutNote = {
      id: Date.now().toString(),
      title: "New note",
      date: "Today",
      content: "",
      manualTitle: false,
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  };

  const confirmDelete = () => {
    if (showDeleteModal) {
      const updated = notes.filter(n => n.id !== showDeleteModal);
      setNotes(updated);
      if (activeNoteId === showDeleteModal) setActiveNoteId(updated[0]?.id || "");
      setShowDeleteModal(null);
    }
  };

  return (
    <div className="flex h-screen bg-[#0A0705] text-white font-sans overflow-hidden gap-2">

      {/* MAIN WORKING AREA !ml-[40px]: gap between the app nav-sidebar and this area*/}
      <main className="flex-1 flex flex-col relative h-full !ml-[40px]">
        
        <div className="flex items-center justify-between px-12 !pt-10 !mb-8">
          {/* Back button */}
          <button
            onClick={() => router.push("/user/home")}
            className="text-[#FACC15] hover:scale-110 transition-transform"
          >
            <ChevronLeft size={48} strokeWidth={3} />
          </button>

          <h1 className="!text-[56px] font-black text-[#FACC15] tracking-tight text-center flex-1">
            Workout Records
          </h1>

          {/* Invisible spacer to keep title visually centered */}
          <div className="w-12" />
        </div>

        <header className="flex items-center justify-end px-12 py-4 z-30">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2.5 bg-[#1E1E1E] rounded-xl text-[#FACC15] hover:bg-[#252525] border border-white/5 transition-all"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        <div className="flex-1 p-12 pt-8 flex flex-col w-full overflow-hidden">
          {activeNote ? (
            <div className="h-full w-full bg-[#121212] flex flex-col overflow-hidden">
              <textarea
                className="w-full h-full bg-transparent outline-none resize-none px-20 py-16 text-xl leading-relaxed text-gray-300 font-normal placeholder:text-gray-700 custom-scrollbar"
                placeholder="Start writing..."
                value={activeNote.content}
                onChange={(e) => handleContentChange(e.target.value)}
              />
            </div>
          ) : (
            <div className="h-full bg-[#121212] flex flex-col items-center justify-center gap-3">
              <Edit2 size={48} className="text-gray-700" />
              <p className="text-gray-600 text-lg">Click <span className="text-[#FACC15] font-bold">+</span> to create a new note</p>
            </div>
          )}
        </div>
      </main>

      <aside className={`transition-all duration-300 bg-[#121212] flex flex-col z-40
        ${isSidebarOpen ? "w-[320px] border-l border-white/10" : "w-0 opacity-0 pointer-events-none"}`}>

        
        <div className="p-8 flex items-center justify-between border-b border-white/5">
          <h2 className="text-[#FACC15] font-bold text-2xl">History</h2>
          <button onClick={createNewNote} className="text-[#FACC15] hover:scale-110 transition-transform">
            <Plus size={28} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pt-6 px-4">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={`px-5 py-5 cursor-pointer transition-all group relative rounded-lg mb-2
                ${activeNoteId === note.id ? "bg-[#1E1E1E]" : "hover:bg-[#181818]"}`}
            >
              <div className="pr-16">
                {isEditingTitle === note.id ? (
                  <input
                    autoFocus
                    className="bg-transparent outline-none w-full text-lg text-white border-b border-[#FACC15]"
                    value={note.title}
                    onChange={(e) => setNotes(notes.map(n => n.id === note.id ? {...n, title: e.target.value} : n))}
                    onBlur={() => { setIsEditingTitle(null); setNotes(prev => prev.map(n => n.id === note.id ? { ...n, manualTitle: true } : n)); }}
                  />
                ) : (
                  <p className={`text-lg font-medium truncate ${activeNoteId === note.id ? "text-[#FACC15]" : "text-gray-300"}`}>
                    {note.title}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">{note.date}</p>
              </div>

              {/* Action Icons */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); setIsEditingTitle(note.id); }} className="text-gray-500 hover:text-[#FACC15]">
                  <Edit2 size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setShowDeleteModal(note.id); }} className="text-gray-500 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          <div className="bg-[#1E1E1E] p-10 rounded-2xl max-w-sm w-full text-center border border-white/10">
            <h3 className="text-xl font-bold mb-2">Are you sure?</h3>
            <p className="text-gray-400 mb-8 font-normal">You want to delete this note?</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(null)} className="flex-1 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 rounded-lg bg-red-600 hover:bg-red-700 font-bold transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #FACC15; }
      `}</style>
    </div>
  );
}