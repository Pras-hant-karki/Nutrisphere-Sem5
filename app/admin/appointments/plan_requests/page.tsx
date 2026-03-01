"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle2,
  ClipboardList,
  Info,
  Link2,
  Mail,
  PenLine,
  Scale,
  Target,
  UserRound,
  XCircle,
} from "lucide-react";
import { getToken } from "@/lib/auth-helpers";
import { API_BASE_URL, buildApiUrl } from "@/lib/api/base-url";

type PlanRequest = {
  _id: string;
  userId?:
    | {
        _id?: string;
        fullName?: string;
        email?: string;
        phone?: string;
      }
    | string;
  requestType: "diet" | "workout";
  height: string;
  weight: string;
  job?: string;
  foodAllergy?: string;
  dietType: "veg" | "non-veg";
  medicalCondition?: string;
  trainingType?: string;
  goal: string;
  specialRequest?: string;
  status: "pending" | "approved" | "rejected";
  adminResponse?: {
    type: "file" | "link";
    url: string;
    respondedAt?: string;
  };
  rejectionReason?: string;
  createdAt: string;
};

export default function AdminPlanRequestsPage() {
  const [requests, setRequests] = useState<PlanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);
  const [approveTarget, setApproveTarget] = useState<PlanRequest | null>(null);
  const [rejectTarget, setRejectTarget] = useState<PlanRequest | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editStatus, setEditStatus] = useState<"approved" | "rejected">("approved");
  const [approvalLink, setApprovalLink] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      const response = await axios.get(buildApiUrl("/api/plan-requests/admin"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data?.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load plan requests");
    } finally {
      setLoading(false);
    }
  };

  const approveWithLink = async (id: string, link: string) => {
    try {
      setActingId(id);
      setError(null);
      const token = getToken();
      await axios.put(
        buildApiUrl(`/api/plan-requests/admin/${id}/approve`),
        { link },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchRequests();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to approve request with link");
    } finally {
      setActingId(null);
    }
  };

  const rejectRequest = async (id: string, reason: string) => {
    try {
      setActingId(id);
      setError(null);
      const token = getToken();
      await axios.put(
        buildApiUrl(`/api/plan-requests/admin/${id}/reject`),
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchRequests();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to reject request");
    } finally {
      setActingId(null);
    }
  };

  const openApproveModal = (request: PlanRequest) => {
    setApproveTarget(request);
    setIsEditMode(false);
    setEditStatus("approved");
    setApprovalLink("");
  };

  const openEditLinkModal = (request: PlanRequest) => {
    setApproveTarget(request);
    setIsEditMode(true);
    setEditStatus(request.status === "rejected" ? "rejected" : "approved");
    setApprovalLink(request.adminResponse?.type === "link" ? request.adminResponse.url : "");
    setRejectionReason(request.rejectionReason || "");
  };

  const openRejectModal = (request: PlanRequest) => {
    setRejectTarget(request);
    setRejectionReason("");
  };

  const submitApprove = async () => {
    if (!approveTarget) return;

    if (isEditMode) {
      if (editStatus === "approved") {
        const trimmedLink = approvalLink.trim();
        if (!trimmedLink) {
          setError("Plan link is required.");
          return;
        }
        setError(null);
        await approveWithLink(approveTarget._id, trimmedLink);
      } else {
        const reason = rejectionReason.trim();
        if (!reason) {
          setError("Rejection reason is required.");
          return;
        }
        setError(null);
        await rejectRequest(approveTarget._id, reason);
      }
    } else {
      const trimmedLink = approvalLink.trim();
      if (!trimmedLink) {
        setError("Plan link is required.");
        return;
      }
      setError(null);
      await approveWithLink(approveTarget._id, trimmedLink);
    }

    setApproveTarget(null);
    setIsEditMode(false);
    setEditStatus("approved");
    setApprovalLink("");
    setRejectionReason("");
  };

  const submitReject = async () => {
    if (!rejectTarget) return;

    const reason = rejectionReason.trim();
    if (!reason) {
      setError("Rejection reason is required.");
      return;
    }

    setError(null);
    await rejectRequest(rejectTarget._id, reason);
    setRejectTarget(null);
    setRejectionReason("");
  };

  const getStatusClasses = (status: PlanRequest["status"]) => {
    switch (status) {
      case "pending":
        return "border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]";
      case "approved":
        return "border-[#2ECC71]/40 bg-[#2ECC71]/10 text-[#2ECC71]";
      case "rejected":
        return "border-[#E53935]/40 bg-[#E53935]/10 text-[#E53935]";
      default:
        return "border-[#7C8C83]/40 bg-[#7C8C83]/10 text-[#9FB3A6]";
    }
  };

  const getUserName = (userId: PlanRequest["userId"]) => {
    if (!userId) return "Unknown User";
    if (typeof userId === "string") return "User";
    return userId.fullName || "Unknown User";
  };

  const getUserEmail = (userId: PlanRequest["userId"]) => {
    if (!userId || typeof userId === "string") return "No email";
    return userId.email || "No email";
  };

  const resolveResponseUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/")) return `${API_BASE_URL}${url}`;
    return buildApiUrl(url);
  };

  return (
    <div className="relative z-10 !ml-[40px] pl-10 pr-12 pt-10 pb-12 bg-[#0A0705] min-h-screen">
      <div className="mx-auto w-full max-w-5xl">
        <div className="min-h-[118px] flex flex-col md:flex-row md:items-end md:justify-between border-b border-[#26322B] pb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-[#D4AF37] tracking-tight">Plan Requests</h1>
            <p className="text-[#9FB3A6] mt-2 text-sm">Review and manage customized fitness journey applications.</p>
          </div>
          <div className="mt-4 md:mt-0 text-xs text-[#9FB3A6] font-medium uppercase tracking-widest">
            Total Requests: <span className="text-[#D4AF37]">{requests.length}</span>
          </div>
        </div>

        <div className="h-10" />

        {error && (
          <div className="mb-6 rounded-xl border border-[#E53935]/30 bg-[#E53935]/5 p-4 text-[#ff8c8c] flex items-center gap-3 text-sm">
            <Info size={18} />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
            <p className="text-[#9FB3A6] text-sm animate-pulse">Fetching requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#26322B] bg-[#111612] p-16 text-center">
            <div className="bg-[#171C18] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#26322B]">
              <ClipboardList className="text-[#26322B]" size={32} />
            </div>
            <p className="text-[#9FB3A6] font-medium">No pending plan requests at the moment.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 pb-12">
            {requests.map((item) => (
              <div
                key={item._id}
                className="group rounded-2xl border border-[#26322B] bg-[#111612] overflow-hidden hover:border-[#D4AF37]/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-white tracking-tight truncate inline-flex items-center gap-2">
                          <UserRound size={16} className="text-[#D4AF37]" />
                          {getUserName(item.userId)}
                        </h3>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${getStatusClasses(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-5">
                        <div className="flex items-center gap-1.5 text-xs text-[#9FB3A6]">
                          <Mail size={12} className="text-[#D4AF37]" />
                          {getUserEmail(item.userId)}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#9FB3A6] mt-1.5 mb-4">
                        <span className="inline-flex items-center gap-1 rounded-[8px] px-2.5 py-1 border border-[#2F3A34] bg-[#111612] uppercase tracking-wide">
                          <ClipboardList size={13} className="text-[#D4AF37]" />
                          {item.requestType} plan
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-[8px] px-2.5 py-1 border border-[#2F3A34] bg-[#111612] uppercase tracking-wide">
                          <Scale size={13} className="text-[#D4AF37]" />
                          {item.height} / {item.weight}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-[8px] px-2.5 py-1 border border-[#2F3A34] bg-[#111612] uppercase tracking-wide">
                          <Target size={13} className="text-[#D4AF37]" />
                          {item.dietType}
                        </span>
                      </div>

                      <div className="space-y-3 bg-[#0A0705]/50 p-4 rounded-xl border border-[#26322B]/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase font-bold text-[#D4AF37] opacity-80">Primary Goal</p>
                            <p className="text-sm text-[#D3DDD7] leading-relaxed">{item.goal}</p>
                          </div>
                          {item.foodAllergy && (
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase font-bold text-[#E57373]">Food Allergy</p>
                              <p className="text-sm text-[#D3DDD7] leading-relaxed">{item.foodAllergy}</p>
                            </div>
                          )}
                        </div>

                        {(item.medicalCondition || item.specialRequest || item.trainingType) && (
                          <div className="pt-3 border-t border-[#26322B]/50 space-y-3">
                            {item.trainingType && (
                              <p className="text-sm text-[#C8D2CC] leading-snug">
                                <span className="text-[#D4AF37] font-semibold text-xs mr-2">TRAINING:</span>
                                {item.trainingType}
                              </p>
                            )}
                            {item.medicalCondition && (
                              <p className="text-sm text-[#9FB3A6]">
                                <span className="text-[#D4AF37] font-semibold text-xs mr-2">MEDICAL:</span>
                                {item.medicalCondition}
                              </p>
                            )}
                            {item.specialRequest && (
                              <p className="text-sm text-[#9FB3A6] italic">
                                <span className="text-[#D4AF37] font-semibold text-xs not-italic mr-2">REQUEST:</span>
                                "{item.specialRequest}"
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {item.status === "approved" && item.adminResponse?.url && (
                        <a
                          href={resolveResponseUrl(item.adminResponse.url)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 mt-2 text-sm text-[#4FC3F7] hover:text-[#7ad8ff] underline"
                        >
                          <Link2 size={14} />
                          Open shared plan
                        </a>
                      )}

                      {item.status === "rejected" && item.rejectionReason && (
                        <p className="text-sm text-[#ff8c8c] mt-2">Reason: {item.rejectionReason}</p>
                      )}
                    </div>

                    <div className="flex flex-row lg:flex-col gap-2.5 shrink-0 pt-2 lg:pl-4">
                      {item.status === "pending" ? (
                        <>
                          <button
                            onClick={() => openApproveModal(item)}
                            disabled={actingId === item._id}
                            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 rounded-[8px] bg-[#2ECC71] px-3 py-1.5 text-sm font-bold text-[#0F1310] hover:bg-[#26c969] transition-all disabled:opacity-50"
                          >
                            <CheckCircle2 size={15} />
                            Approve
                          </button>
                          <button
                            onClick={() => openRejectModal(item)}
                            disabled={actingId === item._id}
                            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 rounded-[8px] bg-[#E53935] px-3 py-1.5 text-sm font-bold text-white hover:bg-[#d12d2d] transition-all disabled:opacity-50"
                          >
                            <XCircle size={15} />
                            Reject
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-end gap-2 pr-1.5 lg:pr-2">
                          <p className="text-[10px] text-[#9FB3A6] font-medium uppercase tracking-tighter italic">
                            Processed on {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                          {(item.status === "approved" || item.status === "rejected") && (
                            <button
                              onClick={() => openEditLinkModal(item)}
                              disabled={actingId === item._id}
                              className="inline-flex items-center justify-center rounded-xl border border-[#2ECC71]/40 bg-[#2ECC71]/18 p-2.5 text-[#7FF2AF] hover:bg-[#2ECC71]/28 hover:border-[#2ECC71]/70 transition-all disabled:opacity-50"
                              aria-label="Edit request"
                              title="Edit request"
                            >
                              <PenLine size={15} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {approveTarget && (
          <div className="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center p-4">
            <div className="bg-[#1B1B1B] p-7 rounded-3xl max-w-2xl w-full border border-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
              <div className="mb-6 text-center">
                <h3 className="text-[38px] leading-none font-bold tracking-tight mb-2">
                  {isEditMode ? "Edit Plan Link" : "Approve Request"}
                </h3>
                <p className="text-[#A8B0B8] text-[17px] leading-snug">
                  {isEditMode
                    ? "Update link or change request status."
                    : "Send the plan link to approve this request."}
                </p>
              </div>

              <div className="space-y-5">
                {isEditMode && (
                  <div>
                    <label className="block text-xs uppercase tracking-[0.16em] text-[#9FB3A6] mb-2">Status</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setEditStatus("approved")}
                        className={`rounded-xl px-3 py-2.5 text-sm font-bold transition-all border ${
                          editStatus === "approved"
                            ? "bg-[#2ECC71] text-[#0F1310] border-[#2ECC71]"
                            : "bg-white/5 text-[#9FB3A6] border-white/10 hover:bg-white/10"
                        }`}
                      >
                        Approved
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditStatus("rejected")}
                        className={`rounded-xl px-3 py-2.5 text-sm font-bold transition-all border ${
                          editStatus === "rejected"
                            ? "bg-[#E53935] text-white border-[#E53935]"
                            : "bg-white/5 text-[#9FB3A6] border-white/10 hover:bg-white/10"
                        }`}
                      >
                        Rejected
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  {(!isEditMode || editStatus === "approved") && (
                    <>
                      <label className="block text-xs uppercase tracking-[0.16em] text-[#9FB3A6] mb-2">Plan Link</label>
                      <input
                        type="url"
                        value={approvalLink}
                        onChange={(e) => setApprovalLink(e.target.value)}
                        placeholder="https://..."
                        autoComplete="off"
                        spellCheck={false}
                        className="w-full h-12 rounded-xl bg-[#111] border border-white/12 px-4 text-base outline-none focus:border-[#2ECC71]/70"
                      />
                    </>
                  )}

                  {isEditMode && editStatus === "rejected" && (
                    <>
                      <label className="block text-xs uppercase tracking-[0.16em] text-[#9FB3A6] mb-2">Rejection Reason</label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={4}
                        placeholder="Write rejection message..."
                        className="w-full rounded-xl bg-[#111] border border-white/12 px-4 py-3 text-sm outline-none focus:border-[#E53935]/70 resize-none"
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => {
                    setApproveTarget(null);
                    setIsEditMode(false);
                    setEditStatus("approved");
                    setApprovalLink("");
                    setRejectionReason("");
                  }}
                  disabled={actingId === approveTarget._id}
                  className="w-[140px] h-11 rounded-xl bg-white/8 hover:bg-white/12 text-lg transition-all disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  onClick={submitApprove}
                  disabled={actingId === approveTarget._id}
                  className="w-[140px] h-11 rounded-xl bg-[#2ECC71] hover:bg-[#26c969] text-[#0F1310] text-lg font-bold transition-all disabled:opacity-60"
                >
                  {actingId === approveTarget._id ? (isEditMode ? "Saving..." : "Sending...") : isEditMode ? "Update" : "Send"}
                </button>
              </div>
            </div>
          </div>
        )}

        {rejectTarget && (
          <div className="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center p-4">
            <div className="bg-[#1E1E1E] p-6 min-h-[230px] rounded-2xl max-w-lg w-full border border-white/10 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-2 text-center">Reject Request</h3>
              <p className="text-gray-400 mb-5 text-center text-sm">Please add a rejection reason.</p>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                placeholder="Write rejection message..."
                className="w-full rounded-[8px] bg-white/5 border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-[#E53935]/70 resize-none"
              />

              <div className="flex items-center justify-center gap-4 mt-7">
                <button
                  onClick={() => {
                    setRejectTarget(null);
                    setRejectionReason("");
                  }}
                  disabled={actingId === rejectTarget._id}
                  className="w-[110px] py-2.5 rounded-[8px] bg-white/5 hover:bg-white/10 transition-all disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReject}
                  disabled={actingId === rejectTarget._id}
                  className="w-[110px] py-2.5 rounded-[8px] bg-red-600 hover:bg-red-700 text-white font-bold transition-all disabled:opacity-60"
                >
                  {actingId === rejectTarget._id ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
