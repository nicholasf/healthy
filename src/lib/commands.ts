import { invoke } from '@tauri-apps/api/core';
import type { Entry } from '../types';

export async function addEntry(
  date: string,
  time: string,
  weightKg?: number | null,
  bpSystolic?: number | null,
  bpDiastolic?: number | null,
  energyLevel?: number | null,
  notes?: string | null
): Promise<Entry> {
  return invoke('add_entry', { date, time, weightKg, bpSystolic, bpDiastolic, energyLevel, notes });
}

export async function getEntries(): Promise<Entry[]> {
  return invoke('get_entries');
}

export async function deleteEntry(id: number): Promise<void> {
  return invoke('delete_entry', { id });
}

export async function getSetting(key: string): Promise<string | null> {
  return invoke('get_setting', { key });
}

export async function setSetting(key: string, value: string): Promise<void> {
  return invoke('set_setting', { key, value });
}

export async function exportCsv(): Promise<string> {
  return invoke('export_csv');
}

export async function getObservations(): Promise<string> {
  return invoke('get_observations');
}