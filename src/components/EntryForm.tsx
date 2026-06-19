import { useState, useEffect } from 'react';
import { useEntries } from '../hooks/useEntries';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function EntryForm({ onEntryAdded }: { onEntryAdded?: () => void }) {
  const { addEntry, entries } = useEntries();
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('');
  const [weightKg, setWeightKg] = useState<number | null>(null);
  const [bpSystolic, setBpSystolic] = useState<number | null>(null);
  const [bpDiastolic, setBpDiastolic] = useState<number | null>(null);
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Initialize time to current local time
  useEffect(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setTime(`${hours}:${minutes}`);
  }, []);

  // Auto-inherit from last entry if available
  useEffect(() => {
    if (entries.length > 0) {
      const lastEntry = entries[0]; // Most recent entry
      if (lastEntry.weightKg !== null) {
        setWeightKg(lastEntry.weightKg);
      }
      if (lastEntry.bpSystolic !== null) {
        setBpSystolic(lastEntry.bpSystolic);
      }
      if (lastEntry.bpDiastolic !== null) {
        setBpDiastolic(lastEntry.bpDiastolic);
      }
    }
  }, [entries]);

  // Convert 24-hour time to 12-hour format for storage
  const to12Hour = (time24: string): string => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await addEntry(
        date,
        to12Hour(time), // Convert to 12-hour format for storage
        weightKg,
        bpSystolic,
        bpDiastolic,
        energyLevel,
        notes
      );
      onEntryAdded?.();
      // Clear form on success
      setDate(new Date().toISOString().split('T')[0]);
      setTime('');
      setWeightKg(null);
      setBpSystolic(null);
      setBpDiastolic(null);
      setEnergyLevel(null);
      setNotes('');
    } catch (err) {
      setError('Failed to add entry. Please try again.');
      console.error('Error adding entry:', err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="weightKg">Weight (kg)</Label>
            <Input
              type="number"
              id="weightKg"
              step="0.1"
              value={weightKg ?? ''}
              onChange={(e) => setWeightKg(e.target.value ? parseFloat(e.target.value) : null)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bpSystolic">Systolic</Label>
              <Input
                type="number"
                id="bpSystolic"
                value={bpSystolic ?? ''}
                onChange={(e) => setBpSystolic(e.target.value ? parseInt(e.target.value) : null)}
              />
            </div>
            <div>
              <Label htmlFor="bpDiastolic">Diastolic</Label>
              <Input
                type="number"
                id="bpDiastolic"
                value={bpDiastolic ?? ''}
                onChange={(e) => setBpDiastolic(e.target.value ? parseInt(e.target.value) : null)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="energyLevel">Energy Level (0-5)</Label>
            <div className="flex gap-2 mt-2">
              {[0, 1, 2, 3, 4, 5].map((level) => (
                <Button
                  key={level}
                  variant={energyLevel === level ? "default" : "outline"}
                  onClick={(e) => {
                    e.preventDefault();
                    setEnergyLevel(level);
                  }}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit">Add Entry</Button>
        </form>
      </CardContent>
    </Card>
  );
}