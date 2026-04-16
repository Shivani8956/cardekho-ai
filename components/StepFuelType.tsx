import { Fuel, Droplets, Zap, Flame, Blend } from "lucide-react";

const fuelTypes = [
  { label: "Petrol", value: "Petrol", icon: Fuel },
  { label: "Diesel", value: "Diesel", icon: Droplets },
  { label: "Electric", value: "Electric", icon: Zap },
  { label: "CNG", value: "CNG", icon: Flame },
  { label: "No Preference", value: "", icon: Blend },
];

interface StepFuelTypeProps {
  value: string;
  onChange: (value: string) => void;
}

export default function StepFuelType({ value, onChange }: StepFuelTypeProps) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        Preferred fuel type?
      </h2>
      <p className="text-gray-500 mb-8">
        Pick the fuel type that matches your driving needs
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {fuelTypes.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.label}
              onClick={() => onChange(opt.value)}
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
              <span className="font-semibold text-gray-900 text-sm">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
