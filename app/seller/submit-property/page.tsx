"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  Home,
  Building2,
  CheckCircle2,
  Upload,
  X,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Plus,
  ImageIcon,
  Sparkles,
  Info,
  Calendar,
  Lock,
  User,
  Mail,
  Check,
} from "lucide-react";

const PROPERTY_TYPES = [
  { id: "Single Family", title: "Single-family home", desc: "Standalone residential property" },
  { id: "Townhouse", title: "Townhouse or attached single-family", desc: "Multi-level shared wall residential home" },
  { id: "Condo", title: "Apartment or condo", desc: "Multi-unit condominium residence" },
  { id: "Mobile", title: "Mobile or manufactured home", desc: "Factory-built residential structure" },
  { id: "Multi-Family", title: "Multi-family (3+ units)", desc: "3+ units in a single structure" },
  { id: "Commercial", title: "Commercial property", desc: "Commercial or mixed-use real estate" },
  { id: "Lot", title: "Empty lot / Land", desc: "Unimproved residential or commercial land" },
];

const CONDITION_LEVELS = [
  { id: "Fixer Upper", title: "Fixer Upper", desc: "Needs significant repairs or overhaul" },
  { id: "Dated", title: "Dated", desc: "Hasn't been updated recently" },
  { id: "Standard", title: "Standard", desc: "Updated with common, clean finishes" },
  { id: "High end", title: "High end", desc: "Has high-quality upgrades & fixtures" },
  { id: "Luxury", title: "Luxury", desc: "Features elegant, top-tier luxury finishes" },
];

const PRESET_HOME_FEATURES = [
  "Central Heating System",
  "Central Air Conditioning",
  "Smart Lighting System",
  "Smart Thermostat",
  "Quartz Countertops",
  "Hardwood Flooring",
  "Covered Patio / Deck",
  "Fenced Yard",
  "EV Charger Ready",
  "Security System",
  "Backup Generator",
  "Walk-In Closet(s)",
  "Gas Fireplace",
  "Dual Primary Suites",
];

const SPECIAL_CONDITIONS_LIST = [
  { id: "solar", title: "Leased or financed solar panels", desc: "Solar panels with buyout or transfer terms" },
  { id: "foundation", title: "Known foundation issues", desc: "Excessive cracking or uneven floors" },
  { id: "fire", title: "Fire damage history", desc: "Past or current fire restoration needed" },
  { id: "well", title: "Well water system", desc: "Private well water supply" },
  { id: "septic", title: "Septic system", desc: "Private septic tank separate from city sewer" },
  { id: "mobile", title: "Mobile or manufactured home", desc: "Factory structure" },
  { id: "none", title: "None of the above", desc: "No special conditions apply" },
];

