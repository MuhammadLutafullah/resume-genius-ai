import { calculateBMI, getWeightCategory } from "./bmi";

export type Gender = "Male" | "Female" | "Other";

export type Patient = {
  id: string;
  patient_id: string;
  name: string;
  age: number;
  gender: Gender;
  city: string;
  height: number; // cm
  weight: number; // kg
  email?: string;
  bmi: number;
  weight_category: string;
  created_at: string;
};

export type PatientInput = Omit<Patient, "id" | "bmi" | "weight_category" | "created_at">;

const CITIES = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "San Diego", "Austin", "Seattle"];
const FIRST = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "David", "Elizabeth", "Aisha", "Omar", "Wei", "Sofia", "Liam", "Noah", "Emma", "Olivia", "Ava", "Lucas"];
const LAST = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Khan", "Chen", "Patel", "Nguyen", "Lopez"];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildPatient(i: number): Patient {
  const gender: Gender = Math.random() > 0.5 ? "Male" : "Female";
  const name = `${rand(FIRST)} ${rand(LAST)}`;
  const height = 150 + Math.floor(Math.random() * 45); // 150-195 cm
  const weight = 48 + Math.floor(Math.random() * 60); // 48-108 kg
  const bmi = calculateBMI(weight, height);
  const created = new Date(Date.now() - Math.floor(Math.random() * 60) * 86400000);
  return {
    id: crypto.randomUUID(),
    patient_id: `PT-${String(1000 + i)}`,
    name,
    age: 18 + Math.floor(Math.random() * 60),
    gender,
    city: rand(CITIES),
    height,
    weight,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    bmi,
    weight_category: getWeightCategory(bmi),
    created_at: created.toISOString(),
  };
}

export function generateSeed(count = 24): Patient[] {
  return Array.from({ length: count }, (_, i) => buildPatient(i + 1));
}

export { CITIES };
