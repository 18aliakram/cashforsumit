"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  FileText,
  DollarSign,
  MessageSquare,
  Users,
  Plus,
  LogOut,
  Send,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  X,
  Mail,
  Phone,
  Tag,
  Upload,
  AlertCircle,
  Filter,
  Check,
  Sparkles,
} from "lucide-react";

const PRESET_FEATURES = [
  "Gourmet Kitchen",
  "Quartz Countertops",
  "Dual Primary Suites",
  "Covered Patio",
  "Two-Car Garage",
  "Smart Thermostat",
  "Walk-In Closet(s)",
  "Central Air",
  "Gas Fireplace",
  "EV Charger Ready",
  "Fenced Yard",
  "Hardwood Floors",
  "Open Floorplan",
  "High Ceilings",
  "Kitchen Island",
  "Stainless Steel Appliances",
];

export function AdminDashboardClient({
  session,
  initialProperties,
  initialSubmissions,
  initialInquiries,
}: {
  session: any;
  initialProperties: any[];
  initialSubmissions: any[];
  initialInquiries: any[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "properties" | "submissions" | "inquiries" | "messages">("overview");
  const [selectedSubId, setSelectedSubId] = useState<string>(initialSubmissions[0]?.id || "");

  // Offer Modal State
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerSubmissionId, setOfferSubmissionId] = useState("");
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [offerLoading, setOfferLoading] = useState(false);

  // Property Modal State (Create / Edit)
  const [isPropModalOpen, setIsPropModalOpen] = useState(false);
  const [editingPropId, setEditingPropId] = useState<string | null>(null);
  const [customFeatureInput, setCustomFeatureInput] = useState("");
  
  const [propForm, setPropForm] = useState({
    title: "",
    price: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    bedrooms: "3",
    bathrooms: "2.0",
    squareFeet: "1850",
    lotSize: "0.25 Acres",
    propertyType: "Single Family",
    yearBuilt: "2018",
    description: "",
    status: "AVAILABLE",
    featured: false,
    features: [] as string[],
    images: [] as string[],
    // Zillow Detailed Specs
    heating: "Forced Air",
    cooling: "Central Air",
    appliances: "Stainless Steel Suite Included",
    garageType: "2-Car Attached Garage",
    stories: "2 Stories",
    materials: "Brick, Siding",
    roof: "Architectural Shingle",
    utilities: "City Water, Public Sewer, Natural Gas",
  });
  const [propLoading, setPropLoading] = useState(false);

  // Inquiry Detail Modal State
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);

  // Messaging & Chat State
  const [chatSearch, setChatSearch] = useState("");
  const [chatFilterLabel, setChatFilterLabel] = useState<string>("ALL");
  const [activeChatSubmissionId, setActiveChatSubmissionId] = useState<string>(initialSubmissions[0]?.id || "");
  const [msgInput, setMsgInput] = useState("");
  const [msgLoading, setMsgLoading] = useState(false);

  const activeSubmission = initialSubmissions.find((s) => s.id === selectedSubId) || initialSubmissions[0];
  const activeChatSubmission = initialSubmissions.find((s) => s.id === activeChatSubmissionId) || initialSubmissions[0];
  const activeConversation = activeChatSubmission?.conversations?.[0];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setOfferLoading(true);
    try {
      const res = await fetch("/api/admin/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: offerSubmissionId,
          amount: offerAmount,
          message: offerMessage,
          internalNotes,
        }),
      });
      if (res.ok) {
        setIsOfferModalOpen(false);
        setOfferAmount("");
        setOfferMessage("");
        setInternalNotes("");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOfferLoading(false);
    }
  };

  // Toggle Preset Feature
  const toggleFeature = (feat: string) => {
    if (propForm.features.includes(feat)) {
      setPropForm({ ...propForm, features: propForm.features.filter((f) => f !== feat) });
    } else {
      setPropForm({ ...propForm, features: [...propForm.features, feat] });
    }
  };

  // Add Custom Feature
  const handleAddCustomFeature = () => {
    if (customFeatureInput.trim() && !propForm.features.includes(customFeatureInput.trim())) {
      setPropForm({ ...propForm, features: [...propForm.features, customFeatureInput.trim()] });
      setCustomFeatureInput("");
    }
  };

  // Open Edit Property Modal
  const handleOpenEditProperty = (prop: any) => {
    setEditingPropId(prop.id);

    let parsedFeatures: string[] = [];
    try {
      parsedFeatures = JSON.parse(prop.features || "[]");
    } catch (e) {
      parsedFeatures = [];
    }

    let parsedSpecs: any = {};
    try {
      parsedSpecs = JSON.parse(prop.detailedSpecs || "{}");
    } catch (e) {
      parsedSpecs = {};
    }

    setPropForm({
      title: prop.title,
      price: prop.price.toString(),
      address: prop.address,
      city: prop.city,
      state: prop.state,
      zip: prop.zip,
      bedrooms: prop.bedrooms.toString(),
      bathrooms: prop.bathrooms.toString(),
      squareFeet: prop.squareFeet.toString(),
      lotSize: prop.lotSize || "0.25 Acres",
      propertyType: prop.propertyType,
      yearBuilt: prop.yearBuilt ? prop.yearBuilt.toString() : "2018",
      description: prop.description || "",
      status: prop.status,
      featured: prop.featured || false,
      features: parsedFeatures,
      images: prop.images ? prop.images.map((i: any) => i.url) : [],
      heating: parsedSpecs.interior?.heating || "Forced Air",
      cooling: parsedSpecs.interior?.cooling || "Central Air",
      appliances: parsedSpecs.interior?.appliances || "Stainless Steel Suite Included",
      garageType: parsedSpecs.parking?.garageType || "2-Car Attached Garage",
      stories: parsedSpecs.construction?.stories || "2 Stories",
      materials: parsedSpecs.construction?.materials || "Brick, Siding",
      roof: parsedSpecs.construction?.roof || "Architectural Shingle",
      utilities: parsedSpecs.utilities?.water || "City Water, Public Sewer",
    });
    setIsPropModalOpen(true);
  };

  // Open Add Property Modal
  const handleOpenAddProperty = () => {
    setEditingPropId(null);
    setPropForm({
      title: "",
      price: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      bedrooms: "3",
      bathrooms: "2.0",
      squareFeet: "1850",
      lotSize: "0.25 Acres",
      propertyType: "Single Family",
      yearBuilt: "2020",
      description: "",
      status: "AVAILABLE",
      featured: false,
      features: ["Gourmet Kitchen", "Quartz Countertops", "Smart Thermostat"],
      images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"],
      heating: "Forced Air",
      cooling: "Central Air",
      appliances: "Stainless Steel Suite Included",
      garageType: "2-Car Attached Garage",
      stories: "2 Stories",
      materials: "Brick, Siding",
      roof: "Architectural Shingle",
      utilities: "City Water, Public Sewer, Natural Gas",
    });
    setIsPropModalOpen(true);
  };

  // Save / Update Property
  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setPropLoading(true);

    const detailedSpecsObj = {
      interior: {
        heating: propForm.heating,
        cooling: propForm.cooling,
        appliances: propForm.appliances,
      },
      parking: {
        garageType: propForm.garageType,
      },
      construction: {
        stories: propForm.stories,
        materials: propForm.materials,
        roof: propForm.roof,
      },
      utilities: {
        water: propForm.utilities,
      },
    };

    try {
      const method = editingPropId ? "PATCH" : "POST";
      const payload = {
        ...(editingPropId ? { id: editingPropId } : {}),
        title: propForm.title,
        price: propForm.price,
        address: propForm.address,
        city: propForm.city,
        state: propForm.state,
        zip: propForm.zip,
        bedrooms: propForm.bedrooms,
        bathrooms: propForm.bathrooms,
        squareFeet: propForm.squareFeet,
        lotSize: propForm.lotSize,
        propertyType: propForm.propertyType,
        yearBuilt: propForm.yearBuilt,
        description: propForm.description,
        status: propForm.status,
        featured: propForm.featured,
        features: propForm.features,
        images: propForm.images,
        detailedSpecs: JSON.stringify(detailedSpecsObj),
      };

      const res = await fetch("/api/admin/properties", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsPropModalOpen(false);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPropLoading(false);
    }
  };

  // Delete Property
  const handleDeleteProperty = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/properties?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Image Upload helper
  const handlePropImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setPropForm((prev) => ({
            ...prev,
            images: [...prev.images, ev.target!.result as string],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Send Admin Chat Message
  const handleSendAdminMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim() || !activeChatSubmission) return;
    setMsgLoading(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: activeChatSubmission.id,
          content: msgInput,
        }),
      });

      if (res.ok) {
        setMsgInput("");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMsgLoading(false);
    }
  };

  // Update Conversation Label
  const handleUpdateChatLabel = async (convId: string, label: string) => {
    try {
      await fetch("/api/admin/conversations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: convId, label }),
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered Chats
  const filteredSubmissions = initialSubmissions.filter((sub) => {
    const sellerName = `${sub.seller.firstName} ${sub.seller.lastName}`.toLowerCase();
    const phone = sub.seller.phone.toLowerCase();
    const address = sub.propertyAddress.toLowerCase();
    const matchesSearch =
      sellerName.includes(chatSearch.toLowerCase()) ||
      phone.includes(chatSearch.toLowerCase()) ||
      address.includes(chatSearch.toLowerCase());

    const convLabel = sub.conversations?.[0]?.label || "NEW";
    const matchesLabel = chatFilterLabel === "ALL" || convLabel === chatFilterLabel;

    return matchesSearch && matchesLabel;
  });

  const activePropertiesCount = initialProperties.filter((p) => p.status === "AVAILABLE").length;
  const pendingOffersCount = initialSubmissions.filter((s) => s.offers?.some((o: any) => o.status === "PENDING")).length;

  return (
    <div className="min-h-screen bg-[#111315] text-white flex flex-col font-sans">
      
      {/* Admin Header */}
      <header className="bg-[#1E2022] border-b border-slate-800 sticky top-0 z-30 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <div className="relative h-9 w-40">
              <Image src="/logo.png" alt="Logo" fill sizes="160px" className="object-contain" priority />
            </div>
          </Link>
          <span className="text-[11px] bg-brand-orange text-white font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
            Admin Suite
          </span>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <div className="text-right">
            <span className="block font-bold text-white">{session.firstName} {session.lastName}</span>
            <span className="block text-slate-400">System Administrator</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-300 hover:text-white gap-1.5">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Admin Area */}
      <div className="flex-grow flex">
        
        {/* Sidebar */}
        <aside className="w-64 bg-[#181A1C] border-r border-slate-800 p-4 space-y-2 hidden md:block flex-shrink-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "overview" ? "bg-brand-orange text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Metrics</span>
          </button>

          <button
            onClick={() => setActiveTab("submissions")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "submissions" ? "bg-brand-orange text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4" />
              <span>Seller Submissions</span>
            </div>
            <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded-full text-[10px]">
              {initialSubmissions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("properties")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "properties" ? "bg-brand-orange text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4" />
              <span>Properties Catalog</span>
            </div>
            <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded-full text-[10px]">
              {initialProperties.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("inquiries")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "inquiries" ? "bg-brand-orange text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4" />
              <span>Buyer Inquiries</span>
            </div>
            <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded-full text-[10px]">
              {initialInquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("messages")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "messages" ? "bg-brand-orange text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Seller Messaging</span>
          </button>
        </aside>

        {/* Workspace */}
        <main className="flex-grow p-6 space-y-6 overflow-y-auto w-full">
          
          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#1E2022] p-5 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Active Available Listings</span>
                  <p className="text-3xl font-extrabold text-white">{activePropertiesCount}</p>
                </div>
                <div className="bg-[#1E2022] p-5 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Seller Submissions</span>
                  <p className="text-3xl font-extrabold text-brand-orange">{initialSubmissions.length}</p>
                </div>
                <div className="bg-[#1E2022] p-5 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Pending Offers</span>
                  <p className="text-3xl font-extrabold text-amber-400">{pendingOffersCount}</p>
                </div>
                <div className="bg-[#1E2022] p-5 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Buyer Inquiries</span>
                  <p className="text-3xl font-extrabold text-emerald-400">{initialInquiries.length}</p>
                </div>
              </div>

              {/* Submissions Pipeline */}
              <div className="bg-[#1E2022] p-6 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white">Recent Seller Pipeline Submissions</h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("submissions")} className="text-brand-orange text-xs">
                    View Pipeline
                  </Button>
                </div>
                <div className="space-y-3">
                  {initialSubmissions.slice(0, 4).map((sub) => (
                    <div key={sub.id} className="p-4 bg-[#111315] rounded-lg border border-slate-800 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">{sub.propertyAddress}</h4>
                        <p className="text-xs text-slate-400">
                          Seller: {sub.seller.firstName} {sub.seller.lastName} ({sub.seller.phone})
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge status={sub.status}>{sub.status}</Badge>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setOfferSubmissionId(sub.id);
                            setIsOfferModalOpen(true);
                          }}
                        >
                          Make Offer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SELLER SUBMISSIONS PIPELINE */}
          {activeTab === "submissions" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white">Seller Property Submissions</h2>
                <p className="text-xs text-slate-400">Review property specs, condition, uploaded photos, and make cash offers.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-3">
                  {initialSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSubId(sub.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedSubId === sub.id
                          ? "bg-brand-orange/10 border-brand-orange"
                          : "bg-[#1E2022] border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">{sub.propertyType}</span>
                        <Badge status={sub.status}>{sub.status}</Badge>
                      </div>
                      <h4 className="text-sm font-bold text-white">{sub.propertyAddress}</h4>
                      <p className="text-xs text-slate-400">{sub.seller.firstName} {sub.seller.lastName} • {sub.seller.phone}</p>
                    </div>
                  ))}
                </div>

                {activeSubmission && (
                  <div className="lg:col-span-7 bg-[#1E2022] p-6 rounded-xl border border-slate-800 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div>
                        <span className="text-xs text-brand-orange font-bold uppercase">{activeSubmission.propertyType}</span>
                        <h3 className="text-xl font-bold text-white">{activeSubmission.propertyAddress}</h3>
                        <p className="text-xs text-slate-400">{activeSubmission.city}, {activeSubmission.state} {activeSubmission.zip}</p>
                      </div>
                      <Button
                        variant="primary"
                        onClick={() => {
                          setOfferSubmissionId(activeSubmission.id);
                          setIsOfferModalOpen(true);
                        }}
                        className="gap-2"
                      >
                        <DollarSign className="w-4 h-4" />
                        <span>Send Offer</span>
                      </Button>
                    </div>

                    <div className="bg-[#111315] p-4 rounded-lg border border-slate-800 text-xs space-y-1">
                      <span className="text-slate-400 font-semibold block">Seller Information:</span>
                      <p className="font-bold text-white">{activeSubmission.seller.firstName} {activeSubmission.seller.lastName}</p>
                      <p className="text-slate-300">Email: {activeSubmission.seller.email} | Phone: {activeSubmission.seller.phone}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-[#111315] rounded border border-slate-800">
                        <span className="text-slate-400 block">Beds / Baths</span>
                        <span className="font-bold text-white">{activeSubmission.bedrooms} / {activeSubmission.bathrooms}</span>
                      </div>
                      <div className="p-3 bg-[#111315] rounded border border-slate-800">
                        <span className="text-slate-400 block">Sq Footage</span>
                        <span className="font-bold text-white">{activeSubmission.squareFeet} sqft</span>
                      </div>
                      <div className="p-3 bg-[#111315] rounded border border-slate-800">
                        <span className="text-slate-400 block">Condition</span>
                        <span className="font-bold text-brand-orange">{activeSubmission.condition}</span>
                      </div>
                    </div>

                    {/* Opendoor Valuation Questionnaire Responses */}
                    {activeSubmission.questionnaireData && (
                      <div className="p-4 bg-[#111315] rounded-lg border border-slate-800 text-xs space-y-3">
                        <span className="font-bold uppercase tracking-wider text-brand-orange block">
                          Opendoor Questionnaire Breakdown
                        </span>
                        {(() => {
                          let qData: any = {};
                          try { qData = JSON.parse(activeSubmission.questionnaireData); } catch (e) {}
                          return (
                            <div className="grid grid-cols-2 gap-3 text-slate-300">
                              <div><strong className="text-white">Timeline:</strong> {qData.timeline || "N/A"}</div>
                              <div><strong className="text-white">Basement:</strong> {qData.basement || "N/A"}</div>
                              <div><strong className="text-white">Pool:</strong> {qData.pool || "N/A"}</div>
                              <div><strong className="text-white">HOA Status:</strong> {qData.hoa?.isHOA || "No"}</div>
                              <div><strong className="text-white">Kitchen Rating:</strong> {qData.roomConditions?.kitchen || "Standard"}</div>
                              <div><strong className="text-white">Bath Rating:</strong> {qData.roomConditions?.bathroom || "Standard"}</div>
                              {qData.homeFeatures?.length > 0 && (
                                <div className="col-span-2">
                                  <strong className="text-white block mb-1">Features:</strong>
                                  <div className="flex flex-wrap gap-1">
                                    {qData.homeFeatures.map((f: string, i: number) => (
                                      <span key={i} className="px-2 py-0.5 bg-brand-orange/20 text-brand-orange font-semibold rounded text-[10px]">
                                        {f}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Photos attached */}
                    {activeSubmission.photos && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase text-slate-400">Uploaded Photos</span>
                        <div className="grid grid-cols-3 gap-3">
                          {JSON.parse(activeSubmission.photos || "[]").map((url: string, idx: number) => (
                            <div key={idx} className="relative h-24 rounded-lg overflow-hidden border border-slate-800">
                              <img src={url} alt="Photo" className="w-full h-full object-cover" />
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

          {/* TAB 3: PROPERTIES MANAGEMENT (CRUD with EDIT & DELETE & PRESET CHECKLIST) */}
          {activeTab === "properties" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Properties Catalog Management</h2>
                  <p className="text-xs text-slate-400">Add, edit, upload pictures, select features & detailed specs, publish, or delete property listings.</p>
                </div>
                <Button variant="primary" onClick={handleOpenAddProperty} className="gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Property Listing</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialProperties.map((prop) => (
                  <div key={prop.id} className="bg-[#1E2022] rounded-xl border border-slate-800 overflow-hidden space-y-3 p-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="relative h-44 w-full rounded-lg overflow-hidden bg-black">
                        <Image
                          src={prop.images?.[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"}
                          alt={prop.title}
                          fill
                          sizes="300px"
                          className="object-cover"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <Badge status={prop.status}>{prop.status}</Badge>
                          <span className="text-sm font-bold text-white">{formatCurrency(prop.price)}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white line-clamp-1">{prop.title}</h4>
                        <p className="text-xs text-slate-400">{prop.address}, {prop.city} {prop.state}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenEditProperty(prop)}
                        className="gap-1.5 text-xs bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Listing</span>
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteProperty(prop.id, prop.title)}
                        className="gap-1.5 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BUYER INQUIRIES CRM WITH DETAIL MODAL */}
          {activeTab === "inquiries" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white">Buyer Property Inquiries</h2>
                <p className="text-xs text-slate-400">Click any inquiry to open full lead details and manage inquiry status.</p>
              </div>

              <div className="bg-[#1E2022] rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#181A1C] uppercase text-[10px] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-4">Buyer Name</th>
                      <th className="p-4">Contact Info</th>
                      <th className="p-4">Property</th>
                      <th className="p-4">Message</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {initialInquiries.map((inq) => (
                      <tr
                        key={inq.id}
                        onClick={() => setSelectedInquiry(inq)}
                        className="hover:bg-slate-800/60 cursor-pointer transition-colors"
                      >
                        <td className="p-4 font-bold text-white">{inq.name}</td>
                        <td className="p-4 space-y-0.5">
                          <span className="block text-slate-300">{inq.email}</span>
                          <span className="block text-slate-500">{inq.phone}</span>
                        </td>
                        <td className="p-4">
                          {inq.property ? (
                            <span className="font-semibold text-brand-orange">{inq.property.title}</span>
                          ) : (
                            <span className="text-slate-500">General Inquiry</span>
                          )}
                        </td>
                        <td className="p-4 max-w-xs truncate text-slate-400">{inq.message}</td>
                        <td className="p-4 text-slate-500">{formatDate(inq.createdAt)}</td>
                        <td className="p-4">
                          <Badge status={inq.status}>{inq.status}</Badge>
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm" className="text-xs text-brand-orange">
                            Open Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: MULTI-CHAT SELLER MESSAGING WORKSPACE */}
          {activeTab === "messages" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Seller Messaging Center</h2>
                  <p className="text-xs text-slate-400">Manage all seller chats, search by customer name/phone, and assign status labels.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
                
                {/* Conversations List */}
                <div className="lg:col-span-4 bg-[#181A1C] border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
                  <div className="p-3 border-b border-slate-800 space-y-2 bg-[#1E2022]">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search seller, phone, address..."
                        value={chatSearch}
                        onChange={(e) => setChatSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-[#111315] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-orange"
                      />
                    </div>

                    <div className="flex items-center gap-1 overflow-x-auto text-[10px]">
                      {["ALL", "NEW", "NEEDS_FOLLOW_UP", "HIGH_PRIORITY", "OFFER_PENDING", "NEGOTIATING"].map((lbl) => (
                        <button
                          key={lbl}
                          onClick={() => setChatFilterLabel(lbl)}
                          className={`px-2 py-1 rounded font-semibold whitespace-nowrap transition-colors ${
                            chatFilterLabel === lbl
                              ? "bg-brand-orange text-white"
                              : "bg-[#111315] text-slate-400 hover:text-white"
                          }`}
                        >
                          {lbl.replace("_", " ")}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-grow overflow-y-auto divide-y divide-slate-800">
                    {filteredSubmissions.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        No conversations found matching filters.
                      </div>
                    ) : (
                      filteredSubmissions.map((sub) => {
                        const isSelected = activeChatSubmissionId === sub.id;
                        const lastMsg = sub.conversations?.[0]?.messages?.slice(-1)[0];
                        const label = sub.conversations?.[0]?.label || "NEW";

                        return (
                          <div
                            key={sub.id}
                            onClick={() => setActiveChatSubmissionId(sub.id)}
                            className={`p-3.5 cursor-pointer transition-colors space-y-1 ${
                              isSelected ? "bg-brand-orange/15 border-l-4 border-brand-orange" : "hover:bg-slate-800/50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-white">
                                {sub.seller.firstName} {sub.seller.lastName}
                              </span>
                              <Badge status={label} size="sm">{label}</Badge>
                            </div>
                            <p className="text-[11px] text-brand-orange font-medium truncate">{sub.propertyAddress}</p>
                            <p className="text-[11px] text-slate-400 truncate">{sub.seller.phone}</p>
                            {lastMsg && (
                              <p className="text-[11px] text-slate-500 truncate italic">
                                &quot;{lastMsg.content}&quot;
                              </p>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Active Chat Window */}
                {activeChatSubmission ? (
                  <div className="lg:col-span-8 bg-[#1E2022] border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
                    
                    {/* CUSTOMER HEADER INFO */}
                    <div className="p-4 bg-[#181A1C] border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">
                            {activeChatSubmission.seller.firstName} {activeChatSubmission.seller.lastName}
                          </h3>
                          <span className="text-xs text-slate-400 font-mono">({activeChatSubmission.seller.phone})</span>
                        </div>
                        <p className="text-xs text-slate-300">
                          Email: {activeChatSubmission.seller.email} | Property: <strong className="text-brand-orange">{activeChatSubmission.propertyAddress}</strong>
                        </p>
                      </div>

                      {activeConversation && (
                        <div className="flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-brand-orange" />
                          <select
                            value={activeConversation.label || "NEW"}
                            onChange={(e) => handleUpdateChatLabel(activeConversation.id, e.target.value)}
                            className="p-1.5 bg-[#111315] border border-slate-700 rounded text-xs text-white font-semibold focus:outline-none"
                          >
                            <option value="NEW">Label: NEW</option>
                            <option value="NEEDS_FOLLOW_UP">NEEDS FOLLOW UP</option>
                            <option value="HIGH_PRIORITY">HIGH PRIORITY</option>
                            <option value="OFFER_PENDING">OFFER PENDING</option>
                            <option value="NEGOTIATING">NEGOTIATING</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Messages Body */}
                    <div className="flex-grow p-4 overflow-y-auto space-y-3">
                      {activeConversation?.messages?.length === 0 ? (
                        <div className="text-center py-20 text-slate-500 text-xs">
                          No messages in this chat yet. Send a reply below.
                        </div>
                      ) : (
                        activeConversation?.messages?.map((msg: any) => {
                          const isAdmin = msg.sender?.role === "ADMIN";
                          return (
                            <div key={msg.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                              <div
                                className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 shadow-sm ${
                                  isAdmin ? "bg-brand-orange text-white rounded-br-none" : "bg-[#111315] text-slate-200 border border-slate-800 rounded-bl-none"
                                }`}
                              >
                                <div className="flex justify-between gap-4 text-[10px] opacity-80">
                                  <span>{isAdmin ? "You (Admin)" : `${activeChatSubmission.seller.firstName}`}</span>
                                  <span>{formatDateTime(msg.createdAt)}</span>
                                </div>
                                <p className="leading-relaxed whitespace-pre-line text-xs">{msg.content}</p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Reply Bar */}
                    <form onSubmit={handleSendAdminMessage} className="p-3 bg-[#181A1C] border-t border-slate-800 flex gap-2">
                      <input
                        type="text"
                        placeholder={`Reply to ${activeChatSubmission.seller.firstName}...`}
                        value={msgInput}
                        onChange={(e) => setMsgInput(e.target.value)}
                        className="flex-grow px-3.5 py-2.5 bg-[#111315] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-orange"
                      />
                      <Button type="submit" variant="primary" size="sm" isLoading={msgLoading} className="gap-1.5 px-5">
                        <Send className="w-4 h-4" />
                        <span>Send</span>
                      </Button>
                    </form>

                  </div>
                ) : (
                  <div className="lg:col-span-8 bg-[#1E2022] border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-xs">
                    Select a seller chat from the left sidebar.
                  </div>
                )}

              </div>
            </div>
          )}

        </main>
      </div>

      {/* ENHANCED CREATE / EDIT PROPERTY MODAL WITH PRESET CHECKLIST & ZILLOW SPECS */}
      {isPropModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#1E2022] border border-slate-800 rounded-2xl max-w-3xl w-full p-6 text-white space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-orange">Catalog Listing Editor</span>
                <h3 className="text-base font-bold text-white">
                  {editingPropId ? "Edit Property Listing" : "Add Available Property Listing"}
                </h3>
              </div>
              <button onClick={() => setIsPropModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="space-y-6 text-xs">
              
              {/* Basic Specs */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-brand-orange border-b border-slate-800 pb-1">1. Basic Info & Pricing</h4>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern Colonial Residence in Fairview Heights"
                    value={propForm.title}
                    onChange={(e) => setPropForm({ ...propForm, title: e.target.value })}
                    className="w-full p-2.5 bg-[#111315] border border-slate-700 rounded text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Asking Price ($)</label>
                    <input
                      type="number"
                      required
                      placeholder="345000"
                      value={propForm.price}
                      onChange={(e) => setPropForm({ ...propForm, price: e.target.value })}
                      className="w-full p-2.5 bg-[#111315] border border-slate-700 rounded text-white font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Property Type</label>
                    <select
                      value={propForm.propertyType}
                      onChange={(e) => setPropForm({ ...propForm, propertyType: e.target.value })}
                      className="w-full p-2.5 bg-[#111315] border border-slate-700 rounded text-white"
                    >
                      <option value="Single Family">Single Family</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Condo">Condo</option>
                      <option value="Multi-Family">Multi-Family</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="1428 Elmwood Terrace"
                    value={propForm.address}
                    onChange={(e) => setPropForm({ ...propForm, address: e.target.value })}
                    className="w-full p-2.5 bg-[#111315] border border-slate-700 rounded text-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">City</label>
                    <input
                      type="text"
                      required
                      placeholder="Austin"
                      value={propForm.city}
                      onChange={(e) => setPropForm({ ...propForm, city: e.target.value })}
                      className="w-full p-2.5 bg-[#111315] border border-slate-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">State</label>
                    <input
                      type="text"
                      required
                      placeholder="TX"
                      value={propForm.state}
                      onChange={(e) => setPropForm({ ...propForm, state: e.target.value })}
                      className="w-full p-2.5 bg-[#111315] border border-slate-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      required
                      placeholder="78704"
                      value={propForm.zip}
                      onChange={(e) => setPropForm({ ...propForm, zip: e.target.value })}
                      className="w-full p-2.5 bg-[#111315] border border-slate-700 rounded text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Beds</label>
                    <input
                      type="number"
                      value={propForm.bedrooms}
                      onChange={(e) => setPropForm({ ...propForm, bedrooms: e.target.value })}
                      className="w-full p-2.5 bg-[#111315] border border-slate-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Baths</label>
                    <input
                      type="number"
                      step="0.5"
                      value={propForm.bathrooms}
                      onChange={(e) => setPropForm({ ...propForm, bathrooms: e.target.value })}
                      className="w-full p-2.5 bg-[#111315] border border-slate-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">SqFt</label>
                    <input
                      type="number"
                      value={propForm.squareFeet}
                      onChange={(e) => setPropForm({ ...propForm, squareFeet: e.target.value })}
                      className="w-full p-2.5 bg-[#111315] border border-slate-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Listing Status</label>
                    <select
                      value={propForm.status}
                      onChange={(e) => setPropForm({ ...propForm, status: e.target.value })}
                      className="w-full p-2.5 bg-[#111315] border border-slate-700 rounded text-white font-bold"
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="PENDING">PENDING</option>
                      <option value="SOLD">SOLD</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* PRESET FEATURES CHECKLIST + CUSTOM FEATURE ADDER */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
                  <Sparkles className="w-4 h-4 text-brand-orange" />
                  <h4 className="font-bold text-sm text-brand-orange">2. Preset & Custom Features</h4>
                </div>

                <p className="text-[11px] text-slate-400">Select popular buyer features or add your own:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_FEATURES.map((feat) => {
                    const isSelected = propForm.features.includes(feat);
                    return (
                      <button
                        type="button"
                        key={feat}
                        onClick={() => toggleFeature(feat)}
                        className={`p-2 rounded border text-left flex items-center justify-between transition-colors ${
                          isSelected
                            ? "bg-brand-orange/20 border-brand-orange text-white font-semibold"
                            : "bg-[#111315] border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <span className="truncate">{feat}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-brand-orange flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Feature Adder Input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Type a custom feature (e.g. Heated Swimming Pool, Wine Cellar)..."
                    value={customFeatureInput}
                    onChange={(e) => setCustomFeatureInput(e.target.value)}
                    className="flex-grow p-2 bg-[#111315] border border-slate-700 rounded text-white text-xs"
                  />
                  <Button type="button" variant="secondary" size="sm" onClick={handleAddCustomFeature} className="gap-1 text-xs">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom</span>
                  </Button>
                </div>

                {propForm.features.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-500 font-semibold">Selected ({propForm.features.length}):</span>
                    {propForm.features.map((f, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-orange text-white text-[11px] rounded font-semibold">
                        {f}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => toggleFeature(f)} />
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* DETAILED SPECIFICATIONS */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-sm text-brand-orange border-b border-slate-800 pb-1">3. Detailed Specs</h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Heating</label>
                    <input
                      type="text"
                      placeholder="Forced Air, Heat Pump"
                      value={propForm.heating}
                      onChange={(e) => setPropForm({ ...propForm, heating: e.target.value })}
                      className="w-full p-2 bg-[#111315] border border-slate-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Cooling</label>
                    <input
                      type="text"
                      placeholder="Central Air, Ceiling Fan(s)"
                      value={propForm.cooling}
                      onChange={(e) => setPropForm({ ...propForm, cooling: e.target.value })}
                      className="w-full p-2 bg-[#111315] border border-slate-700 rounded text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Appliances Included</label>
                    <input
                      type="text"
                      placeholder="Dishwasher, Microwave, Range, Refrigerator"
                      value={propForm.appliances}
                      onChange={(e) => setPropForm({ ...propForm, appliances: e.target.value })}
                      className="w-full p-2 bg-[#111315] border border-slate-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Parking & Garage</label>
                    <input
                      type="text"
                      placeholder="2-Car Attached Garage"
                      value={propForm.garageType}
                      onChange={(e) => setPropForm({ ...propForm, garageType: e.target.value })}
                      className="w-full p-2 bg-[#111315] border border-slate-700 rounded text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Exterior Materials</label>
                    <input
                      type="text"
                      placeholder="Brick, HardiePlank"
                      value={propForm.materials}
                      onChange={(e) => setPropForm({ ...propForm, materials: e.target.value })}
                      className="w-full p-2 bg-[#111315] border border-slate-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Roof Type</label>
                    <input
                      type="text"
                      placeholder="Architectural Shingle"
                      value={propForm.roof}
                      onChange={(e) => setPropForm({ ...propForm, roof: e.target.value })}
                      className="w-full p-2 bg-[#111315] border border-slate-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Stories</label>
                    <input
                      type="text"
                      placeholder="2 Stories"
                      value={propForm.stories}
                      onChange={(e) => setPropForm({ ...propForm, stories: e.target.value })}
                      className="w-full p-2 bg-[#111315] border border-slate-700 rounded text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={propForm.description}
                  onChange={(e) => setPropForm({ ...propForm, description: e.target.value })}
                  className="w-full p-2.5 bg-[#111315] border border-slate-700 rounded text-white"
                />
              </div>

              {/* Upload Real Property Pictures */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="block font-semibold text-slate-300">Upload Property Pictures</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePropImageFileUpload}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-orange file:text-white hover:file:bg-brand-orange-hover"
                />

                {propForm.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {propForm.images.map((url, idx) => (
                      <div key={idx} className="relative h-20 rounded border border-slate-700 overflow-hidden group">
                        <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setPropForm({ ...propForm, images: propForm.images.filter((_, i) => i !== idx) })}
                          className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full hover:bg-rose-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <Button type="button" variant="ghost" onClick={() => setIsPropModalOpen(false)} className="text-slate-400">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={propLoading} className="gap-2 px-6">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingPropId ? "Save Property Changes" : "Publish Property Listing"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BUYER INQUIRY DETAIL MODAL */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1E2022] border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-orange">Buyer Inquiry Lead</span>
                <h3 className="text-base font-bold text-white">{selectedInquiry.name}</h3>
              </div>
              <button onClick={() => setSelectedInquiry(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#111315] rounded border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold block">Contact Details:</span>
                <p className="text-white">Email: <strong>{selectedInquiry.email}</strong></p>
                <p className="text-white">Phone: <strong>{selectedInquiry.phone}</strong></p>
              </div>

              {selectedInquiry.property && (
                <div className="p-3 bg-[#111315] rounded border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block">Inquired Property:</span>
                  <p className="text-brand-orange font-bold">{selectedInquiry.property.title}</p>
                  <p className="text-slate-400">{selectedInquiry.property.address}</p>
                </div>
              )}

              <div className="p-3 bg-[#111315] rounded border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold block">Buyer Message:</span>
                <p className="text-slate-200 whitespace-pre-line leading-relaxed">&quot;{selectedInquiry.message}&quot;</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="button" variant="primary" onClick={() => setSelectedInquiry(null)}>
                Close Window
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CASH OFFER MODAL */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1E2022] border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create Cash Offer</h3>
              <button onClick={() => setIsOfferModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Offer Amount ($ USD)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 195000"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  className="w-full p-2.5 bg-[#111315] border border-slate-700 rounded text-sm text-white focus:ring-2 focus:ring-brand-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Seller Visible Message</label>
                <textarea
                  rows={3}
                  placeholder="Explain offer terms (e.g. Net cash offer with flexible closing)."
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  className="w-full p-2.5 bg-[#111315] border border-slate-700 rounded text-white focus:ring-2 focus:ring-brand-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Internal Admin Notes (Private)</label>
                <textarea
                  rows={2}
                  placeholder="Internal notes..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  className="w-full p-2.5 bg-[#111315] border border-slate-700 rounded text-slate-300 focus:ring-2 focus:ring-brand-orange focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsOfferModalOpen(false)} className="text-slate-400">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={offerLoading} className="gap-2 px-6">
                  <Send className="w-4 h-4" />
                  <span>Send Offer to Seller</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
