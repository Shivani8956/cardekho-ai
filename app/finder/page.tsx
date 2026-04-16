"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Sparkles, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import StepBudget from "@/components/StepBudget";
import StepBodyType from "@/components/StepBodyType";
import StepFuelType from "@/components/StepFuelType";
import StepPriorities from "@/components/StepPriorities";
import StepUsage from "@/components/StepUsage";
import Results from "@/components/Results";
import { Car } from "@/lib/types";

interface Recommendation {
  carId: number;
  carName: string;
  reason: string;
  prosForUser: string[];
  consForUser: string[];
  matchScore: number;
}

interface RecommendResponse {
  summary: string;
  recommendations: Recommendation[];
}

const TOTAL_STEPS = 5;

const loadingMessages = [
  "AI is analyzing 50+ cars for you...",
  "Comparing safety ratings and features...",
  "Matching cars to your priorities...",
  "Calculating best value for your budget...",
  "Preparing personalized recommendations...",
];

export default function FinderPage() {
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [priorities, setPriorities] = useState<string[]>([]);
  const [usage, setUsage] = useState("");
  const [familySize, setFamilySize] = useState(4);
  const [loading, setLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [results, setResults] = useState<RecommendResponse | null>(null);
  const [carsData, setCarsData] = useState<Car[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/cars")
      .then((res) => res.json())
      .then((data) => setCarsData(data.cars || []))
      .catch(() => {});
  }, []);

  const canProceed = () => {
    switch (step) {
      case 1: return budget !== "";
      case 2: return true;
      case 3: return true;
      case 4: return priorities.length > 0;
      case 5: return usage !== "";
      default: return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setLoadingMsgIndex(0);

    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budget,
          bodyType,
          fuelType,
          priorities,
          usage,
          familySize,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setResults(data);
      }
    } catch {
      setError("Failed to connect to the server. Please check your connection and try again.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleStartOver = () => {
    setStep(1);
    setBudget("");
    setBodyType("");
    setFuelType("");
    setPriorities([]);
    setUsage("");
    setFamilySize(4);
    setResults(null);
    setError("");
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center px-4">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Finding Your Perfect Car
          </h2>
          <p className="text-lg text-gray-600 h-7 transition-opacity duration-300">
            {loadingMessages[loadingMsgIndex]}
          </p>
          <div className="mt-8 flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (results) {
    return (
      <Results
        results={results}
        carsData={carsData}
        onStartOver={handleStartOver}
      />
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center px-4 max-w-md">
          <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#2563EB] rounded-lg hover:bg-[#1d4ed8] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
            <button
              onClick={handleStartOver}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Wizard steps
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-white py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Progress bar */}
        <div className="mb-10">
          <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />
        </div>

        {/* Step content */}
        <div className="mb-10">
          {step === 1 && <StepBudget value={budget} onChange={setBudget} />}
          {step === 2 && <StepBodyType value={bodyType} onChange={setBodyType} />}
          {step === 3 && <StepFuelType value={fuelType} onChange={setFuelType} />}
          {step === 4 && <StepPriorities value={priorities} onChange={setPriorities} />}
          {step === 5 && (
            <StepUsage
              usage={usage}
              familySize={familySize}
              onUsageChange={setUsage}
              onFamilyChange={setFamilySize}
            />
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
              step === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
              canProceed()
                ? "bg-[#2563EB] text-white hover:bg-[#1d4ed8] shadow-lg shadow-blue-500/25"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {step === TOTAL_STEPS ? (
              <>
                <Sparkles className="w-4 h-4" />
                Get AI Recommendations
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
