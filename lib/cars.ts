import carsData from "@/data/cars.json";
import { Car } from "./types";

const cars: Car[] = carsData as Car[];

export function getAllCars(): Car[] {
  return cars;
}

export function getCarById(id: number): Car | undefined {
  return cars.find((car) => car.id === id);
}

export interface CarFilters {
  brand?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price_asc" | "price_desc" | "mileage_desc" | "safety_desc";
}

export function filterCars(filters: CarFilters): Car[] {
  let result = [...cars];

  if (filters.brand) {
    const brand = filters.brand.toLowerCase();
    result = result.filter((car) => car.make.toLowerCase() === brand);
  }

  if (filters.bodyType) {
    const bodyType = filters.bodyType.toLowerCase();
    result = result.filter((car) => car.bodyType.toLowerCase() === bodyType);
  }

  if (filters.fuelType) {
    const fuelType = filters.fuelType.toLowerCase();
    result = result.filter((car) => car.fuelType.toLowerCase() === fuelType);
  }

  if (filters.transmission) {
    const transmission = filters.transmission.toLowerCase();
    result = result.filter(
      (car) => car.transmission.toLowerCase() === transmission
    );
  }

  if (filters.minPrice !== undefined) {
    result = result.filter((car) => car.priceExShowroom >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter((car) => car.priceExShowroom <= filters.maxPrice!);
  }

  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "price_asc":
        result.sort((a, b) => a.priceExShowroom - b.priceExShowroom);
        break;
      case "price_desc":
        result.sort((a, b) => b.priceExShowroom - a.priceExShowroom);
        break;
      case "mileage_desc":
        result.sort((a, b) => b.mileage - a.mileage);
        break;
      case "safety_desc":
        result.sort((a, b) => b.safetyRating - a.safetyRating);
        break;
    }
  }

  return result;
}
