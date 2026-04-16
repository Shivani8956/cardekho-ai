import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Cars",
  description:
    "Explore 50+ cars from top Indian brands. Filter by brand, body type, fuel type, and price range.",
};

export default function CarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
