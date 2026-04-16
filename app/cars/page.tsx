"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Star,
  Gauge,
  Fuel,
  Cog,
  FilterX,
  CarFront,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Car } from "@/lib/types";
import CarDetailModal from "@/components/CarDetailModal";

const brands = [
  "BMW",
  "Honda",
  "Hyundai",
  "Kia",
  "MG",
  "Mahindra",
  "Maruti Suzuki",
  "Mercedes-Benz",
  "Skoda",
  "Tata",
  "Toyota",
  "Volkswagen",
];

const bodyTypes = ["SUV", "Sedan", "Hatchback", "MPV"];
const fuelTypes = ["Petrol", "Diesel", "Electric", "CNG", "Hybrid"];

const priceRanges = [
  { label: "Under 8L", min: 0, max: 8 },
  { label: "8-15L", min: 8, max: 15 },
  { label: "15-25L", min: 15, max: 25 },
  { label: "25L+", min: 25, max: undefined },
];

const sortOptions = [
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Best Mileage", value: "mileage_desc" },
  { label: "Best Safety", value: "safety_desc" },
];

function SafetyStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-5 bg-gray-200 rounded w-2/3" />
        <div className="h-5 bg-gray-200 rounded w-16" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-5 bg-gray-200 rounded-full w-14" />
        <div className="h-5 bg-gray-200 rounded-full w-14" />
        <div className="h-5 bg-gray-200 rounded-full w-16" />
      </div>
      <div className="flex gap-4 mb-3">
        <div className="h-3.5 bg-gray-100 rounded w-16" />
        <div className="h-3.5 bg-gray-100 rounded w-14" />
        <div className="h-3.5 bg-gray-100 rounded w-12" />
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-3.5 h-3.5 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (brand) params.set("brand", brand);
    if (bodyType) params.set("bodyType", bodyType);
    if (fuelType) params.set("fuelType", fuelType);
    if (sortBy) params.set("sortBy", sortBy);

    if (priceRange) {
      const range = priceRanges.find((r) => r.label === priceRange);
      if (range) {
        params.set("minPrice", String(range.min));
        if (range.max !== undefined) params.set("maxPrice", String(range.max));
      }
    }

    try {
      const res = await fetch(`/api/cars?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch cars");
      const data = await res.json();
      setCars(data.cars || []);
    } catch {
      setError("Failed to load cars. Please check your connection and try again.");
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, [brand, bodyType, fuelType, priceRange, sortBy]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const clearFilters = () => {
    setSearch("");
    setBrand("");
    setBodyType("");
    setFuelType("");
    setPriceRange("");
    setSortBy("");
  };

  const hasFilters = search || brand || bodyType || fuelType || priceRange || sortBy;

  const filteredCars = search
    ? cars.filter((car) => {
        const q = search.toLowerCase();
        return (
          car.make.toLowerCase().includes(q) ||
          car.model.toLowerCase().includes(q) ||
          car.variant.toLowerCase().includes(q) ||
          `${car.make} ${car.model}`.toLowerCase().includes(q)
        );
      })
    : cars;

  const selectClass =
    "w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent appearance-none cursor-pointer";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse All Cars</h1>
          <p className="mt-1 text-gray-500">
            Explore our database of 50+ cars from top Indian brands
          </p>
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6 shadow-sm">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by car name, brand or model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
            />
          </div>

          {/* Dropdowns row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className={selectClass}>
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <select value={bodyType} onChange={(e) => setBodyType(e.target.value)} className={selectClass}>
              <option value="">All Body Types</option>
              {bodyTypes.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className={selectClass}>
              <option value="">All Fuel Types</option>
              {fuelTypes.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>

            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className={selectClass}>
              <option value="">Any Price</option>
              {priceRanges.map((r) => (
                <option key={r.label} value={r.label}>{r.label}</option>
              ))}
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClass}>
              <option value="">Sort By</option>
              {sortOptions.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Clear filters */}
          {hasFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
              >
                <FilterX className="w-4 h-4" />
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Something went wrong
            </h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={fetchCars}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#2563EB] rounded-lg hover:bg-[#1d4ed8] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        )}

        {/* Results count */}
        {!error && (
          <div className="mb-4 text-sm font-medium text-gray-600">
            {loading ? (
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
            ) : (
              <>{filteredCars.length} cars found</>
            )}
          </div>
        )}

        {/* Car grid */}
        {!error && loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {!error && !loading && filteredCars.length === 0 && (
          <div className="text-center py-20">
            <CarFront className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No cars found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters to see more results.
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#2563EB] rounded-lg hover:bg-[#1d4ed8] transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {!error && !loading && filteredCars.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCars.map((car) => (
              <button
                key={car.id}
                onClick={() => setSelectedCar(car)}
                className="bg-white rounded-2xl border border-gray-200 p-5 text-left hover:shadow-lg hover:border-gray-300 transition-all group"
              >
                {/* Name & price */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors">
                    {car.make} {car.model}
                  </h3>
                  <span className="text-base font-bold text-gray-900 whitespace-nowrap">
                    &#8377;{car.priceExShowroom}L
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{car.variant}</p>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="px-2 py-0.5 bg-blue-50 text-[#2563EB] text-xs font-medium rounded-full">
                    {car.bodyType}
                  </span>
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                    {car.fuelType}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    {car.transmission}
                  </span>
                </div>

                {/* Specs row */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5" />
                    {car.fuelType === "Electric"
                      ? `${car.mileage} km`
                      : `${car.mileage} kmpl`}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5" />
                    {car.fuelType === "Electric" ? "EV" : `${car.engineCC}cc`}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Cog className="w-3.5 h-3.5" />
                    {car.transmission}
                  </span>
                </div>

                {/* Safety stars */}
                <div className="mt-3 flex items-center gap-2">
                  <SafetyStars rating={car.safetyRating} />
                  <span className="text-xs text-gray-400">
                    {car.safetyRating}/5
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedCar && (
        <CarDetailModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
        />
      )}
    </div>
  );
}
