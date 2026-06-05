import { useEntries } from '../hooks/useEntries';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function History() {
  const { entries, deleteEntry, loading } = useEntries();

  if (loading) {
    return <div className="text-center py-4">Loading entries...</div>;
  }

  if (entries.length === 0) {
    return <div className="text-center py-4 text-gray-500">No entries yet.</div>;
  }

  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Weight (kg)</TableHead>
                <TableHead>Systolic</TableHead>
                <TableHead>Diastolic</TableHead>
                <TableHead>Energy</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.time}</TableCell>
                  <TableCell>{entry.weightKg ?? '-'}</TableCell>
                  <TableCell>{entry.bpSystolic ?? '-'}</TableCell>
                  <TableCell>{entry.bpDiastolic ?? '-'}</TableCell>
                  <TableCell>{entry.energyLevel ?? '-'}</TableCell>
                  <TableCell className="max-w-xs truncate">{entry.notes ?? '-'}</TableCell>
                  <TableCell>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteEntry(entry.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}