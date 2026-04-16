import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAllCars } from "@/lib/cars";
import { Car } from "@/lib/types";

interface RecommendRequest {
  budget: string;
  bodyType: string;
  fuelType: string;
  priorities: string[];
  usage: string;
  familySize: number;
}

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

function parseBudgetRange(budget: string): { min: number; max: number } {
  const cleaned = budget.toLowerCase().replace(/lakhs?|lakh|rs\.?|₹|,|\s/g, "").trim();

  const rangeMatch = cleaned.match(/(\d+\.?\d*)-(\d+\.?\d*)/);
  if (rangeMatch) {
    return { min: parseFloat(rangeMatch[1]), max: parseFloat(rangeMatch[2]) };
  }

  const underMatch = cleaned.match(/under(\d+\.?\d*)|below(\d+\.?\d*)/);
  if (underMatch) {
    const val = parseFloat(underMatch[1] || underMatch[2]);
    return { min: 0, max: val };
  }

  const aboveMatch = cleaned.match(/above(\d+\.?\d*)|over(\d+\.?\d*)/);
  if (aboveMatch) {
    const val = parseFloat(aboveMatch[1] || aboveMatch[2]);
    return { min: val, max: 200 };
  }

  const singleNum = cleaned.match(/(\d+\.?\d*)/);
  if (singleNum) {
    const val = parseFloat(singleNum[1]);
    return { min: val * 0.8, max: val * 1.2 };
  }

  return { min: 0, max: 200 };
}

function filterCarsForRecommendation(
  cars: Car[],
  body: RecommendRequest
): Car[] {
  const { min, max } = parseBudgetRange(body.budget);

  let filtered = cars.filter(
    (car) => car.priceExShowroom >= min && car.priceExShowroom <= max
  );

  if (body.bodyType) {
    const byType = filtered.filter(
      (car) => car.bodyType.toLowerCase() === body.bodyType.toLowerCase()
    );
    if (byType.length >= 3) filtered = byType;
  }

  if (body.fuelType) {
    const byFuel = filtered.filter(
      (car) => car.fuelType.toLowerCase() === body.fuelType.toLowerCase()
    );
    if (byFuel.length >= 3) filtered = byFuel;
  }

  if (body.familySize > 5) {
    const sevenSeaters = filtered.filter((car) => car.seatingCapacity >= 7);
    if (sevenSeaters.length >= 2) filtered = sevenSeaters;
  }

  return filtered;
}

function buildPrompt(filteredCars: Car[], body: RecommendRequest): string {
  const carsContext = filteredCars.map((car) => ({
    id: car.id,
    name: `${car.make} ${car.model} ${car.variant}`,
    price: `${car.priceExShowroom} Lakh`,
    bodyType: car.bodyType,
    fuelType: car.fuelType,
    transmission: car.transmission,
    engineCC: car.engineCC,
    mileage: car.mileage,
    safetyRating: car.safetyRating,
    seatingCapacity: car.seatingCapacity,
    keyFeatures: car.keyFeatures,
    pros: car.pros,
    cons: car.cons,
    userReviewSummary: car.userReviewSummary,
  }));

  return `
User Preferences:
- Budget: ${body.budget}
- Preferred Body Type: ${body.bodyType || "No preference"}
- Preferred Fuel Type: ${body.fuelType || "No preference"}
- Priorities: ${body.priorities?.join(", ") || "Not specified"}
- Primary Usage: ${body.usage || "Not specified"}
- Family Size: ${body.familySize || "Not specified"}

Available Cars Data:
${JSON.stringify(carsContext, null, 2)}

Based on the user preferences and available cars above, recommend the top 3-5 best matching cars.

You MUST respond with ONLY valid JSON in this exact format, no markdown, no code blocks, no extra text:
{
  "summary": "A brief explanation of your recommendation logic",
  "recommendations": [
    {
      "carId": <number - the car's id from the data>,
      "carName": "<make and model>",
      "reason": "<why this car suits this specific user>",
      "prosForUser": ["<pro relevant to user's needs>", "<pro relevant to user's needs>", "<pro relevant to user's needs>"],
      "consForUser": ["<con relevant to user's needs>", "<con relevant to user's needs>"],
      "matchScore": <number 1-100>
    }
  ]
}`;
}

function getMockResponse(
  filteredCars: Car[],
  body: RecommendRequest
): RecommendResponse {
  const topCars = filteredCars.slice(0, Math.min(3, filteredCars.length));

  return {
    summary: `Based on your budget of ${body.budget} and preference for ${body.bodyType || "any"} type cars with ${body.fuelType || "any"} fuel, here are the best matches from our database. (Note: AI service unavailable — showing basic matches based on filters.)`,
    recommendations: topCars.map((car, index) => ({
      carId: car.id,
      carName: `${car.make} ${car.model}`,
      reason: `The ${car.make} ${car.model} fits your budget at ₹${car.priceExShowroom} Lakh with a safety rating of ${car.safetyRating}/5 stars and ${car.mileage} kmpl mileage.`,
      prosForUser: car.pros,
      consForUser: car.cons,
      matchScore: 90 - index * 10,
    })),
  };
}

export async function POST(request: NextRequest) {
  let body: RecommendRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body." },
      { status: 400 }
    );
  }

  if (!body.budget) {
    return NextResponse.json(
      { error: "budget is required." },
      { status: 400 }
    );
  }

  const allCars = getAllCars();
  const filteredCars = filterCarsForRecommendation(allCars, body);

  if (filteredCars.length === 0) {
    return NextResponse.json(
      {
        error: "No cars found matching your criteria. Try adjusting your budget or preferences.",
      },
      { status: 404 }
    );
  }

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

  if (!apiKey || apiKey === "placeholder") {
    const mockResponse = getMockResponse(filteredCars, body);
    return NextResponse.json(mockResponse);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        "You are an expert Indian car advisor. Based on the user's preferences and the available cars data, recommend the top 3-5 best matching cars. For each car, explain why it suits this specific user. Be specific about pros and cons relevant to their needs. Also give an overall summary of your recommendation logic. Respond with ONLY valid JSON, no markdown formatting.",
    });

    const prompt = buildPrompt(filteredCars, body);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleaned = responseText
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    const parsed: RecommendResponse = JSON.parse(cleaned);

    if (!parsed.summary || !Array.isArray(parsed.recommendations)) {
      throw new Error("Invalid response structure from Gemini");
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Gemini API error:", error);

    const mockResponse = getMockResponse(filteredCars, body);
    return NextResponse.json({
      ...mockResponse,
      _note: "AI service encountered an error. Showing basic recommendations.",
    });
  }
}
