import { Car, CarFront, Truck, Bus, Blend } from "lucide-react";

const bodyTypes = [
  { label: "SUV", value: "SUV", icon: Truck },
  { label: "Sedan", value: "Sedan", icon: CarFront },
  { label: "Hatchback", value: "Hatchback", icon: Car },
  { label: "MPV", value: "MPV", icon: Bus },
  { label: "No Preference", value: "", icon: Blend },
];

interface StepBodyTypeProps {
  value: string;
  onChange: (value: string) => void;
}

export default function StepBodyType({ value, onChange }: StepBodyTypeProps) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        Preferred body type?
      </h2>
      <p className="text-gray-500 mb-8">
        Choose the car style that fits your lifestyle
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {bodyTypes.map((opt) => {
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
