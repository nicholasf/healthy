import { useState } from 'react';
import { getObservations } from '../lib/commands';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Observations() {
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetObservations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getObservations();
      setText(result);
    } catch (err) {
      setError('Failed to get observations. Please try again.');
      console.error('Error getting observations:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Observations</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleGetObservations}
          disabled={loading}
        >
          {loading ? 'Getting Observations...' : 'Get Observations'}
        </Button>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {text && (
          <div className="mt-4 rounded-md bg-muted p-4 text-sm whitespace-pre-wrap">
            {text}
          </div>
        )}
      </CardContent>
    </Card>
  );
}