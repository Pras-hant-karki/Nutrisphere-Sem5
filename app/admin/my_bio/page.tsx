"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Check, ChevronLeft, ImagePlus, Maximize2, PencilLine, Plus, Save, Trash2, X } from "lucide-react";
import { API_BASE_URL, buildApiUrl } from "@/lib/api/base-url";
import { getToken } from "@/lib/auth-helpers";
import { useRouter } from "next/navigation";
import NotificationBell from "@/app/components/notification-bell";

type BioEntryType = "text" | "image";

interface BioEntry {
  type: BioEntryType;
  content: string;
}

const normalizeBioEntry = (entry: any): BioEntry => ({
  type: entry?.type === "image" ? "image" : "text",
  content:
    typeof entry?.content === "string"
      ? entry.content
      : entry?.content == null
      ? ""
      : String(entry.content),
});

const resolveImageSrc = (content: string): string => {
  if (content.startsWith("http://") || content.startsWith("https://")) {
    return content;
  }
  if (content.startsWith("/")) {
    return `${API_BASE_URL}${content}`;
  }
  return content;
};

export default function MyBioPage() {
  const router = useRouter();
  const [bioEntries, setBioEntries] = useState<BioEntry[]>([]);
  const [draftEntries, setDraftEntries] = useState<BioEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletePrompt, setDeletePrompt] = useState<{ index: number; type: BioEntryType } | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  useEffect(() => {
    fetchBio();
  }, []);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [successMessage]);

  const visibleEntries = isEditMode ? draftEntries : bioEntries;
  const hasEntries = useMemo(() => visibleEntries.length > 0, [visibleEntries]);

  const fetchBio = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const token = getToken();
      const response = await axios.get(buildApiUrl("/api/admin/bio"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const list = Array.isArray(response.data?.data) ? response.data.data : [];
      const normalized = list.map(normalizeBioEntry);
      setBioEntries(normalized);
      setDraftEntries(normalized);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to fetch bio";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const addTextEntry = () => {
    if (!isEditMode) return;
    setDraftEntries((previous) => [...previous, { type: "text", content: "" }]);
  };

  const removeEntry = (index: number) => {
    if (!isEditMode) return;
    setDraftEntries((previous) => previous.filter((_, i) => i !== index));
  };

  const askRemoveEntry = (index: number, type: BioEntryType) => {
    if (!isEditMode) return;
    setDeletePrompt({ index, type });
  };

  const confirmRemoveEntry = () => {
    if (!deletePrompt) return;
    removeEntry(deletePrompt.index);
    setDeletePrompt(null);
  };

  const updateTextEntry = (index: number, value: string) => {
    if (!isEditMode) return;
    setDraftEntries((previous) =>
      previous.map((entry, i) => (i === index ? { ...entry, content: value } : entry))
    );
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    if (!isEditMode) {
      event.target.value = "";
      return;
    }

    try {
      setIsUploadingImage(true);
      setError(null);
      setSuccessMessage(null);

      const token = getToken();
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await axios.post(
        buildApiUrl("/api/admin/bio/upload-image"),
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = response.data?.data?.imageUrl;
      if (!imageUrl) {
        throw new Error("Image upload failed");
      }

      setDraftEntries((previous) => [
        ...previous,
        { type: "image", content: String(imageUrl) },
      ]);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to upload image";
      setError(errorMsg);
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleToggleEdit = () => {
    setError(null);
    setSuccessMessage(null);
    setDeletePrompt(null);

    if (isEditMode) {
      setDraftEntries(bioEntries.map(normalizeBioEntry));
      setIsEditMode(false);
      return;
    }

    setDraftEntries(bioEntries.map(normalizeBioEntry));
    setIsEditMode(true);
  };

  const handleSave = async () => {
    if (!isEditMode) return;

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      const cleanedEntries = draftEntries
        .map((entry) => ({
          type: entry.type,
          content: String(entry.content ?? "").trim(),
        }))
        .filter((entry) => entry.content.length > 0);

      const token = getToken();
      const response = await axios.put(
        buildApiUrl("/api/admin/bio"),
        { bio: cleanedEntries },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setBioEntries(cleanedEntries.map(normalizeBioEntry));
        setDraftEntries(cleanedEntries.map(normalizeBioEntry));
        setIsEditMode(false);
        setSuccessMessage("Admin Bio saved sucessfully !");
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to save bio";
      setError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#0A0705] min-h-screen relative">
      <NotificationBell className="absolute top-8 right-10 z-50" />

      <div className="!ml-[40px] !mr-[80px] pt-10 pb-12">
        <div className="w-full">
          {successMessage && (
            <div className="mb-4 flex justify-center">
              <div className="inline-flex min-h-[56px] min-w-[360px] items-center justify-center gap-2 rounded-[20px] border border-[#15803D] bg-[#4ADE80] px-6 py-4 text-[18px] font-normal text-black shadow-lg">
                <Check size={18} className="text-black" strokeWidth={2.25} />
                <span className="font-normal text-black">{successMessage}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between !pt-16 !mb-6">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="text-[#FACC15] hover:scale-110 transition-transform"
            >
              <ChevronLeft size={48} strokeWidth={3} />
            </button>
            <h1 className="!text-[56px] font-black text-[#FACC15] tracking-tight text-center flex-1">
              My Bio
            </h1>
            <div className="w-12" />
          </div>

          {error && (
            <div className="mb-5 rounded-[14px] border border-[#E53935]/40 bg-[#E53935]/10 px-4 py-3 text-sm text-[#ff6b6b]">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="rounded-[16px] border border-[#D4AF37]/40 bg-[#171C18] px-6 py-14 text-center text-[#9FB3A6]">
              Loading bio...
            </div>
          ) : (
            <div className="rounded-2xl border border-[#2A3630] bg-[#171C18] p-5 md:p-6 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={addTextEntry}
                    disabled={!isEditMode}
                    className="inline-flex min-w-[170px] justify-center items-center gap-2 h-[46px] px-7 rounded-[14px] bg-[#2ECC71]/12 text-[#2ECC71] border border-[#2ECC71]/40 text-base font-bold hover:bg-[#2ECC71]/20 transition-all disabled:opacity-45 disabled:cursor-not-allowed"
                  >
                    <Plus size={18} />
                    Add Text
                  </button>

                  <label
                    className={`inline-flex min-w-[170px] justify-center items-center gap-2 h-[46px] px-7 rounded-[14px] border text-base font-bold transition-all ${
                      isEditMode
                        ? "bg-[#D4AF37]/12 text-[#D4AF37] border-[#D4AF37]/40 hover:bg-[#D4AF37]/20 cursor-pointer"
                        : "bg-[#D4AF37]/8 text-[#D4AF37]/50 border-[#D4AF37]/20 cursor-not-allowed"
                    }`}
                  >
                    <ImagePlus size={18} />
                    {isUploadingImage ? "Uploading..." : "Add Image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                      disabled={isUploadingImage || !isEditMode}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleToggleEdit}
                    className="inline-flex min-w-[170px] justify-center items-center gap-2 h-[46px] px-7 rounded-[14px] bg-[#3B82F6]/12 text-[#93C5FD] border border-[#60A5FA]/35 text-base font-bold hover:bg-[#3B82F6]/20 transition-all"
                  >
                    <PencilLine size={18} />
                    {isEditMode ? "Cancel" : "Edit"}
                  </button>
                </div>

                {isEditMode && (
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving || isUploadingImage}
                    className="inline-flex min-w-[170px] justify-center items-center gap-2 h-[46px] px-7 rounded-[14px] bg-[#2ECC71]/12 text-[#2ECC71] border border-[#2ECC71]/40 text-base font-bold hover:bg-[#2ECC71]/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Save size={18} />
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                )}
              </div>

              <div className="rounded-[14px] border border-[#2A3630] bg-[#0F1310] px-4 py-4 md:px-5 md:py-5 space-y-4">
                {!hasEntries ? (
                  <div className="rounded-[12px] border border-dashed border-[#2A3630] bg-[#111612] px-5 py-12 text-center text-[#9FB3A6]">
                    No bio entries yet. Use Add Text or Add Image.
                  </div>
                ) : (
                  visibleEntries.map((entry, index) => (
                    <div
                      key={`${entry.type}-${index}`}
                      className="relative rounded-[12px] border border-[#26322B] bg-[#111612] p-3 md:p-4"
                    >
                      {isEditMode && (
                        <button
                          type="button"
                          onClick={() => askRemoveEntry(index, entry.type)}
                          className="absolute right-2 top-2 z-20 inline-flex items-center justify-center rounded-full p-1.5 text-[#ff5c5c] hover:text-[#ff7d7d] hover:bg-[#ff5c5c]/10"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}

                      {entry.type === "text" ? (
                        isEditMode ? (
                          <textarea
                            value={entry.content}
                            onChange={(event) => updateTextEntry(index, event.target.value)}
                            rows={5}
                            className="w-full rounded-[10px] border border-[#2A3630] bg-[#0F1310] px-4 py-3 text-base leading-relaxed text-white outline-none focus:ring-2 focus:ring-[#2ECC71]/40 resize-y"
                            placeholder="Write something about yourself..."
                          />
                        ) : (
                          <p className="whitespace-pre-line px-1 py-1 text-base leading-relaxed text-[#E7ECE9]">
                            {entry.content}
                          </p>
                        )
                      ) : (
                        <div className="rounded-[10px] border border-[#2A3630] bg-[#0F1310] p-2.5">
                          <div className="relative">
                            <img
                              src={resolveImageSrc(entry.content)}
                              alt={`Bio image ${index + 1}`}
                              className="w-full max-h-[360px] object-cover rounded-[10px]"
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setFullscreenImage(resolveImageSrc(entry.content))}
                              className={`absolute top-2 z-10 inline-flex items-center justify-center rounded-lg bg-black/60 p-2 text-white hover:bg-black/85 transition-colors ${
                                isEditMode ? "right-10" : "right-2"
                              }`}
                            >
                              <Maximize2 size={16} />
                            </button>
                          </div>
                          {isEditMode && <p className="mt-2 text-xs text-[#9FB3A6] break-all">{entry.content}</p>}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {deletePrompt && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          <div className="bg-[#1E1E1E] min-h-[170px] rounded-2xl max-w-sm w-full text-center border border-white/10 flex flex-col justify-center px-6 py-6">
            <h3 className="text-3xl font-bold mb-4 text-white">Are you sure?</h3>
            <p className="text-gray-400 mb-7 font-normal text-2xl">
              You want to delete this {deletePrompt.type}?
            </p>
            <div className="flex items-center justify-center gap-4 mt-1">
              <button
                type="button"
                onClick={() => setDeletePrompt(null)}
                className="w-[100px] py-2.5 rounded-[8px] bg-white/5 hover:bg-white/10 transition-all text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRemoveEntry}
                className="w-[100px] py-2.5 rounded-[8px] bg-red-600 hover:bg-red-700 font-bold transition-all text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {fullscreenImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-6"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            type="button"
            onClick={() => setFullscreenImage(null)}
            className="absolute top-5 right-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
          >
            <X size={24} />
          </button>
          <img
            src={fullscreenImage}
            alt="Bio fullscreen preview"
            className="max-h-[90vh] max-w-[92vw] object-contain rounded-xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
