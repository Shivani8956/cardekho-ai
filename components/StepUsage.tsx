import { Building2, Route, ArrowLeftRight, Users } from "lucide-react";

const usageOptions = [
  { label: "City Driving", value: "City Driving", icon: Building2 },
  { label: "Highway", value: "Highway", icon: Route },
  { label: "Both", value: "Both", icon: ArrowLeftRight },
];

const familyOptions = [
  { label: "1-2 Members", value: 2 },
  { label: "3-4 Members", value: 4 },
  { label: "5-7 Members", value: 7 },
];

interface StepUsageProps {
  usage: string;
  familySize: number;
  onUsageChange: (value: string) => void;
  onFamilyChange: (value: number) => void;
}

export default function StepUsage({
  usage,
  familySize,
  onUsageChange,
  onFamilyChange,
}: StepUsageProps) {
  return (
    <div className="space-y-10">
      {/* Usage pattern */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          How will you use the car?
        </h2>
        <p className="text-gray-500 mb-6">
          Tell us about your primary driving pattern
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {usageOptions.map((opt) => {
            const selected = usage === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onUsageChange(opt.value)}
                className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                  selected
                    ? "border-[#2563EB] bg-blue-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    selected ? "bg-[#2563EB] text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <opt.icon className="w-7 h-7" />
                </div>
                <span className="font-semibold text-gray-900 text-sm">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Family size */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Family size</h3>
        <p className="text-gray-500 mb-6">
          This helps us recommend the right seating capacity
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {familyOptions.map((opt) => {
            const selected = familySize === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onFamilyChange(opt.value)}
                className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all ${
                  selected
                    ? "border-[#2563EB] bg-blue-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center ${
                    selected ? "bg-[#2563EB] text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-semibold text-gray-900">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
