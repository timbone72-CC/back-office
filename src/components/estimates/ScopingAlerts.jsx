import React, { useMemo } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';

export default function ScopingAlerts({ items }) {
  const alerts = useMemo(() => {
    const activeAlerts = [];
    const text = items.map(i => i.description?.toLowerCase() || '').join(' ');

    if (text.includes('drywall') || text.includes('sheetrock') || text.includes('plaster')) {
      activeAlerts.push({
        id: 'drywall',
        title: 'Drywall Scope Detected',
        message: 'REMINDER: Perform a "Tap Test" to check for hidden water damage or rot before finalizing the bid.'
      });
    }

    if (text.includes('plumbing') || text.includes('pipe') || text.includes('faucet') || text.includes('leak') || text.includes('valve')) {
      activeAlerts.push({
        id: 'plumbing',
        title: 'Plumbing Scope Detected',
        message: 'REMINDER: Verify the integrity of all shut-off valves (main and local) before touching any piping.'
      });
    }

    return activeAlerts;
  }, [items]);

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3 mb-6 animate-in slide-in-from-top-2 duration-300">
      {alerts.map(alert => (
        <Alert key={alert.id} className="bg-amber-50 border-amber-200 text-amber-900 shadow-sm">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <div className="ml-2">
            <AlertTitle className="text-amber-800 font-semibold mb-1">{alert.title}</AlertTitle>
            <AlertDescription className="text-amber-700">
                {alert.message}
            </AlertDescription>
          </div>
        </Alert>
      ))}
    </div>
  );
}