export interface Car {
  id: number;
  make: string;
  model: string;
  variant: string;
  priceExShowroom: number;
  bodyType: "SUV" | "Sedan" | "Hatchback" | "MPV" | "Coupe";
  fuelType: "Petrol" | "Diesel" | "CNG" | "Electric" | "Hybrid";
  transmission: "Manual" | "Automatic" | "AMT" | "CVT" | "DCT" | "IMT";
  engineCC: number;
  mileage: number;
  safetyRating: number;
  seatingCapacity: number;
  keyFeatures: string[];
  pros: string[];
  cons: string[];
  userReviewSummary: string;
}
