import React, { useState, useEffect } from 'react';
import { Play, Square, Clock, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, differenceInMinutes, parseISO } from 'date-fns';

export default function JobTimeTracker({ job, onUpdate }) {
  const [elapsed, setElapsed] = useState(0);

  // Timer logic for active session
  useEffect(() => {
    let interval;
    if (job.active_timer_start) {
      const startTime = parseISO(job.active_timer_start);
      const updateElapsed = () => {
        setElapsed(differenceInMinutes(new Date(), startTime));
      };
      updateElapsed();
      interval = setInterval(updateElapsed, 60000); // Update every minute
    } else {
      setElapsed(0);
    }
    return () => clearInterval(interval);
  }, [job.active_timer_start]);

  const toggleTimer = () => {
    if (job.active_timer_start) {
      // Clock Out
      const start = parseISO(job.active_timer_start);
      const end = new Date();
      const duration = differenceInMinutes(end, start);
      
      const newLog = {
        id: Date.now().toString(),
        start_time: job.active_timer_start,
        end_time: end.toISOString(),
        duration_minutes: duration
      };

      onUpdate({
        active_timer_start: null,
        time_logs: [...(job.time_logs || []), newLog]
      });
    } else {
      // Clock In
      onUpdate({
        active_timer_start: new Date().toISOString()
      });
    }
  };

  const totalMinutes = (job.time_logs || []).reduce((acc, log) => acc + (log.duration_minutes || 0), 0) + (job.active_timer_start ? elapsed : 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-indigo-600" />
            Time Tracker
          </CardTitle>
          <div className="text-xl font-mono font-bold text-slate-900">
            {hours}h {minutes}m
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          className={`w-full h-12 text-lg font-medium gap-2 transition-all ${
            job.active_timer_start 
              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
              : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200'
          }`}
          onClick={toggleTimer}
        >
          {job.active_timer_start ? (
            <>
              <Square className="w-5 h-5 fill-current" />
              Clock Out (Active: {Math.floor(elapsed / 60)}h {elapsed % 60}m)
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              Clock In
            </>
          )}
        </Button>

        <div className="space-y-2 max-h-[200px] overflow-y-auto pt-2 border-t border-slate-100">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recent Logs</h4>
          {job.time_logs?.length === 0 && !job.active_timer_start && (
            <p className="text-slate-400 text-sm italic">No time logged yet.</p>
          )}
          {[...(job.time_logs || [])].reverse().map((log, idx) => (
            <div key={log.id || idx} className="flex justify-between text-sm py-1 border-b border-slate-50 last:border-0">
              <span className="text-slate-600">
                {format(parseISO(log.start_time), 'MMM d, h:mm a')} - {format(parseISO(log.end_time), 'h:mm a')}
              </span>
              <span className="font-mono text-slate-900 font-medium">
                {Math.floor(log.duration_minutes / 60)}h {log.duration_minutes % 60}m
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}