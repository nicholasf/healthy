import type { Entry } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function sortedByDate(entries: Entry[]) {
  return [...entries]
    .filter(e => e.date)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function WeightChart({ entries }: { entries: Entry[] }) {
  const data = sortedByDate(entries)
    .filter(e => e.weightKg !== null)
    .map(e => ({ datetime: `${e.date} ${e.time}`, weight: e.weightKg }));

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-full text-sm text-gray-500">No weight data to display.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="datetime" tick={{ fontSize: 11 }} />
        <YAxis domain={['auto', 'auto']} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="weight" stroke="#3b82f6" dot={false} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function BpChart({ entries }: { entries: Entry[] }) {
  const data = sortedByDate(entries)
    .filter(e => e.bpSystolic !== null || e.bpDiastolic !== null)
    .map(e => ({ datetime: `${e.date} ${e.time}`, systolic: e.bpSystolic, diastolic: e.bpDiastolic }));

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-full text-sm text-gray-500">No blood pressure data to display.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="datetime" tick={{ fontSize: 11 }} />
        <YAxis domain={['auto', 'auto']} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="systolic" stroke="#ef4444" name="Systolic" dot={false} />
        <Line type="monotone" dataKey="diastolic" stroke="#10b981" name="Diastolic" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function EnergyChart({ entries }: { entries: Entry[] }) {
  const data = sortedByDate(entries)
    .filter(e => e.energyLevel !== null)
    .map(e => ({ datetime: `${e.date} ${e.time}`, energy: e.energyLevel }));

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-full text-sm text-gray-500">No energy level data to display.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="datetime" tick={{ fontSize: 11 }} />
        <YAxis domain={[0, 5]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="energy" stroke="#8b5cf6" dot={false} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
