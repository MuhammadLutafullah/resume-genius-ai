import { motion } from "framer-motion";
import { bmiScalePercent, getWeightCategory, categoryTone } from "@/utils/bmi";

const toneColor: Record<string, string> = {
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

export function BmiIndicator({ bmi }: { bmi: number }) {
  const pct = bmiScalePercent(bmi);
  const category = getWeightCategory(bmi);
  const color = toneColor[categoryTone(category)];

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <span className="text-sm text-muted-foreground">BMI</span>
        <span className="text-2xl font-bold text-foreground">{bmi}</span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>10</span>
        <span>18.5</span>
        <span>25</span>
        <span>30</span>
        <span>40</span>
      </div>
    </div>
  );
}
