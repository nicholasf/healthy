import { useState } from 'react';
import { getObservations, getSetting } from '../lib/commands';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Observations() {
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);

  const log = (msg: string) => setLogs(prev => [...prev, msg]);

  const handleGetObservations = async () => {
    setLoading(true);
    setText('');
    setLogs([]);

    try {
      const provider = await getSetting('api_provider') ?? 'openai';
      const model = await getSetting('api_model') ?? '(default)';
      log(`Provider: ${provider}  Model: ${model}`);
      log('Requesting observations...');

      const result = await getObservations();
      log('Done.');
      setText(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Observations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={handleGetObservations} disabled={loading}>
          {loading ? 'Getting Observations...' : 'Get Observations'}
        </Button>

        {logs.length > 0 && (
          <div className="rounded-md bg-black text-green-400 font-mono text-xs p-3 space-y-0.5 max-h-32 overflow-y-auto">
            {logs.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}

        {text && (
          <div className="rounded-md bg-muted p-4 text-sm whitespace-pre-wrap">
            {text}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
