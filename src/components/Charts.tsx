import { useEntries } from '../hooks/useEntries';
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

export default function Charts() {
  const { entries, loading } = useEntries();

  if (loading) {
    return <div className="text-center py-4">Loading data...</div>;
  }

  if (entries.length === 0) {
    return <div className="text-center py-4 text-gray-500">No data to chart.</div>;
  }

  // Prepare data sorted by date
  const sortedEntries = [...entries]
    .filter(entry => entry.date) // Ensure date exists
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Weight chart data
  const weightData = sortedEntries
    .filter(entry => entry.weightKg !== null)
    .map(entry => ({
      datetime: entry.date + ' ' + entry.time,
      weight: entry.weightKg
    }));

  // Blood pressure chart data
  const bpData = sortedEntries
    .filter(entry => entry.bpSystolic !== null || entry.bpDiastolic !== null)
    .map(entry => ({
      datetime: entry.date + ' ' + entry.time,
      systolic: entry.bpSystolic,
      diastolic: entry.bpDiastolic
    }));

  // Energy level chart data
  const energyData = sortedEntries
    .filter(entry => entry.energyLevel !== null)
    .map(entry => ({
      datetime: entry.date + ' ' + entry.time,
      energy: entry.energyLevel
    }));

  return (
    <div className="space-y-8">
      {/* Weight Chart */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Weight Over Time</h3>
        {weightData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="datetime" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="weight" stroke="#3b82f6" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-4 text-gray-500">No weight data to display.</div>
        )}
      </div>

      {/* Blood Pressure Chart */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Blood Pressure Over Time</h3>
        {bpData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bpData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="datetime" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="systolic" stroke="#ef4444" name="Systolic" />
              <Line type="monotone" dataKey="diastolic" stroke="#10b981" name="Diastolic" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-4 text-gray-500">No blood pressure data to display.</div>
        )}
      </div>

      {/* Energy Level Chart */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Energy Level Over Time</h3>
        {energyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="datetime" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="energy" stroke="#8b5cf6" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-4 text-gray-500">No energy level data to display.</div>
        )}
      </div>
    </div>
  );
}