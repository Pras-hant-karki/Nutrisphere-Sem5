"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import { API_BASE_URL, buildApiUrl } from "@/lib/api/base-url";
import { getToken } from "@/lib/auth-helpers";

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
  const [bioEntries, setBioEntries] = useState<BioEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchBio();
  }, []);

  const hasEntries = useMemo(() => bioEntries.length > 0, [bioEntries]);

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
      setBioEntries(list.map(normalizeBioEntry));
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to fetch bio";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const addTextEntry = () => {
    setBioEntries((previous) => [...previous, { type: "text", content: "" }]);
  };

  const removeEntry = (index: number) => {
    setBioEntries((previous) => previous.filter((_, i) => i !== index));
  };

  const updateTextEntry = (index: number, value: string) => {
    setBioEntries((previous) =>
      previous.map((entry, i) => (i === index ? { ...entry, content: value } : entry))
    );
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
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

      setBioEntries((previous) => [
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

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      const cleanedEntries = bioEntries
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
        setSuccessMessage("Bio saved successfully");
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
    <div className="bg-[#0A0705] min-h-screen">
      <div className="!ml-[40px] pl-10 pr-12 pt-16 pb-12">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-[#D4AF37] tracking-tight">My Bio</h1>
              <p className="text-[#9FB3A6] mt-2 text-sm">
                Manage the same trainer bio content shown in the mobile app.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-[14px] border border-[#E53935]/40 bg-[#E53935]/10 px-4 py-3 text-sm text-[#ff6b6b]">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-5 rounded-[14px] border border-[#2ECC71]/40 bg-[#2ECC71]/10 px-4 py-3 text-sm text-[#2ECC71]">
              {successMessage}
            </div>
          )}

          {isLoading ? (
            <div className="rounded-[16px] border border-[#D4AF37]/40 bg-[#171C18] px-6 py-14 text-center text-[#9FB3A6]">
              Loading bio...
            </div>
          ) : (
            <div className="rounded-[16px] border border-[#D4AF37]/40 bg-[#171C18] p-5 md:p-6 shadow-lg">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={addTextEntry}
                  className="inline-flex items-center gap-2 h-[46px] px-5 rounded-[14px] bg-[#2ECC71]/12 text-[#2ECC71] border border-[#2ECC71]/40 text-base font-bold hover:bg-[#2ECC71]/20 transition-all"
                >
                  <Plus size={18} />
                  Add Text
                </button>

                <label className="inline-flex items-center gap-2 h-[46px] px-5 rounded-[14px] bg-[#D4AF37]/12 text-[#D4AF37] border border-[#D4AF37]/40 text-base font-bold hover:bg-[#D4AF37]/20 transition-all cursor-pointer">
                  <ImagePlus size={18} />
                  {isUploadingImage ? "Uploading..." : "Add Image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                    disabled={isUploadingImage}
                  />
                </label>
              </div>

              <div className="mt-5 space-y-4">
                {!hasEntries ? (
                  <div className="rounded-[14px] border border-dashed border-[#D4AF37]/40 px-5 py-12 text-center text-[#9FB3A6]">
                    No bio entries yet. Use Add Text or Add Image.
                  </div>
                ) : (
                  bioEntries.map((entry, index) => (
                    <div
                      key={`${entry.type}-${index}`}
                      className="rounded-[14px] border border-[#D4AF37]/45 bg-[#1E1E1E] p-4 md:p-5 shadow-md"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-[#D4AF37]/12 text-[#D4AF37] border border-[#D4AF37]/30">
                          {entry.type}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeEntry(index)}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#ff5c5c] hover:text-[#ff7d7d]"
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      </div>

                      {entry.type === "text" ? (
                        <textarea
                          value={entry.content}
                          onChange={(event) => updateTextEntry(index, event.target.value)}
                          rows={5}
                          className="w-full rounded-[12px] border border-[#26322B] bg-[#111612] px-4 py-3 text-base text-white outline-none focus:ring-2 focus:ring-[#2ECC71]/40 resize-y"
                          placeholder="Write something about yourself..."
                        />
                      ) : (
                        <div className="rounded-[12px] border border-[#26322B] bg-[#111612] p-2.5">
                          <img
                            src={resolveImageSrc(entry.content)}
                            alt={`Bio image ${index + 1}`}
                            className="w-full max-h-[360px] object-cover rounded-[10px]"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                          <p className="mt-2 text-xs text-[#9FB3A6] break-all">{entry.content}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || isUploadingImage}
                  className="inline-flex items-center gap-2 h-[48px] px-8 rounded-[12px] bg-[#2ECC71] text-[#0F1310] text-[28px] font-black hover:bg-[#26c969] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  {isSaving ? "Saving..." : "Save Bio"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
