"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Check, Clock3, UserRound, ChevronLeft, Maximize2, PencilLine, Plus, Save, Trash2, X } from "lucide-react";
import axios from "axios";
import { buildApiUrl } from "@/lib/api/base-url";
import { getToken } from "@/lib/auth-helpers";
import { useRouter } from "next/navigation";
import NotificationBell from "@/app/components/notification-bell";

interface FitnessContent {
  _id: string;
  title: string;
  description: string;
  content?: string;
  image?: string;
  video?: string;
  adminName: string;
  tags?: string[];
  duration?: number;
  createdAt: string;
}

type CreatePostForm = {
  title: string;
  description: string;
  image?: string;
};

const emptyCreateForm: CreatePostForm = {
  title: "",
  description: "",
  image: "",
};

const normalizePost = (post: any): FitnessContent => ({
  _id: String(post?._id ?? ""),
  title: typeof post?.title === "string" ? post.title : "",
  description: typeof post?.description === "string" ? post.description : "",
  content: typeof post?.content === "string" ? post.content : undefined,
  image: typeof post?.image === "string" ? post.image : undefined,
  video: typeof post?.video === "string" ? post.video : undefined,
  adminName: typeof post?.adminName === "string" ? post.adminName : "Admin",
  tags: Array.isArray(post?.tags) ? post.tags : undefined,
  duration: typeof post?.duration === "number" ? post.duration : undefined,
  createdAt: typeof post?.createdAt === "string" ? post.createdAt : new Date().toISOString(),
});

const resolveMediaPath = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return buildApiUrl(path);
};

