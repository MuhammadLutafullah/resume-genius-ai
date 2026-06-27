import api, { USE_MOCK } from "./api";
import { Patient, PatientInput, generateSeed } from "@/utils/seed";
import { calculateBMI, getWeightCategory } from "@/utils/bmi";

/**
 * Patient service.
 *
 * By default this uses an in-browser mock data layer (localStorage) so the app
 * works in preview without a running backend. When VITE_API_URL is set, the
 * same functions call your FastAPI backend through the centralized Axios instance.
 */

const STORAGE_KEY = "pms-patients";

function delay<T>(value: T, ms = 450): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function load(): Patient[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as Patient[];
    } catch {
      /* fall through */
    }
  }
  const seed = generateSeed(24);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

function persist(list: Patient[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function enrich(input: PatientInput): Omit<Patient, "id" | "created_at"> {
  const bmi = calculateBMI(input.weight, input.height);
  return { ...input, bmi, weight_category: getWeightCategory(bmi) };
}

export const patientService = {
  async getAll(): Promise<Patient[]> {
    if (USE_MOCK) return delay(load());
    const { data } = await api.get<Patient[]>("/patients");
    return data;
  },

  async getById(id: string): Promise<Patient> {
    if (USE_MOCK) {
      const found = load().find((p) => p.id === id);
      if (!found) throw new Error("Patient not found");
      return delay(found);
    }
    const { data } = await api.get<Patient>(`/patients/${id}`);
    return data;
  },

  async create(input: PatientInput): Promise<Patient> {
    if (USE_MOCK) {
      const list = load();
      const patient: Patient = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        ...enrich(input),
      };
      const next = [patient, ...list];
      persist(next);
      return delay(patient);
    }
    const { data } = await api.post<Patient>("/patients", enrich(input));
    return data;
  },

  async update(id: string, input: PatientInput): Promise<Patient> {
    if (USE_MOCK) {
      const list = load();
      const idx = list.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error("Patient not found");
      const updated: Patient = { ...list[idx], ...enrich(input) };
      list[idx] = updated;
      persist(list);
      return delay(updated);
    }
    const { data } = await api.put<Patient>(`/patients/${id}`, enrich(input));
    return data;
  },

  async remove(id: string): Promise<void> {
    if (USE_MOCK) {
      persist(load().filter((p) => p.id !== id));
      return delay(undefined);
    }
    await api.delete(`/patients/${id}`);
  },
};