export default function SubmitPropertyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth State (Checks if user is logged in)
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");

  // Inline Auth Form State
  const [authForm, setAuthForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/login", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  // Opendoor Form State
  const [formData, setFormData] = useState({
    // Address
    propertyAddress: "",
    city: "",
    state: "",
    zip: "",
    propertyType: "Single Family",
    
    // Core Specs
    bedrooms: "3",
    fullBathrooms: "2",
    partialBathrooms: "0",
    squareFeet: "1850",
    lotSquareFeet: "7500",
    floorsAboveGround: "2",
    basement: "No", // "No" | "Finished" | "Unfinished"
    yearBuilt: "2000",
    pool: "No", // "No" | "Inground Pool" | "Above Ground Pool"

    // Ownership & Agent
    isOwner: "Yes, I own this home",
    hasAgentAgreement: "No, I do not have an active agreement",

    // Selling Timeline
    timeline: "2–4 weeks",

    // Room-by-room Condition Ratings
    kitchenCondition: "Standard",
    bathroomCondition: "Standard",
    livingCondition: "Standard",
    exteriorCondition: "Standard",

    // HOA & Community
    isHOA: "No",
    communityType: "None of the above",
    monthlyHOAFees: "",

    // Special Conditions & Features
    specialConditions: ["none"] as string[],
    homeFeatures: ["Central Heating System", "Central Air Conditioning", "Smart Thermostat"] as string[],
    customFeatureInput: "",

    // Renovation & Buying Interest
    interestedInBuying: "No",
    hasMajorRenovations: "No",
    renovationDetails: "",

    // Photos
    photos: [] as string[],
    preferredContact: "Either",
  });

  const totalSteps = 9;

  // File Photo Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({
            ...prev,
            photos: [...prev.photos, event.target!.result as string],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx),
    }));
  };

  const toggleSpecialCondition = (id: string) => {
    if (id === "none") {
      setFormData({ ...formData, specialConditions: ["none"] });
      return;
    }
    const filtered = formData.specialConditions.filter((c) => c !== "none");
    if (filtered.includes(id)) {
      setFormData({ ...formData, specialConditions: filtered.filter((c) => c !== id) });
    } else {
      setFormData({ ...formData, specialConditions: [...filtered, id] });
    }
  };

  const toggleHomeFeature = (feat: string) => {
    if (formData.homeFeatures.includes(feat)) {
      setFormData({ ...formData, homeFeatures: formData.homeFeatures.filter((f) => f !== feat) });
    } else {
      setFormData({ ...formData, homeFeatures: [...formData.homeFeatures, feat] });
    }
  };

  const handleAddCustomFeature = () => {
    if (formData.customFeatureInput.trim() && !formData.homeFeatures.includes(formData.customFeatureInput.trim())) {
      setFormData({
        ...formData,
        homeFeatures: [...formData.homeFeatures, formData.customFeatureInput.trim()],
        customFeatureInput: "",
      });
    }
  };

  // Final Submission Handler
  const executeSubmission = async () => {
    setLoading(true);
    setError(null);

    const bathroomsCalc = parseFloat(formData.fullBathrooms) + parseFloat(formData.partialBathrooms) * 0.5;

    const payload = {
      propertyAddress: formData.propertyAddress,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      propertyType: formData.propertyType,
      bedrooms: formData.bedrooms,
      bathrooms: bathroomsCalc.toString(),
      squareFeet: formData.squareFeet,
      lotSize: formData.lotSquareFeet ? `${formData.lotSquareFeet} sqft` : null,
      yearBuilt: formData.yearBuilt,
      occupancy: formData.isOwner.includes("Yes") ? "Owner Occupied" : "Vacant",
      condition: formData.kitchenCondition,
      description: `Kitchen: ${formData.kitchenCondition}, Bath: ${formData.bathroomCondition}, Living: ${formData.livingCondition}, Exterior: ${formData.exteriorCondition}. ${formData.renovationDetails}`,
      photos: formData.photos,
      preferredContact: formData.preferredContact,
      questionnaireData: {
        bedrooms: formData.bedrooms,
        fullBathrooms: formData.fullBathrooms,
        partialBathrooms: formData.partialBathrooms,
        squareFeet: formData.squareFeet,
        lotSquareFeet: formData.lotSquareFeet,
        floorsAboveGround: formData.floorsAboveGround,
        basement: formData.basement,
        yearBuilt: formData.yearBuilt,
        pool: formData.pool,
        isOwner: formData.isOwner,
        hasAgentAgreement: formData.hasAgentAgreement,
        timeline: formData.timeline,
        roomConditions: {
          kitchen: formData.kitchenCondition,
          bathroom: formData.bathroomCondition,
          livingRoom: formData.livingCondition,
          exterior: formData.exteriorCondition,
        },
        hoa: {
          isHOA: formData.isHOA,
          communityType: formData.communityType,
          monthlyFees: formData.monthlyHOAFees,
        },
        specialConditions: formData.specialConditions,
        homeFeatures: formData.homeFeatures,
        interestedInBuying: formData.interestedInBuying,
        hasMajorRenovations: formData.hasMajorRenovations,
        renovationDetails: formData.renovationDetails,
      },
    };

    try {
      const res = await fetch("/api/seller/submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit property.");

      router.push("/seller/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmitClick = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    executeSubmission();
  };

  // Inline Auth Submit
  const handleInlineAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    const endpoint = authMode === "register" ? "/api/auth/register" : "/api/auth/login";
    const bodyPayload =
      authMode === "register"
        ? authForm
        : { email: authForm.email, password: authForm.password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed.");

      setCurrentUser(data.user);
      setShowAuthModal(false);
      // Execute property submission automatically after successful inline auth!
      executeSubmission();
    } catch (err: any) {
      setAuthError(err.message || "Authentication error occurred.");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-48">
              <Image src="/logo.png" alt="Logo" fill sizes="200px" className="object-contain" priority />
            </div>
          </Link>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              Opendoor Valuation Engine
            </span>
            <span className="text-xs font-bold text-brand-orange bg-brand-orange-light border border-brand-orange/20 px-3 py-1 rounded-full">
              48h Offer Guarantee
            </span>
          </div>
        </div>
      </header>

      {/* Main 80% Width Centered Container */}
      <main className="flex-grow py-8 sm:py-12">
        <div className="w-full max-w-[85%] lg:max-w-[78%] xl:max-w-[72%] mx-auto space-y-6">
          
          {/* Progress Bar & Header Pill */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                Step {step} of {totalSteps}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-brand-dark">
                {step === 1 && "What best describes your home?"}
                {step === 2 && "Property Address"}
                {step === 3 && "Do these home details look right to you?"}
                {step === 4 && "Ownership & Representation"}
                {step === 5 && "When do you need to sell your home?"}
                {step === 6 && "How would you describe your home's condition?"}
                {step === 7 && "HOA, Community & Special Conditions"}
                {step === 8 && "Home Features Checklist"}
                {step === 9 && "Upload Real Property Photos"}
              </h2>
            </div>

            <div className="w-full sm:w-48 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-brand-orange h-full transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Animated Form Card */}
          <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xl min-h-[500px] flex flex-col justify-between">
            
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 flex-grow"
              >

                {/* STEP 1: PROPERTY TYPE */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-brand-dark">What best describes your home?</h3>
                      <p className="text-xs text-slate-500 mt-1">This helps us select accurate comps when preparing your cash offer.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {PROPERTY_TYPES.map((pt) => {
                        const isSelected = formData.propertyType === pt.id;
                        return (
                          <div
                            key={pt.id}
                            onClick={() => setFormData({ ...formData, propertyType: pt.id })}
                            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                              isSelected
                                ? "bg-brand-orange-light/50 border-brand-orange shadow-md scale-[1.01]"
                                : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-base text-brand-dark">{pt.title}</span>
                              {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-orange flex-shrink-0" />}
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">{pt.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 2: ADDRESS */}
                {step === 2 && (
                  <div className="space-y-6 max-w-2xl">
                    <div>
                      <h3 className="text-2xl font-bold text-brand-dark">Property Address</h3>
                      <p className="text-xs text-slate-500 mt-1">Enter your exact street address for market comp analysis.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Street Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 742 Evergreen Terrace"
                          value={formData.propertyAddress}
                          onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-brand-dark focus:bg-white focus:ring-2 focus:ring-brand-orange focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">City <span className="text-rose-500">*</span></label>
                          <input
                            type="text"
                            required
                            placeholder="Springfield"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-brand-dark focus:bg-white focus:ring-2 focus:ring-brand-orange focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">State <span className="text-rose-500">*</span></label>
                          <input
                            type="text"
                            required
                            placeholder="IL"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-brand-dark focus:bg-white focus:ring-2 focus:ring-brand-orange focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">ZIP Code <span className="text-rose-500">*</span></label>
                          <input
                            type="text"
                            required
                            placeholder="62704"
                            value={formData.zip}
                            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                            className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-brand-dark focus:bg-white focus:ring-2 focus:ring-brand-orange focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: CORE SPECS */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-brand-dark">Do these home details look right to you?</h3>
                      <p className="text-xs text-slate-500 mt-1">Your offer will be more accurate if all these details are up to date.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
                      
                      <div className="space-y-1">
                        <label className="block font-bold text-brand-dark">Bedrooms (required)</label>
                        <span className="block text-[11px] text-slate-400">Must have a door, closet, and window.</span>
                        <select
                          value={formData.bedrooms}
                          onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-brand-dark"
                        >
                          <option value="1">1 Bedroom</option>
                          <option value="2">2 Bedrooms</option>
                          <option value="3">3 Bedrooms</option>
                          <option value="4">4 Bedrooms</option>
                          <option value="5">5+ Bedrooms</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-brand-dark">Full bathrooms (required)</label>
                        <span className="block text-[11px] text-slate-400">Must have a toilet and a shower/tub.</span>
                        <select
                          value={formData.fullBathrooms}
                          onChange={(e) => setFormData({ ...formData, fullBathrooms: e.target.value })}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-brand-dark"
                        >
                          <option value="1">1 Full Bath</option>
                          <option value="2">2 Full Baths</option>
                          <option value="3">3 Full Baths</option>
                          <option value="4">4+ Full Baths</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-brand-dark">Partial 1/2 bathrooms (required)</label>
                        <span className="block text-[11px] text-slate-400">Must have a toilet and sink.</span>
                        <select
                          value={formData.partialBathrooms}
                          onChange={(e) => setFormData({ ...formData, partialBathrooms: e.target.value })}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-brand-dark"
                        >
                          <option value="0">0 (None)</option>
                          <option value="1">1 Partial Bath</option>
                          <option value="2">2 Partial Baths</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-brand-dark">Square footage (above ground)</label>
                        <span className="block text-[11px] text-slate-400">Don&apos;t include basements or unheated sqft.</span>
                        <input
                          type="number"
                          placeholder="1850"
                          value={formData.squareFeet}
                          onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-brand-dark"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-brand-dark">Lot square footage (optional)</label>
                        <span className="block text-[11px] text-slate-400">Length x width of your lot in feet.</span>
                        <input
                          type="number"
                          placeholder="7500"
                          value={formData.lotSquareFeet}
                          onChange={(e) => setFormData({ ...formData, lotSquareFeet: e.target.value })}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-brand-dark"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-brand-dark">Floors (above ground)</label>
                        <span className="block text-[11px] text-slate-400">Don&apos;t include the basement.</span>
                        <select
                          value={formData.floorsAboveGround}
                          onChange={(e) => setFormData({ ...formData, floorsAboveGround: e.target.value })}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-brand-dark"
                        >
                          <option value="1">1 Story</option>
                          <option value="2">2 Stories</option>
                          <option value="3">3+ Stories</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-brand-dark">Basement (required)</label>
                        <span className="block text-[11px] text-slate-400">Floors completely below ground.</span>
                        <select
                          value={formData.basement}
                          onChange={(e) => setFormData({ ...formData, basement: e.target.value })}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-brand-dark"
                        >
                          <option value="No">No Basement</option>
                          <option value="Finished">Yes - Finished</option>
                          <option value="Unfinished">Yes - Unfinished</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-brand-dark">Year built (required)</label>
                        <span className="block text-[11px] text-slate-400">Original construction year.</span>
                        <input
                          type="number"
                          placeholder="2000"
                          value={formData.yearBuilt}
                          onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-brand-dark"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-brand-dark">Pool (required)</label>
                        <span className="block text-[11px] text-slate-400">Swimming pool presence.</span>
                        <select
                          value={formData.pool}
                          onChange={(e) => setFormData({ ...formData, pool: e.target.value })}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-brand-dark"
                        >
                          <option value="No">No Pool</option>
                          <option value="Inground Pool">Inground Pool</option>
                          <option value="Above Ground Pool">Above Ground Pool</option>
                        </select>
                      </div>

                    </div>
                  </div>
                )}

                {/* STEP 4: OWNERSHIP & REPRESENTATION */}
                {step === 4 && (
                  <div className="space-y-6 max-w-3xl">
                    <div>
                      <h3 className="text-2xl font-bold text-brand-dark">Are you the owner of this home?</h3>
                      <p className="text-xs text-slate-500 mt-1">We have additional questions if you&apos;re an agent representing the sale.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        "Yes, I own this home",
                        "No, I’m an agent",
                        "I’m an agent, and I own this home",
                        "Other",
                      ].map((opt) => (
                        <div
                          key={opt}
                          onClick={() => setFormData({ ...formData, isOwner: opt })}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                            formData.isOwner === opt
                              ? "bg-brand-orange-light/50 border-brand-orange font-bold text-brand-dark"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-sm">{opt}</span>
                          {formData.isOwner === opt && <CheckCircle2 className="w-5 h-5 text-brand-orange" />}
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <h4 className="text-sm font-bold text-brand-dark">
                        Do you have an active representation agreement with an agent?
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          "Yes, I have an active agreement for a Real Estate Agent to represent my sale",
                          "No, I do not have an active agreement",
                        ].map((opt) => (
                          <div
                            key={opt}
                            onClick={() => setFormData({ ...formData, hasAgentAgreement: opt })}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                              formData.hasAgentAgreement === opt
                                ? "bg-brand-orange-light/50 border-brand-orange font-bold text-brand-dark"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <span className="text-xs">{opt}</span>
                            {formData.hasAgentAgreement === opt && <CheckCircle2 className="w-5 h-5 text-brand-orange flex-shrink-0" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: SELLING TIMELINE */}
                {step === 5 && (
                  <div className="space-y-6 max-w-2xl">
                    <div>
                      <h3 className="text-2xl font-bold text-brand-dark">When do you need to sell your home?</h3>
                      <p className="text-xs text-slate-500 mt-1">This won&apos;t affect your offer amount. We work with any timeline.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {["ASAP", "2–4 weeks", "4–6 weeks", "6+ weeks", "Just browsing"].map((t) => (
                        <div
                          key={t}
                          onClick={() => setFormData({ ...formData, timeline: t })}
                          className={`p-4 rounded-xl border-2 cursor-pointer text-center font-bold text-sm transition-all ${
                            formData.timeline === t
                              ? "bg-brand-orange text-white border-brand-orange shadow-md"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 6: ROOM-BY-ROOM CONDITION CARDS */}
                {step === 6 && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-brand-dark">How would you describe your home&apos;s condition?</h3>
                      <p className="text-xs text-slate-500 mt-1">Select the closest match for each room area.</p>
                    </div>

                    {/* Room 1: Kitchen */}
                    <div className="space-y-3 border-b border-slate-100 pb-6">
                      <h4 className="text-base font-bold text-brand-dark">How would you describe your kitchen?</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {CONDITION_LEVELS.map((lvl) => {
                          const isSel = formData.kitchenCondition === lvl.id;
                          return (
                            <div
                              key={lvl.id}
                              onClick={() => setFormData({ ...formData, kitchenCondition: lvl.id })}
                              className={`p-3.5 rounded-xl border-2 cursor-pointer space-y-1 transition-all ${
                                isSel
                                  ? "bg-brand-orange-light/50 border-brand-orange font-bold text-brand-dark shadow"
                                  : "bg-white border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              <span className="text-sm font-bold block">{lvl.title}</span>
                              <span className="text-[11px] text-slate-500 block leading-tight">{lvl.desc}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Room 2: Main Bathroom */}
                    <div className="space-y-3 border-b border-slate-100 pb-6">
                      <h4 className="text-base font-bold text-brand-dark">How would you describe your main bathroom?</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {CONDITION_LEVELS.map((lvl) => {
                          const isSel = formData.bathroomCondition === lvl.id;
                          return (
                            <div
                              key={lvl.id}
                              onClick={() => setFormData({ ...formData, bathroomCondition: lvl.id })}
                              className={`p-3.5 rounded-xl border-2 cursor-pointer space-y-1 transition-all ${
                                isSel
                                  ? "bg-brand-orange-light/50 border-brand-orange font-bold text-brand-dark shadow"
                                  : "bg-white border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              <span className="text-sm font-bold block">{lvl.title}</span>
                              <span className="text-[11px] text-slate-500 block leading-tight">{lvl.desc}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Room 3: Living Room */}
                    <div className="space-y-3 border-b border-slate-100 pb-6">
                      <h4 className="text-base font-bold text-brand-dark">How would you describe your living room?</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {CONDITION_LEVELS.map((lvl) => {
                          const isSel = formData.livingCondition === lvl.id;
                          return (
                            <div
                              key={lvl.id}
                              onClick={() => setFormData({ ...formData, livingCondition: lvl.id })}
                              className={`p-3.5 rounded-xl border-2 cursor-pointer space-y-1 transition-all ${
                                isSel
                                  ? "bg-brand-orange-light/50 border-brand-orange font-bold text-brand-dark shadow"
                                  : "bg-white border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              <span className="text-sm font-bold block">{lvl.title}</span>
                              <span className="text-[11px] text-slate-500 block leading-tight">{lvl.desc}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Room 4: Exterior */}
                    <div className="space-y-3">
                      <h4 className="text-base font-bold text-brand-dark">How would you describe your home exterior?</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {CONDITION_LEVELS.map((lvl) => {
                          const isSel = formData.exteriorCondition === lvl.id;
                          return (
                            <div
                              key={lvl.id}
                              onClick={() => setFormData({ ...formData, exteriorCondition: lvl.id })}
                              className={`p-3.5 rounded-xl border-2 cursor-pointer space-y-1 transition-all ${
                                isSel
                                  ? "bg-brand-orange-light/50 border-brand-orange font-bold text-brand-dark shadow"
                                  : "bg-white border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              <span className="text-sm font-bold block">{lvl.title}</span>
                              <span className="text-[11px] text-slate-500 block leading-tight">{lvl.desc}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}

                {/* STEP 7: HOA & SPECIAL CONDITIONS */}
                {step === 7 && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-brand-dark">HOA & Special Conditions</h3>
                      <p className="text-xs text-slate-500 mt-1">We keep an eye out for these items when making an offer.</p>
                    </div>

                    {/* HOA */}
                    <div className="space-y-4 border-b border-slate-100 pb-6">
                      <h4 className="text-base font-bold text-brand-dark">Is your home part of a homeowners association (HOA)?</h4>
                      <div className="flex gap-4">
                        {["Yes", "No"].map((opt) => (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => setFormData({ ...formData, isHOA: opt })}
                            className={`px-8 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                              formData.isHOA === opt
                                ? "bg-brand-orange text-white border-brand-orange"
                                : "bg-white border-slate-200 text-slate-700"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>

                      {formData.isHOA === "Yes" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Community Type</label>
                            <select
                              value={formData.communityType}
                              onChange={(e) => setFormData({ ...formData, communityType: e.target.value })}
                              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-brand-dark"
                            >
                              <option value="None of the above">None of the above</option>
                              <option value="Age restricted community">Age restricted community</option>
                              <option value="Gated community">Gated community</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly HOA Fees ($ optional)</label>
                            <input
                              type="number"
                              placeholder="150"
                              value={formData.monthlyHOAFees}
                              onChange={(e) => setFormData({ ...formData, monthlyHOAFees: e.target.value })}
                              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-brand-dark"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Special Conditions Checkboxes */}
                    <div className="space-y-3">
                      <h4 className="text-base font-bold text-brand-dark">Do any of these apply to your home? (Select all that apply)</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {SPECIAL_CONDITIONS_LIST.map((sc) => {
                          const isChecked = formData.specialConditions.includes(sc.id);
                          return (
                            <div
                              key={sc.id}
                              onClick={() => toggleSpecialCondition(sc.id)}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                                isChecked
                                  ? "bg-brand-orange-light/50 border-brand-orange font-bold text-brand-dark"
                                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              <div className="space-y-0.5">
                                <span className="text-xs font-bold block">{sc.title}</span>
                                <span className="text-[11px] text-slate-500 block">{sc.desc}</span>
                              </div>
                              {isChecked && <CheckCircle2 className="w-5 h-5 text-brand-orange flex-shrink-0" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}

                {/* STEP 8: HOME FEATURES CHECKLIST */}
                {step === 8 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-brand-dark">What features does your house have?</h3>
                      <p className="text-xs text-slate-500 mt-1">Select all features present in your property.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {PRESET_HOME_FEATURES.map((feat) => {
                        const isSelected = formData.homeFeatures.includes(feat);
                        return (
                          <div
                            key={feat}
                            onClick={() => toggleHomeFeature(feat)}
                            className={`p-3.5 rounded-xl border-2 cursor-pointer text-xs flex items-center justify-between transition-all ${
                              isSelected
                                ? "bg-brand-orange text-white border-brand-orange font-bold shadow"
                                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <span className="truncate">{feat}</span>
                            {isSelected && <Check className="w-4 h-4 text-white flex-shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Custom Feature Adder */}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add custom feature (e.g. Heated Pool, Wine Cellar)..."
                        value={formData.customFeatureInput}
                        onChange={(e) => setFormData({ ...formData, customFeatureInput: e.target.value })}
                        className="flex-grow px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-brand-dark focus:bg-white focus:ring-2 focus:ring-brand-orange focus:outline-none"
                      />
                      <Button type="button" variant="secondary" size="sm" onClick={handleAddCustomFeature} className="gap-1 text-xs">
                        <Plus className="w-4 h-4" />
                        <span>Add Custom</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 9: UPLOAD REAL PHOTOS & SUBMIT */}
                {step === 9 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-brand-dark">Upload Real Property Photos</h3>
                      <p className="text-xs text-slate-500 mt-1">Upload actual photos of your property from your phone or computer.</p>
                    </div>

                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100/80 transition-colors relative cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="space-y-2 pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-brand-dark">Click or Drag & Drop Real Property Photos</p>
                        <p className="text-xs text-slate-500">Supports JPG, PNG, WEBP files directly from your phone camera or computer</p>
                      </div>
                    </div>

                    {formData.photos.length > 0 ? (
                      <div className="space-y-2 pt-2">
                        <span className="text-xs font-bold text-brand-dark">Uploaded Photos ({formData.photos.length})</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {formData.photos.map((url, idx) => (
                            <div key={idx} className="relative h-28 rounded-xl overflow-hidden border border-slate-200 group bg-slate-100 shadow-sm">
                              <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(idx)}
                                className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-rose-600 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>No photos uploaded yet. Uploading real photos helps us evaluate your property faster!</span>
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Wizard Navigation Footer */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-8">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>
              ) : (
                <div />
              )}

              {step < totalSteps ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => {
                    if (step === 2 && (!formData.propertyAddress || !formData.city || !formData.state || !formData.zip)) {
                      setError("Please fill in all address fields.");
                      return;
                    }
                    setError(null);
                    setStep(step + 1);
                  }}
                  className="gap-2 px-6"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  isLoading={loading}
                  onClick={handleFinalSubmitClick}
                  className="gap-2 px-8 shadow-md"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Submit Property for Offer</span>
                </Button>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* SEAMLESS INLINE AUTHENTICATION GATE MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark">
                {authMode === "register" ? "Create Account to Submit" : "Log In to Submit"}
              </h3>
              <p className="text-xs text-slate-500">
                Your entered property details will be saved automatically upon signing in!
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                {authError}
              </div>
            )}

            <form onSubmit={handleInlineAuthSubmit} className="space-y-3 text-xs">
              {authMode === "register" && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Marcus"
                      value={authForm.firstName}
                      onChange={(e) => setAuthForm({ ...authForm, firstName: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Vance"
                      value={authForm.lastName}
                      onChange={(e) => setAuthForm({ ...authForm, lastName: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="seller@example.com"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              {authMode === "register" && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="(555) 234-5678"
                    value={authForm.phone}
                    onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <Button type="submit" variant="primary" size="lg" isLoading={authLoading} className="w-full gap-2 mt-2">
                <span>{authMode === "register" ? "Create Account & Complete Submission" : "Log In & Complete Submission"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <div className="text-center pt-2 text-xs">
              {authMode === "register" ? (
                <span className="text-slate-500">
                  Already have an account?{" "}
                  <button onClick={() => setAuthMode("login")} className="font-bold text-brand-orange underline">
                    Log In
                  </button>
                </span>
              ) : (
                <span className="text-slate-500">
                  Don&apos;t have an account?{" "}
                  <button onClick={() => setAuthMode("register")} className="font-bold text-brand-orange underline">
                    Create Account
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
