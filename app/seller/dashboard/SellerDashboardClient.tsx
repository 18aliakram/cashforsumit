"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import {
  Home,
  DollarSign,
  MessageSquare,
  Bell,
  User,
  LogOut,
  CheckCircle2,
  XCircle,
  Send,
  Plus,
  Clock,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export function SellerDashboardClient({
  session,
  submissions,
}: {
  session: any;
  submissions: any[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "property" | "offer" | "messages">("overview");
  const [selectedSubId, setSelectedSubId] = useState<string>(submissions[0]?.id || "");
  const [messageInput, setMessageInput] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [offerActionLoading, setOfferActionLoading] = useState(false);

  const activeSubmission = submissions.find((s) => s.id === selectedSubId) || submissions[0];

  // Primary active offer
  const activeOffer = activeSubmission?.offers?.find((o: any) => o.status === "PENDING") || activeSubmission?.offers?.[0];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const handleOfferDecision = async (offerId: string, action: "ACCEPT" | "DECLINE") => {
    setOfferActionLoading(true);
    try {
      const res = await fetch("/api/seller/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId, action }),
      });
      if (!res.ok) throw new Error("Failed to process offer decision.");
      router.refresh();
    } catch (err) {
      alert("An error occurred updating the offer decision.");
    } finally {
      setOfferActionLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeSubmission) return;
    setSendingMsg(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: activeSubmission.id,
          content: messageInput,
        }),
      });
      if (res.ok) {
        setMessageInput("");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingMsg(false);
    }
  };

  const messages = activeSubmission?.conversations?.[0]?.messages || [];

  const timelineSteps = [
    { label: "Submitted", status: "NEW" },
    { label: "Under Review", status: "UNDER_REVIEW" },
    { label: "Offer Made", status: "OFFER_MADE" },
    { label: "Negotiating", status: "NEGOTIATING" },
    { label: "Accepted", status: "ACCEPTED" },
    { label: "Closing", status: "CLOSED" },
  ];

  const getStepIndex = (currentStatus: string) => {
    switch (currentStatus) {
      case "NEW": return 0;
      case "UNDER_REVIEW": return 1;
      case "CONTACTED": return 1;
      case "OFFER_MADE": return 2;
      case "NEGOTIATING": return 3;
      case "ACCEPTED": return 4;
      case "CLOSED": return 5;
      default: return 0;
    }
  };

  const currentStepIdx = activeSubmission ? getStepIndex(activeSubmission.status) : 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      
      {/* Dashboard Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-44">
              <Image src="/logo.png" alt="Logo" fill sizes="180px" className="object-contain" priority />
            </div>
            <span className="text-xs bg-brand-orange-light text-brand-orange font-bold px-2.5 py-1 rounded-md border border-brand-orange/20">
              Seller Portal
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <span className="block text-xs font-bold text-brand-dark">
                {session.firstName} {session.lastName}
              </span>
              <span className="block text-[11px] text-slate-500">{session.email}</span>
            </div>

            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-slate-600">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {submissions.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4 max-w-lg mx-auto my-12">
            <div className="w-14 h-14 bg-brand-orange/10 text-brand-orange rounded-full flex items-center justify-center mx-auto">
              <Home className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-brand-dark">No Properties Submitted Yet</h2>
            <p className="text-slate-600 text-sm">
              Ready to receive your direct cash offer? Submit your property details and photos to get started.
            </p>
            <Link href="/seller/submit-property" className="inline-block pt-2">
              <Button variant="primary" size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                <span>Submit Your Home</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sidebar Controls */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Property Selector */}
              {submissions.length > 1 && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Select Submission
                  </label>
                  <select
                    value={selectedSubId}
                    onChange={(e) => setSelectedSubId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-brand-dark"
                  >
                    {submissions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.propertyAddress} ({s.status})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Main Navigation Pills */}
              <nav className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm space-y-1">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    activeTab === "overview"
                      ? "bg-brand-orange text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Overview & Timeline</span>
                </button>

                <button
                  onClick={() => setActiveTab("offer")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    activeTab === "offer"
                      ? "bg-brand-orange text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4" />
                    <span>Cash Offer</span>
                  </div>
                  {activeOffer && (
                    <span className="text-[10px] bg-white/20 text-current px-2 py-0.5 rounded font-mono">
                      {formatCurrency(activeOffer.amount)}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("messages")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    activeTab === "messages"
                      ? "bg-brand-orange text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4" />
                    <span>Messages</span>
                  </div>
                  {messages.length > 0 && (
                    <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full font-bold">
                      {messages.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("property")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    activeTab === "property"
                      ? "bg-brand-orange text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>My Property Details</span>
                </button>
              </nav>

              <div className="pt-2">
                <Link href="/seller/submit-property" className="block">
                  <Button variant="outline" size="md" className="w-full gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Submit Another Home</span>
                  </Button>
                </Link>
              </div>

            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* Active Property Header Card */}
              {activeSubmission && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-brand-orange font-bold uppercase tracking-wider">
                        {activeSubmission.propertyType}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">
                        Submitted {formatDate(activeSubmission.createdAt)}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-brand-dark">
                      {activeSubmission.propertyAddress}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {activeSubmission.city}, {activeSubmission.state} {activeSubmission.zip}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge status={activeSubmission.status}>{activeSubmission.status}</Badge>
                  </div>
                </div>
              )}

              {/* TAB 1: OVERVIEW & TIMELINE */}
              {activeTab === "overview" && activeSubmission && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* Status Timeline */}
                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <h3 className="text-base font-bold text-brand-dark border-b border-slate-100 pb-3">
                      Submission Progress Timeline
                    </h3>

                    {/* Stepper Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                      {timelineSteps.map((step, idx) => {
                        const isDone = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;
                        return (
                          <div
                            key={step.label}
                            className={`p-3 rounded-xl border text-center transition-all ${
                              isCurrent
                                ? "bg-brand-orange text-white border-brand-orange ring-2 ring-brand-orange/30 font-bold shadow-md"
                                : isDone
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold"
                                : "bg-slate-50 text-slate-400 border-slate-200"
                            }`}
                          >
                            <span className="block text-[10px] uppercase font-bold tracking-wider opacity-80">
                              Step 0{idx + 1}
                            </span>
                            <span className="text-xs block mt-1">{step.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
                      <strong>Status Description: </strong>
                      {activeSubmission.status === "NEW" && "Your submission has been received. Our underwriting team is preparing market data for valuation."}
                      {activeSubmission.status === "UNDER_REVIEW" && "Our underwriting team is actively analyzing property specs and local comps."}
                      {activeSubmission.status === "OFFER_MADE" && "A formal cash offer has been issued! Click the 'Cash Offer' tab to review terms."}
                      {activeSubmission.status === "NEGOTIATING" && "Offer is under discussion. You can accept, decline, or message our team."}
                      {activeSubmission.status === "ACCEPTED" && "Offer accepted! Our closing team will reach out to coordinate closing date and title."}
                    </div>
                  </div>

                  {/* Active Offer Banner Card */}
                  {activeOffer && (
                    <div className="bg-gradient-to-r from-brand-dark to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                          Net Cash Offer Available
                        </span>
                        <h3 className="text-3xl font-extrabold text-white">
                          {formatCurrency(activeOffer.amount)}
                        </h3>
                        {activeOffer.message && (
                          <p className="text-xs text-slate-300 italic">&quot;{activeOffer.message}&quot;</p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          variant="primary"
                          onClick={() => setActiveTab("offer")}
                          className="px-6 gap-2"
                        >
                          <span>Review & Respond</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 2: CASH OFFER MANAGEMENT */}
              {activeTab === "offer" && activeSubmission && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {!activeOffer ? (
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
                      <Clock className="w-10 h-10 text-brand-orange mx-auto" />
                      <h3 className="text-lg font-bold text-brand-dark">Underwriting in Progress</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Your property is currently under review. We aim to issue a cash offer within 48 hours or less.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                        <div>
                          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                            Official Valuation Offer
                          </span>
                          <h3 className="text-3xl font-extrabold text-brand-dark mt-1">
                            {formatCurrency(activeOffer.amount)}
                          </h3>
                          <p className="text-xs text-slate-500">
                            Issued {formatDate(activeOffer.createdAt)} • Net Cash to Seller
                          </p>
                        </div>
                        <Badge status={activeOffer.status}>{activeOffer.status}</Badge>
                      </div>

                      {activeOffer.message && (
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700">
                          <strong className="block text-xs font-semibold text-slate-500 mb-1">Message from Summit Team:</strong>
                          <p>&quot;{activeOffer.message}&quot;</p>
                        </div>
                      )}

                      {/* Action buttons if Pending */}
                      {activeOffer.status === "PENDING" && (
                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                          <h4 className="text-sm font-bold text-brand-dark">How would you like to proceed?</h4>
                          <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                              variant="primary"
                              size="lg"
                              isLoading={offerActionLoading}
                              onClick={() => handleOfferDecision(activeOffer.id, "ACCEPT")}
                              className="bg-emerald-600 hover:bg-emerald-700 gap-2 flex-grow"
                            >
                              <CheckCircle2 className="w-5 h-5" />
                              <span>Accept Offer ({formatCurrency(activeOffer.amount)})</span>
                            </Button>

                            <Button
                              variant="outline"
                              size="lg"
                              isLoading={offerActionLoading}
                              onClick={() => handleOfferDecision(activeOffer.id, "DECLINE")}
                              className="gap-2 text-rose-700 border-rose-200 hover:bg-rose-50 flex-grow"
                            >
                              <XCircle className="w-5 h-5" />
                              <span>Decline Offer / Discuss</span>
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* If Accepted */}
                      {activeOffer.status === "ACCEPTED" && (
                        <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 space-y-2">
                          <h4 className="font-bold text-base flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span>Offer Accepted</span>
                          </h4>
                          <p className="text-xs leading-relaxed">
                            Thank you! Our transaction manager is preparing title & closing documentation. We will contact you at your preferred contact method shortly.
                          </p>
                        </div>
                      )}

                      {/* If Declined */}
                      {activeOffer.status === "DECLINED" && (
                        <div className="p-6 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-3">
                          <h4 className="font-bold text-base flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                            <span>Offer Declined — Conversation Open</span>
                          </h4>
                          <p className="text-xs leading-relaxed">
                            You have declined this offer amount. Don&apos;t worry — your submission remains active and our underwriting team is happy to discuss options and re-evaluate local market data.
                          </p>
                          <Button variant="primary" size="md" onClick={() => setActiveTab("messages")} className="gap-2">
                            <MessageSquare className="w-4 h-4" />
                            <span>Continue Conversation With Team</span>
                          </Button>
                        </div>
                      )}

                      {/* Offer History Log */}
                      {activeSubmission.offers.length > 1 && (
                        <div className="pt-6 border-t border-slate-100 space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Offer History</h4>
                          <div className="space-y-2">
                            {activeSubmission.offers.map((off: any) => (
                              <div key={off.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-xs">
                                <div>
                                  <span className="font-bold text-brand-dark">{formatCurrency(off.amount)}</span>
                                  <span className="text-slate-400 ml-2">• {formatDate(off.createdAt)}</span>
                                </div>
                                <Badge status={off.status}>{off.status}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: DIRECT MESSAGES */}
              {activeTab === "messages" && activeSubmission && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[550px] animate-in fade-in duration-200 overflow-hidden">
                  
                  {/* Messages Header */}
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-brand-dark">Conversation with Summit Underwriting</h3>
                      <p className="text-[11px] text-slate-500">Direct thread regarding {activeSubmission.propertyAddress}</p>
                    </div>
                  </div>

                  {/* Messages Scroll Area */}
                  <div className="flex-grow p-4 overflow-y-auto space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-16 text-slate-400 text-xs">
                        No messages yet. Send a message below to start chatting with our team.
                      </div>
                    ) : (
                      messages.map((msg: any) => {
                        const isMe = msg.senderId === session.userId;
                        return (
                          <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 shadow-sm ${
                                isMe
                                  ? "bg-brand-orange text-white rounded-br-none"
                                  : "bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-4 text-[10px] opacity-80">
                                <span>{isMe ? "You" : `${msg.sender.firstName} (Summit Team)`}</span>
                                <span>{formatDateTime(msg.createdAt)}</span>
                              </div>
                              <p className="leading-relaxed whitespace-pre-line text-sm">{msg.content}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Chat Input Bar */}
                  <form onSubmit={handleSendMessage} className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2">
                    <input
                      type="text"
                      placeholder="Write a message to our team..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="flex-grow px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                    <Button type="submit" variant="primary" size="md" isLoading={sendingMsg} className="gap-1.5 px-5">
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </Button>
                  </form>

                </div>
              )}

              {/* TAB 4: MY PROPERTY DETAILS */}
              {activeTab === "property" && activeSubmission && (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
                  <h3 className="text-lg font-bold text-brand-dark border-b border-slate-100 pb-3">
                    Submitted Property Details
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-400 block font-semibold">Type</span>
                      <span className="font-bold text-brand-dark">{activeSubmission.propertyType}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-400 block font-semibold">Bedrooms / Baths</span>
                      <span className="font-bold text-brand-dark">{activeSubmission.bedrooms} Beds / {activeSubmission.bathrooms} Baths</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-400 block font-semibold">Square Footage</span>
                      <span className="font-bold text-brand-dark">{activeSubmission.squareFeet ? `${activeSubmission.squareFeet} sqft` : "N/A"}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-400 block font-semibold">Condition</span>
                      <span className="font-bold text-brand-orange">{activeSubmission.condition}</span>
                    </div>
                  </div>

                  {activeSubmission.description && (
                    <div className="p-4 bg-slate-50 rounded-xl text-xs space-y-1">
                      <span className="font-semibold text-slate-500">Seller Notes:</span>
                      <p className="text-slate-700">{activeSubmission.description}</p>
                    </div>
                  )}

                  {/* Uploaded Photos Preview */}
                  {activeSubmission.photos && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted Photos</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {JSON.parse(activeSubmission.photos || "[]").map((url: string, idx: number) => (
                          <div key={idx} className="relative h-28 rounded-lg overflow-hidden border border-slate-200">
                            <Image src={url} alt="Photo" fill sizes="150px" className="object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        )}
      </div>

    </div>
  );
}