export default function FitnessPostsPage() {
  const router = useRouter();
  const [content, setContent] = useState<FitnessContent[]>([]);
  const [draftContent, setDraftContent] = useState<FitnessContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [createForm, setCreateForm] = useState<CreatePostForm>(emptyCreateForm);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FitnessContent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<{ src: string; alt: string } | null>(null);

  const visibleContent = useMemo(
    () => (isEditMode ? draftContent : content),
    [isEditMode, draftContent, content]
  );

  const hasContent = visibleContent.length > 0;

  useEffect(() => {
    fetchFitnessContent();
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

  const fetchFitnessContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      const response = await axios.get(buildApiUrl("/api/fitness"));
      if (response.data.success) {
        const list = Array.isArray(response.data?.data) ? response.data.data : [];
        const normalized = list.map(normalizePost);
        setContent(normalized);
        setDraftContent(normalized);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load fitness content");
      console.error("Error fetching fitness content:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCreatedTime = (dateValue: string) => {
    const date = new Date(dateValue);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString();
  };

  const handleOpenCreateModal = () => {
    setError(null);
    setCreateForm(emptyCreateForm);
    setIsCreateModalOpen(true);
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    try {
      setIsUploadingImage(true);
      setError(null);

      const token = getToken();
      const formData = new FormData();
      formData.append("fitnessPhoto", selectedFile);

      const response = await axios.post(buildApiUrl("/api/fitness/upload-photo"), formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedImagePath = response.data?.data;
      if (!uploadedImagePath) {
        throw new Error("Image upload failed");
      }

      setCreateForm((previous) => ({ ...previous, image: String(uploadedImagePath) }));
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleCreatePost = async () => {
    const title = createForm.title.trim();
    const description = createForm.description.trim();
    const image = (createForm.image || "").trim();

    if (title.length < 5) {
      setError("Title must be at least 5 characters");
      return;
    }

    if (description.length < 10) {
      setError("Description must be at least 10 characters");
      return;
    }

    try {
      setIsCreatingPost(true);
      setError(null);
      setSuccessMessage(null);
      const token = getToken();

      const payload: Record<string, any> = {
        title,
        description,
        isPublished: true,
      };

      if (image) {
        payload.image = image;
      }

      const response = await axios.post(buildApiUrl("/api/fitness"), payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const created = normalizePost(response.data?.content || payload);
      setContent((previous) => [created, ...previous]);
      setDraftContent((previous) => [created, ...previous]);
      setIsCreateModalOpen(false);
      setCreateForm(emptyCreateForm);
      setSuccessMessage("Fitness post added sucessfully");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to add post");
    } finally {
      setIsCreatingPost(false);
    }
  };

  const handleToggleEdit = () => {
    setError(null);

    if (isEditMode) {
      setDraftContent(content.map(normalizePost));
      setIsEditMode(false);
      return;
    }

    setDraftContent(content.map(normalizePost));
    setIsEditMode(true);
  };

  const updateDraftField = (id: string, field: "title" | "description", value: string) => {
    if (!isEditMode) return;

    setDraftContent((previous) =>
      previous.map((entry) => (entry._id === id ? { ...entry, [field]: value } : entry))
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const token = getToken();
      const originalMap = new Map(content.map((item) => [item._id, item]));

      const changedEntries = draftContent.filter((entry) => {
        const original = originalMap.get(entry._id);
        if (!original) {
          return false;
        }

        const currentTitle = entry.title.trim();
        const currentDescription = entry.description.trim();

        return currentTitle !== original.title || currentDescription !== original.description;
      });

      for (const entry of changedEntries) {
        if (entry.title.trim().length < 5) {
          throw new Error("Title must be at least 5 characters");
        }
        if (entry.description.trim().length < 10) {
          throw new Error("Description must be at least 10 characters");
        }
      }

      await Promise.all(
        changedEntries.map((entry) =>
          axios.put(
            buildApiUrl(`/api/fitness/${entry._id}`),
            {
              title: entry.title.trim(),
              description: entry.description.trim(),
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        )
      );

      const cleaned = draftContent.map((entry) => ({
        ...entry,
        title: entry.title.trim(),
        description: entry.description.trim(),
      }));

      setContent(cleaned.map(normalizePost));
      setDraftContent(cleaned.map(normalizePost));
      setIsEditMode(false);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to save post updates");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      const token = getToken();

      await axios.delete(buildApiUrl(`/api/fitness/${deleteTarget._id}`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setContent((previous) => previous.filter((item) => item._id !== deleteTarget._id));
      setDraftContent((previous) => previous.filter((item) => item._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderPageHeader = () => (
    <>
      {successMessage && (
        <div className="mb-4 flex justify-center">
          <div className="inline-flex min-h-[56px] min-w-[360px] items-center justify-center gap-2 rounded-[20px] border border-[#15803D] bg-[#4ADE80] px-6 py-4 text-[18px] font-normal text-black shadow-lg">
            <Check size={18} className="text-black" strokeWidth={2.25} />
            <span className="font-normal text-black">{successMessage}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-4 !mb-2">
        <button onClick={() => router.push("/admin/dashboard")} className="text-[#FACC15] hover:scale-110 transition-transform">
          <ChevronLeft size={48} strokeWidth={3} />
        </button>
        <h1 className="!text-[56px] font-black text-[#FACC15] tracking-tight text-center flex-1">Fitness Posts</h1>
        <div className="w-12" />
      </div>

      <div className="flex flex-col items-center text-center gap-1 mt-2">
        <div>
          <p className="text-[#9FB3A6] text-sm">High quality fitness guidance below !</p>
        </div>
      </div>

      <div className="h-8" />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex min-w-[170px] justify-center items-center gap-2 h-[46px] px-7 rounded-[14px] bg-[#3B82F6]/12 text-[#93C5FD] border border-[#60A5FA]/35 text-base font-bold hover:bg-[#3B82F6]/20 transition-all disabled:opacity-45 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            Add Post
          </button>

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
            disabled={isSaving}
            className="inline-flex min-w-[170px] justify-center items-center gap-2 h-[46px] px-7 rounded-[14px] bg-[#2ECC71]/12 text-[#2ECC71] border border-[#2ECC71]/40 text-base font-bold hover:bg-[#2ECC71]/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {isSaving ? "Saving..." : "Save"}
          </button>
        )}
      </div>
    </>
  );

  return (
    <div className="!ml-[40px] !mr-[80px] min-h-screen bg-[#0A0705] relative">
      <NotificationBell className="absolute top-8 right-10 z-50" />
      <div className="!pt-4 pb-12">
        {renderPageHeader()}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-red-400 font-medium">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-10">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-[#161B17] border border-[#2A3630] rounded-2xl p-4 animate-pulse">
                <div className="w-full h-[360px] bg-[#2A3630] rounded-xl" />
                <div className="mt-5 space-y-3">
                  <div className="h-7 bg-[#2A3630] rounded w-3/4"></div>
                  <div className="h-4 bg-[#2A3630] rounded w-full"></div>
                  <div className="h-4 bg-[#2A3630] rounded w-4/5"></div>
                </div>
              </div>
            ))}
          </div>
        ) : !hasContent ? (
          <div className="rounded-xl border border-[#26322B] bg-[#171C18] p-6">
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💪</span>
              </div>
              <p className="text-[#9FB3A6] text-base font-medium">No fitness content available</p>
              <p className="text-[#7C8C83] text-sm mt-2">Check back soon for personalized workout and diet plans!</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {visibleContent.map((item) => (
              <div key={item._id} className="relative bg-[#0A0705] border border-[#2A3630] rounded-2xl p-4 md:p-5 hover:border-[#D4AF37]/30 transition-colors">
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    className="absolute right-5 top-5 z-20 inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-500/80 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                <div className="w-full">
                  {item.image ? (
                    <div className="relative w-full rounded-xl overflow-hidden border border-[#2A3630] group">
                      <Image
                        src={resolveMediaPath(item.image)}
                        alt={item.title}
                        width={1200}
                        height={900}
                        unoptimized
                        className="w-full h-[340px] md:h-[480px] object-cover"
                      />
                      <button
                        onClick={() => setFullscreenImage({ src: resolveMediaPath(item.image || ""), alt: item.title })}
                        className={`absolute top-3 bg-black/60 hover:bg-black/90 text-white p-2 rounded-lg transition-opacity ${
                          isEditMode ? "right-14 opacity-100" : "right-3 opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        <Maximize2 size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-[340px] md:h-[480px] rounded-xl border border-[#2A3630] bg-[#0F1310] flex items-center justify-center">
                      <p className="text-[#7C8C83] text-sm">No media available</p>
                    </div>
                  )}

                  <div className="pt-5 px-1">
                    {isEditMode ? (
                      <input
                        value={item.title}
                        onChange={(event) => updateDraftField(item._id, "title", event.target.value)}
                        className="w-full rounded-[10px] border border-[#2A3630] bg-[#0F1310] px-4 py-3 text-2xl md:text-3xl font-bold text-white outline-none focus:ring-2 focus:ring-[#2ECC71]/40"
                        placeholder="Post title"
                      />
                    ) : (
                      <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">
                        {item.title}
                      </h2>
                    )}

                    {isEditMode ? (
                      <textarea
                        value={item.description || item.content || ""}
                        onChange={(event) => updateDraftField(item._id, "description", event.target.value)}
                        rows={4}
                        className="mt-4 w-full rounded-[10px] border border-[#2A3630] bg-[#0F1310] px-4 py-3 text-base md:text-lg leading-relaxed text-[#C3D2C8] outline-none focus:ring-2 focus:ring-[#2ECC71]/40 resize-y"
                        placeholder="Post description"
                      />
                    ) : (
                      <p className="text-[#C3D2C8] text-base md:text-lg leading-relaxed mt-4 mb-4 whitespace-pre-line">
                        {item.description || item.content || ""}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-5 text-sm text-[#9FB3A6] mt-4">
                      <div className="flex items-center gap-2">
                        <Clock3 size={15} />
                        <span>{formatCreatedTime(item.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserRound size={15} />
                        <span>Created by {item.adminName || "Admin"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" onClick={() => setIsCreateModalOpen(false)}>
          <div className="w-full max-w-2xl rounded-[24px] border-2 border-[#FACC15]/40 bg-[#161616]" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#FACC15]/20 bg-[#1E1E1E] px-6 py-5 rounded-t-[22px]">
              <h3 className="text-[28px] font-black text-[#FACC15] tracking-tight">Add Post</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/60 hover:bg-white/15 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-5">
              <label className="flex flex-col gap-2">
                <span className="text-[12px] font-bold text-white/45 uppercase tracking-widest">Title</span>
                <input
                  value={createForm.title}
                  onChange={(event) => setCreateForm((previous) => ({ ...previous, title: event.target.value }))}
                  placeholder="Enter post title"
                  className="h-[48px] rounded-xl border-2 border-[#FACC15]/25 bg-[#111] px-4 text-white outline-none focus:border-[#FACC15] text-[15px] font-semibold placeholder:text-white/20"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[12px] font-bold text-white/45 uppercase tracking-widest">Description</span>
                <textarea
                  value={createForm.description}
                  onChange={(event) => setCreateForm((previous) => ({ ...previous, description: event.target.value }))}
                  placeholder="Enter post description"
                  rows={5}
                  className="rounded-xl border-2 border-[#FACC15]/25 bg-[#111] px-4 py-3 text-white outline-none focus:border-[#FACC15] text-[15px] font-semibold resize-y placeholder:text-white/20"
                />
              </label>

              <div className="flex flex-col gap-3">
                <span className="text-[12px] font-bold text-white/45 uppercase tracking-widest">Image (Optional)</span>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex h-[44px] cursor-pointer items-center justify-center rounded-[12px] border border-[#D4AF37]/40 bg-[#D4AF37]/12 px-5 text-sm font-bold text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all">
                    {isUploadingImage ? "Uploading..." : "Upload Image"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} disabled={isUploadingImage} />
                  </label>
                  {createForm.image && <span className="text-xs text-[#9FB3A6] break-all">{createForm.image}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#FACC15]/20 bg-[#1E1E1E] px-6 py-5 rounded-b-[22px]">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="h-[44px] rounded-full border-2 border-white/15 px-6 text-white/60 hover:border-white/40 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreatePost}
                disabled={isCreatingPost || isUploadingImage}
                className="inline-flex h-[44px] items-center gap-2 rounded-full bg-[#FACC15] px-7 text-black font-black hover:bg-yellow-300 transition-all disabled:opacity-50"
              >
                <Plus size={16} />
                {isCreatingPost ? "Adding..." : "Add Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          <div className="bg-[#1E1E1E] min-h-[170px] rounded-2xl max-w-sm w-full text-center border border-white/10 flex flex-col justify-center px-6 py-6">
            <h3 className="text-xl font-bold mb-4 text-white">Are you sure?</h3>
            <p className="text-gray-400 mb-7 font-normal">You want to delete this post?</p>
            <div className="flex items-center justify-center gap-4 mt-1">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="w-[100px] py-2.5 rounded-[8px] bg-white/5 hover:bg-white/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeletePost}
                disabled={isDeleting}
                className="w-[100px] py-2.5 rounded-[8px] bg-red-600 hover:bg-red-700 font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed text-white"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen image modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            className="absolute top-5 right-5 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
            onClick={() => setFullscreenImage(null)}
          >
            <X size={28} />
          </button>
          <div className="max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={fullscreenImage.src}
              alt={fullscreenImage.alt}
              width={1920}
              height={1080}
              unoptimized
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}