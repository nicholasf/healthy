import { useState, useEffect } from 'react';
import { getSetting, setSetting } from '../lib/commands';

export function useSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      setLoading(true);
      // Load the required settings
      const apiUrl = await getSetting('api_url');
      const apiToken = await getSetting('api_token');
      const apiModel = await getSetting('api_model');
      
      setSettings({
        api_url: apiUrl || '',
        api_token: apiToken || '',
        api_model: apiModel || ''
      });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      await setSetting(key, value);
      // Update the local state
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));
    } catch (error) {
      console.error('Failed to set setting:', error);
      throw error;
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    settings,
    setSetting: updateSetting,
    loading
  };
}