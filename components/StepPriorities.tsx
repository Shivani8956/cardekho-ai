import { Gauge, ShieldCheck, Settings, Award, Armchair, Rocket } from "lucide-react";

const priorityOptions = [
  { label: "Mileage", value: "Mileage", icon: Gauge },
  { label: "Safety", value: "Safety", icon: ShieldCheck },
  { label: "Features", value: "Features", icon: Settings },
  { label: "Brand Value", value: "Brand Value", icon: Award },
  { label: "Comfort", value: "Comfort", icon: Armchair },
  { label: "Performance", value: "Performance", icon: Rocket },
];

interface StepPrioritiesProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function StepPriorities({ value, onChange }: StepPrioritiesProps) {
  const toggle = (item: string) => {
    if (value.includes(item)) {
      onChange(value.filter((v) => v !== item));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        What matters most to you?
      </h2>
      <p className="text-gray-500 mb-8">
        Select one or more priorities — this helps the AI rank cars for you
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {priorityOptions.map((opt) => {
          const selected = value.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
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
              {selected && (
                <span className="text-xs font-medium text-[#2563EB]">Selected</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
