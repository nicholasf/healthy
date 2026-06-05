import { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { exportCsv } from '../lib/commands';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  const { settings, setSetting, loading } = useSettings();
  const [apiUrl, setApiUrl] = useState<string>(settings.api_url || '');
  const [apiToken, setApiToken] = useState<string>(settings.api_token || '');
  const [apiModel, setApiModel] = useState<string>(settings.api_model || '');
  const [saved, setSaved] = useState<boolean>(false);
  const [exportPath, setExportPath] = useState<string | null>(null);

  useEffect(() => {
    setApiUrl(settings.api_url || '');
    setApiToken(settings.api_token || '');
    setApiModel(settings.api_model || '');
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await setSetting('api_url', apiUrl);
      await setSetting('api_token', apiToken);
      await setSetting('api_model', apiModel);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  const handleExportCsv = async () => {
    try {
      const path = await exportCsv();
      setExportPath(path);
    } catch (err) {
      console.error('Error exporting CSV:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading settings...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="apiUrl">API URL</Label>
            <Input
              type="text"
              id="apiUrl"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="apiToken">API Token</Label>
            <Input
              type="password"
              id="apiToken"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="apiModel">Model</Label>
            <Input
              type="text"
              id="apiModel"
              placeholder="gpt-4o-mini"
              value={apiModel}
              onChange={(e) => setApiModel(e.target.value)}
            />
          </div>

          <Button type="submit">Save Settings</Button>

          {saved && (
            <p className="text-sm text-green-600">Saved.</p>
          )}
        </form>

        <Separator className="my-4" />

        <div>
          <Button variant="outline" onClick={handleExportCsv}>
            Export CSV
          </Button>
          
          {exportPath && (
            <div className="mt-2 text-sm text-gray-600">
              Exported to: {exportPath}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}