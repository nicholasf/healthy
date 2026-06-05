import { useState, useEffect } from 'react';
import { getEntries, addEntry, deleteEntry } from '../lib/commands';
import type { Entry } from '../types';

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      setLoading(true);
      const data = await getEntries();
      setEntries(data);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNewEntry = async (
    date: string,
    time: string,
    weightKg?: number | null,
    bpSystolic?: number | null,
    bpDiastolic?: number | null,
    energyLevel?: number | null,
    notes?: string | null
  ) => {
    try {
      const newEntry = await addEntry(date, time, weightKg, bpSystolic, bpDiastolic, energyLevel, notes);
      // Refresh the list to include the new entry
      await refresh();
      return newEntry;
    } catch (error) {
      console.error('Failed to add entry:', error);
      throw error;
    }
  };

  const removeEntry = async (id: number) => {
    try {
      await deleteEntry(id);
      // Refresh the list to remove the deleted entry
      await refresh();
    } catch (error) {
      console.error('Failed to delete entry:', error);
      throw error;
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    entries,
    addEntry: addNewEntry,
    deleteEntry: removeEntry,
    refresh,
    loading
  };
}