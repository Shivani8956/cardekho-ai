import { NextRequest, NextResponse } from "next/server";
import { filterCars, CarFilters } from "@/lib/cars";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const sortBy = searchParams.get("sortBy");
  const validSortValues = ["price_asc", "price_desc", "mileage_desc", "safety_desc"];

  if (sortBy && !validSortValues.includes(sortBy)) {
    return NextResponse.json(
      { error: `Invalid sortBy value. Must be one of: ${validSortValues.join(", ")}` },
      { status: 400 }
    );
  }

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  if (minPrice && isNaN(Number(minPrice))) {
    return NextResponse.json({ error: "minPrice must be a number" }, { status: 400 });
  }

  if (maxPrice && isNaN(Number(maxPrice))) {
    return NextResponse.json({ error: "maxPrice must be a number" }, { status: 400 });
  }

  const filters: CarFilters = {
    brand: searchParams.get("brand") || undefined,
    bodyType: searchParams.get("bodyType") || undefined,
    fuelType: searchParams.get("fuelType") || undefined,
    transmission: searchParams.get("transmission") || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sortBy: sortBy as CarFilters["sortBy"],
  };

  const cars = filterCars(filters);

  return NextResponse.json({ count: cars.length, cars });
}
