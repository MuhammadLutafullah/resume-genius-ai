export type WeightCategory = "Underweight" | "Normal" | "Overweight" | "Obese";

/** Calculate BMI from weight (kg) and height (cm). Returns rounded to 1 decimal. */
export function calculateBMI(weightKg: number, heightCm: number): number {
  if (!weightKg || !heightCm) return 0;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

/** Map a BMI value to a weight category. */
export function getWeightCategory(bmi: number): WeightCategory {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

/** Tailwind-friendly token name for category coloring. */
export function categoryTone(category: WeightCategory): "info" | "success" | "warning" | "destructive" {
  switch (category) {
    case "Underweight":
      return "info";
    case "Normal":
      return "success";
    case "Overweight":
      return "warning";
    case "Obese":
      return "destructive";
  }
}

/** Position of a BMI value on a 10-40 scale, clamped to 0-100%. */
export function bmiScalePercent(bmi: number): number {
  const min = 10;
  const max = 40;
  const pct = ((bmi - min) / (max - min)) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}
