import { NextRequest, NextResponse } from "next/server";
import { getCarById } from "@/lib/cars";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid car ID. Must be a number." },
      { status: 400 }
    );
  }

  const car = getCarById(id);

  if (!car) {
    return NextResponse.json(
      { error: `Car with ID ${id} not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json(car);
}
