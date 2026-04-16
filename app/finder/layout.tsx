import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Car Finder",
  description:
    "Tell us your budget, preferences, and needs — our AI analyzes 50+ cars to find your perfect match in seconds.",
};

export default function FinderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
