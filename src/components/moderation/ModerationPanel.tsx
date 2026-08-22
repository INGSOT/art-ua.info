"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { moderationAPI } from "../../lib/api/moderation";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../lib/apiError";

interface ModerationPanelProps {
  slug: string;
  initialStatus: string;
  initialStatusModeration: string;
}

type PendingAction = "start-review" | "approve" | "reject" | "message" | null;
type View = "collapsed" | "actions" | "message";

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2.5l7.5 3v5.2c0 4.8-3.2 9.1-7.5 10.3-4.3-1.2-7.5-5.5-7.5-10.3V5.5l7.5-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M8.7 12.1l2.2 2.2 4.4-4.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 4h16v12H8l-4 4V4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Очікує на розгляд",
  processing: "У розгляді",
};

export default function ModerationPanel({ slug, initialStatus, initialStatusModeration }: ModerationPanelProps) {
  const t = useTranslations("Moderation");
  const { showToast } = useToast();

  const [status, setStatus] = useState(initialStatus);
  const [statusModeration, setStatusModeration] = useState(initialStatusModeration);
  const [view, setView] = useState<View>("actions");
  const [collapsed, setCollapsed] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [isRejectFormOpen, setIsRejectFormOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (view === "message") panelRef.current?.querySelector("textarea")?.focus();
  }, [view]);

  if (status !== "moderation") return null;

  const handleStartReview = async () => {
    setPendingAction("start-review");
    try {
      const result = await moderationAPI.startReview(slug);
      if (result.status_moderation) setStatusModeration(result.status_moderation);
    } catch (error) {
      showToast(getApiErrorMessage(error, t("error")), "red", t("errorTitle"));
    } finally {
      setPendingAction(null);
    }
  };

  const handleApprove = async () => {
    setPendingAction("approve");
    try {
      const result = await moderationAPI.approve(slug);
      showToast(result.message, "green");
      if (result.status) setStatus(result.status);
    } catch (error) {
      showToast(getApiErrorMessage(error, t("error")), "red", t("errorTitle"));
    } finally {
      setPendingAction(null);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) return;
    setPendingAction("reject");
    try {
      const result = await moderationAPI.reject(slug, reason.trim());
      showToast(result.message, "green");
      setIsRejectFormOpen(false);
      setReason("");
      if (result.status) setStatus(result.status);
    } catch (error) {
      showToast(getApiErrorMessage(error, t("error")), "red", t("errorTitle"));
    } finally {
      setPendingAction(null);
    }
  };

  const handleSendMessage = async () => {
    if (!content.trim()) return;
    setPendingAction("message");
    try {
      const result = await moderationAPI.message(slug, content.trim(), subject.trim() || undefined);
      showToast(result.message, "green");
      setContent("");
      setSubject("");
      setMessageSent(true);
      setTimeout(() => setMessageSent(false), 4000);
    } catch (error) {
      showToast(getApiErrorMessage(error, t("error")), "red", t("errorTitle"));
    } finally {
      setPendingAction(null);
    }
  };

  const needsAttention = statusModeration === "pending";

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        aria-label={t("panelTitle")}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#FECC39] text-[#272727] shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-transform hover:scale-105"
      >
        <ShieldIcon />
        {needsAttention && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E14B4B] opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-[#E14B4B]" />
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      ref={panelRef}
      className="fixed bottom-6 right-6 z-50 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#FECC39]/25 bg-[#1c1c1c] font-wix shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-white/5 bg-[#232323] px-4 py-3.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FECC39]/15 text-[#FECC39]">
          <ShieldIcon />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-bold text-white">{t("panelTitle")}</p>
          <p className="truncate text-[11px] text-[#A0A0A0]">
            {STATUS_LABEL[statusModeration] ?? statusModeration}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#A0A0A0] transition-colors hover:bg-white/5 hover:text-white"
          aria-label={t("collapse")}
        >
          <ChevronIcon open={false} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-3 pt-3">
        <button
          type="button"
          onClick={() => setView("actions")}
          className={`flex-1 rounded-lg px-3 py-2 text-[12px] font-bold transition-colors ${
            view === "actions" ? "bg-white/10 text-white" : "text-[#A0A0A0] hover:text-white"
          }`}
        >
          {t("tabActions")}
        </button>
        <button
          type="button"
          onClick={() => setView("message")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-bold transition-colors ${
            view === "message" ? "bg-white/10 text-white" : "text-[#A0A0A0] hover:text-white"
          }`}
        >
          <MessageIcon />
          {t("tabMessage")}
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        {view === "actions" && (
          <div className="flex flex-col gap-2.5">
            {isRejectFormOpen ? (
              <>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={t("reasonPlaceholder")}
                  required
                  rows={3}
                  className="w-full resize-none rounded-lg bg-[#141414] px-3 py-2.5 text-[13px] text-white placeholder-[#6b6b6b] outline-none ring-1 ring-white/5 focus:ring-[#E14B4B]/50"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={!reason.trim() || pendingAction === "reject"}
                    className="flex-1 rounded-lg bg-[#E14B4B] py-2.5 text-[12px] font-bold text-white transition-colors hover:bg-[#c73f3f] disabled:opacity-40"
                  >
                    {pendingAction === "reject" ? t("rejecting") : t("confirmReject")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRejectFormOpen(false);
                      setReason("");
                    }}
                    className="rounded-lg px-4 py-2.5 text-[12px] font-bold text-[#A0A0A0] ring-1 ring-white/10 transition-colors hover:text-white"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </>
            ) : (
              <>
                {statusModeration === "pending" && (
                  <button
                    type="button"
                    onClick={handleStartReview}
                    disabled={pendingAction === "start-review"}
                    className="w-full rounded-lg bg-[#FECC39] py-2.5 text-[12px] font-bold text-[#272727] transition-colors hover:bg-white disabled:opacity-40"
                  >
                    {pendingAction === "start-review" ? t("startingReview") : t("startReview")}
                  </button>
                )}

                {statusModeration === "processing" && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleApprove}
                      disabled={pendingAction === "approve"}
                      className="flex-1 rounded-lg bg-[#4BAE4F] py-2.5 text-[12px] font-bold text-white transition-colors hover:bg-[#3f9843] disabled:opacity-40"
                    >
                      {pendingAction === "approve" ? t("approving") : t("approve")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRejectFormOpen(true)}
                      className="flex-1 rounded-lg bg-[#E14B4B] py-2.5 text-[12px] font-bold text-white transition-colors hover:bg-[#c73f3f]"
                    >
                      {t("reject")}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {view === "message" && (
          <div className="flex flex-col gap-2.5">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("subjectPlaceholder")}
              className="w-full rounded-lg bg-[#141414] px-3 py-2.5 text-[13px] text-white placeholder-[#6b6b6b] outline-none ring-1 ring-white/5 focus:ring-[#FECC39]/50"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("messagePlaceholder")}
              required
              rows={4}
              className="w-full resize-none rounded-lg bg-[#141414] px-3 py-2.5 text-[13px] text-white placeholder-[#6b6b6b] outline-none ring-1 ring-white/5 focus:ring-[#FECC39]/50"
            />
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={!content.trim() || pendingAction === "message"}
              className="w-full rounded-lg bg-[#FECC39] py-2.5 text-[12px] font-bold text-[#272727] transition-colors hover:bg-white disabled:opacity-40"
            >
              {pendingAction === "message" ? t("sending") : t("sendMessage")}
            </button>
            {messageSent && <p className="text-center text-[11px] text-[#4BAE4F]">{t("messageSent")}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
