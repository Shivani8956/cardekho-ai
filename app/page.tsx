import Link from "next/link";
import {
  MessageSquareText,
  BrainCircuit,
  ListChecks,
  Car,
  Building2,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    icon: MessageSquareText,
    title: "Tell Us Your Needs",
    description:
      "Share your budget, fuel preference, body type, and how you plan to use the car.",
  },
  {
    icon: BrainCircuit,
    title: "AI Analyzes 50+ Cars",
    description:
      "Our AI engine compares specs, features, safety ratings, and user reviews to find the best fit.",
  },
  {
    icon: ListChecks,
    title: "Get Your Shortlist",
    description:
      "Receive a personalized top 3-5 recommendation with match scores and detailed reasoning.",
  },
];

const stats = [
  { icon: Car, value: "50+", label: "Cars" },
  { icon: Building2, value: "10+", label: "Brands" },
  { icon: Sparkles, value: "AI", label: "Powered" },
];

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Find Your Perfect Car{" "}
              <span className="text-[#2563EB]">with AI</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed">
              Answer a few questions and our AI will analyze 50+ cars to find
              your ideal match — personalized recommendations in seconds.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/finder"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-[#2563EB] rounded-lg hover:bg-[#1d4ed8] transition-colors shadow-lg shadow-blue-500/25"
              >
                Start AI Car Finder
              </Link>
              <Link
                href="/cars"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Browse All Cars
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Three simple steps to your perfect car
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="mt-4 mb-5 flex justify-center">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                    <step.icon className="h-7 w-7 text-[#2563EB]" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-3">
                  <stat.icon className="h-8 w-8 text-[#2563EB]" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm sm:text-base text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} CarDekho AI. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
