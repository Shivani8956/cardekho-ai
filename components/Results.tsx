"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Star,
  ArrowLeft,
  Gauge,
  Fuel,
  Cog,
  ShieldCheck,
  Users,
  X,
  GitCompareArrows,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
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

interface ResultsProps {
  results: RecommendResponse;
  carsData: Car[];
  onStartOver: () => void;
}

function getCarData(carId: number, carsData: Car[]): Car | undefined {
  return carsData.find((c) => c.id === carId);
}

function SafetyStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function Results({ results, carsData, onStartOver }: ResultsProps) {
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const toggleCompare = (carId: number) => {
    setCompareIds((prev) => {
      if (prev.includes(carId)) return prev.filter((id) => id !== carId);
      if (prev.length >= 3) return prev;
      return [...prev, carId];
    });
  };

  const compareCars = compareIds
    .map((id) => getCarData(id, carsData))
    .filter(Boolean) as Car[];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-white py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Summary Card */}
        <div className="mb-10 bg-gradient-to-r from-[#2563EB] to-blue-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-blue-500/20">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold mb-2">AI Recommendation Summary</h2>
              <p className="text-blue-100 leading-relaxed">{results.summary}</p>
            </div>
          </div>
        </div>

        {/* Compare bar */}
        {compareIds.length > 0 && !showCompare && (
          <div className="mb-6 sticky top-16 z-40 bg-white border border-gray-200 rounded-xl p-4 shadow-lg flex items-center justify-between gap-4">
            <span className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{compareIds.length}</span> car{compareIds.length > 1 ? "s" : ""} selected
              {compareIds.length < 2 && " — select at least 2 to compare"}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCompareIds([])}
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5"
              >
                Clear
              </button>
              <button
                onClick={() => setShowCompare(true)}
                disabled={compareIds.length < 2}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  compareIds.length >= 2
                    ? "bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <GitCompareArrows className="w-4 h-4" />
                Compare Selected
              </button>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        {showCompare && compareCars.length >= 2 && (
          <div className="mb-10 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <GitCompareArrows className="w-5 h-5 text-[#2563EB]" />
                Side-by-Side Comparison
              </h3>
              <button
                onClick={() => setShowCompare(false)}
                className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-3 font-semibold text-gray-500 w-36">Spec</th>
                    {compareCars.map((car) => (
                      <th key={car.id} className="text-left px-4 py-3 font-bold text-gray-900 min-w-[180px]">
                        {car.make} {car.model}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    {
                      label: "Price",
                      render: (c: Car) => <span className="font-semibold text-gray-900">{c.priceExShowroom} Lakh</span>,
                    },
                    {
                      label: "Mileage",
                      render: (c: Car) => <>{c.fuelType === "Electric" ? `${c.mileage} km range` : `${c.mileage} kmpl`}</>,
                    },
                    {
                      label: "Engine",
                      render: (c: Car) => <>{c.fuelType === "Electric" ? "Electric Motor" : `${c.engineCC} cc`}</>,
                    },
                    { label: "Fuel", render: (c: Car) => <>{c.fuelType}</> },
                    { label: "Transmission", render: (c: Car) => <>{c.transmission}</> },
                    {
                      label: "Safety Rating",
                      render: (c: Car) => <SafetyStars rating={c.safetyRating} />,
                    },
                    { label: "Seating", render: (c: Car) => <>{c.seatingCapacity} seater</> },
                    {
                      label: "Key Features",
                      render: (c: Car) => (
                        <ul className="space-y-1">
                          {c.keyFeatures.map((f, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-[#2563EB] flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      ),
                    },
                  ].map((row) => (
                    <tr key={row.label} className="hover:bg-gray-50/50">
                      <td className="px-6 py-3 font-medium text-gray-500">{row.label}</td>
                      {compareCars.map((car) => (
                        <td key={car.id} className="px-4 py-3 text-gray-700">
                          {row.render(car)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recommendation Cards */}
        <div className="space-y-6">
          {results.recommendations.map((rec, index) => {
            const car = getCarData(rec.carId, carsData);
            const isExpanded = expandedCard === rec.carId;
            const isChecked = compareIds.includes(rec.carId);

            return (
              <div
                key={rec.carId}
                className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition-all hover:shadow-md ${
                  isChecked ? "border-[#2563EB]" : "border-gray-200"
                }`}
              >
                {/* Card header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-9 h-9 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{rec.carName}</h3>
                      {car && (
                        <p className="text-sm text-gray-500">{car.variant}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {car && (
                      <span className="text-lg font-bold text-gray-900">
                        &#8377;{car.priceExShowroom} Lakh
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 rounded-full">
                      <Star className="w-4 h-4 text-[#2563EB] fill-[#2563EB]" />
                      <span className="text-sm font-bold text-[#2563EB]">
                        {rec.matchScore}% Match
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key specs row */}
                {car && (
                  <div className="px-6 py-3 border-b border-gray-100 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-gray-400" />
                      {car.fuelType === "Electric"
                        ? `${car.mileage} km`
                        : `${car.mileage} kmpl`}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Fuel className="w-4 h-4 text-gray-400" />
                      {car.fuelType}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Cog className="w-4 h-4 text-gray-400" />
                      {car.transmission}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-gray-400" />
                      <SafetyStars rating={car.safetyRating} />
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-gray-400" />
                      {car.seatingCapacity} seater
                    </span>
                  </div>
                )}

                {/* Card body */}
                <div className="p-6 space-y-4">
                  {/* AI Reason */}
                  <p className="text-gray-700 leading-relaxed">{rec.reason}</p>

                  {/* Pros & Cons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <ThumbsUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-800">
                          Why it works for you
                        </span>
                      </div>
                      <ul className="space-y-1.5">
                        {rec.prosForUser.map((pro, i) => (
                          <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-green-500 flex-shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <ThumbsDown className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-semibold text-red-800">
                          Things to consider
                        </span>
                      </div>
                      <ul className="space-y-1.5">
                        {rec.consForUser.map((con, i) => (
                          <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Expandable key features */}
                  {car && (
                    <div>
                      <button
                        onClick={() =>
                          setExpandedCard(isExpanded ? null : rec.carId)
                        }
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            Hide key features
                            <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            Show key features
                            <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>
                      {isExpanded && (
                        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {car.keyFeatures.map((f, i) => (
                            <li
                              key={i}
                              className="text-sm text-gray-600 flex items-start gap-2"
                            >
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-[#2563EB] flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Footer actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCompare(rec.carId)}
                        disabled={!isChecked && compareIds.length >= 3}
                        className="w-4 h-4 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB]"
                      />
                      <span
                        className={`text-sm font-medium ${
                          !isChecked && compareIds.length >= 3
                            ? "text-gray-300"
                            : "text-gray-600"
                        }`}
                      >
                        Add to Compare
                      </span>
                    </label>
                    <Link
                      href={`/cars/${rec.carId}`}
                      className="inline-flex items-center text-sm font-medium text-[#2563EB] hover:underline"
                    >
                      View full details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartOver}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Start Over
          </button>
          <Link
            href="/cars"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#2563EB] rounded-lg hover:bg-[#1d4ed8] transition-colors"
          >
            Browse All Cars
          </Link>
        </div>
      </div>
    </div>
  );
}
