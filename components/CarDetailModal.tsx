"use client";

import {
  X,
  Gauge,
  Fuel,
  Cog,
  ShieldCheck,
  Users,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Wrench,
} from "lucide-react";
import { Car } from "@/lib/types";

interface CarDetailModalProps {
  car: Car;
  onClose: () => void;
}

function SafetyStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function CarDetailModal({ car, onClose }: CarDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {car.make} {car.model}
            </h2>
            <p className="text-sm text-gray-500">{car.variant}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Price & badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-2xl font-bold text-gray-900">
              &#8377;{car.priceExShowroom} Lakh
            </span>
            <span className="text-xs text-gray-500">(Ex-Showroom)</span>
            <div className="flex gap-2 ml-auto">
              <span className="px-2.5 py-1 bg-blue-100 text-[#2563EB] text-xs font-semibold rounded-full">
                {car.bodyType}
              </span>
              <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                {car.fuelType}
              </span>
            </div>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              {
                icon: Gauge,
                label: car.fuelType === "Electric" ? "Range" : "Mileage",
                value: car.fuelType === "Electric" ? `${car.mileage} km` : `${car.mileage} kmpl`,
              },
              {
                icon: Wrench,
                label: "Engine",
                value: car.fuelType === "Electric" ? "Electric Motor" : `${car.engineCC} cc`,
              },
              { icon: Fuel, label: "Fuel Type", value: car.fuelType },
              { icon: Cog, label: "Transmission", value: car.transmission },
              { icon: Users, label: "Seating", value: `${car.seatingCapacity} seater` },
              {
                icon: ShieldCheck,
                label: "Safety",
                value: `${car.safetyRating}/5 NCAP`,
              },
            ].map((spec) => (
              <div
                key={spec.label}
                className="bg-gray-50 rounded-xl p-3 flex items-center gap-3"
              >
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <spec.icon className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">{spec.label}</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {spec.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Safety stars visual */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Safety Rating:</span>
            <SafetyStars rating={car.safetyRating} />
          </div>

          {/* Key features */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3">
              Key Features
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {car.keyFeatures.map((f, i) => (
                <li
                  key={i}
                  className="text-sm text-gray-700 flex items-start gap-2"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <ThumbsUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-800">Pros</span>
              </div>
              <ul className="space-y-1.5">
                {car.pros.map((pro, i) => (
                  <li
                    key={i}
                    className="text-sm text-green-700 flex items-start gap-2"
                  >
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-green-500 flex-shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <ThumbsDown className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold text-red-800">Cons</span>
              </div>
              <ul className="space-y-1.5">
                {car.cons.map((con, i) => (
                  <li
                    key={i}
                    className="text-sm text-red-700 flex items-start gap-2"
                  >
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* User review */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">
                User Review Summary
              </span>
            </div>
            <p className="text-sm text-gray-600 italic leading-relaxed">
              &ldquo;{car.userReviewSummary}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
