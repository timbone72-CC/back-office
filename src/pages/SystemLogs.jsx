import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  AlertTriangle, 
  Info, 
  XCircle, 
  Search, 
  RefreshCw,
  Activity,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

export default function SystemLogs() {
  const [severityFilter, setSeverityFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Fetch logs with sorting by newest first
  const { data: logs, isLoading, refetch } = useQuery({
    queryKey: ['system-logs'],
    queryFn: () => base44.entities.SystemLog.list('-created_date', 100),
    refetchInterval: 30000 // Auto-refresh every 30s
  });

  const filteredLogs = logs?.filter(log => {
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      log.message?.toLowerCase().includes(searchLower) || 
      log.source?.toLowerCase().includes(searchLower) ||
      log.details?.toLowerCase().includes(searchLower) ||
      log.user_email?.toLowerCase().includes(searchLower);
    
    return matchesSeverity && matchesSearch;
  }) || [];

  const getIcon = (severity) => {
    switch (severity) {
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getBadgeColor = (severity) => {
    switch (severity) {
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-600" />
            System Logs
          </h1>
          <p className="text-slate-500">Audit trail of system events, errors, and background processes.</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search logs..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="error">Errors Only</SelectItem>
                  <SelectItem value="warning">Warnings</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead className="w-[100px]">Level</TableHead>
                  <TableHead className="w-[150px]">Source</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="w-[150px]">User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      Loading logs...
                    </TableCell>
                  </TableRow>
                ) : filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      No logs found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-slate-50/50">
                      <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                        {format(new Date(log.created_date), 'MMM d, HH:mm:ss')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`flex w-fit items-center gap-1 ${getBadgeColor(log.severity)}`}>
                          {getIcon(log.severity)}
                          <span className="capitalize">{log.severity}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-slate-700 text-sm">
                        {log.source}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-slate-900">{log.message}</div>
                        {log.details && (
                          <div className="text-xs text-slate-500 mt-1 font-mono bg-slate-50 p-1.5 rounded border border-slate-100 max-w-xl overflow-x-auto">
                            {log.details}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {log.user_email || 'System'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}