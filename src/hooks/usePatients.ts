import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { patientService } from "@/services/patientService";
import { Patient, PatientInput } from "@/utils/seed";

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await patientService.getAll();
      setPatients(data);
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const createPatient = async (input: PatientInput) => {
    const created = await patientService.create(input);
    setPatients((prev) => [created, ...prev]);
    return created;
  };

  const updatePatient = async (id: string, input: PatientInput) => {
    const updated = await patientService.update(id, input);
    setPatients((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const deletePatient = async (id: string) => {
    await patientService.remove(id);
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  return { patients, loading, error, fetchPatients, createPatient, updatePatient, deletePatient };
}

export function usePatient(id: string | undefined) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    patientService
      .getById(id)
      .then((p) => active && setPatient(p))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  return { patient, loading, error };
}
