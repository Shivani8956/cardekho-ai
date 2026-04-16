import { IndianRupee } from "lucide-react";

const budgetOptions = [
  { label: "Under 8 Lakh", value: "Under 8 Lakh", sub: "Hatchbacks & entry SUVs" },
  { label: "8-12 Lakh", value: "8-12 Lakh", sub: "Compact SUVs & sedans" },
  { label: "12-20 Lakh", value: "12-20 Lakh", sub: "Mid-range SUVs & sedans" },
  { label: "20-35 Lakh", value: "20-35 Lakh", sub: "Premium SUVs & sedans" },
  { label: "35 Lakh+", value: "Above 35 Lakh", sub: "Luxury segment" },
];

interface StepBudgetProps {
  value: string;
  onChange: (value: string) => void;
}

export default function StepBudget({ value, onChange }: StepBudgetProps) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        What&apos;s your budget?
      </h2>
      <p className="text-gray-500 mb-8">
        Select a price range for your new car (ex-showroom price)
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgetOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all ${
              value === opt.value
                ? "border-[#2563EB] bg-blue-50 shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <div
              className={`flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center ${
                value === opt.value ? "bg-[#2563EB] text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{opt.label}</div>
              <div className="text-sm text-gray-500">{opt.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
