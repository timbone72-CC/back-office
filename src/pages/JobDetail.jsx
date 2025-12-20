import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useLocation, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, 
  Briefcase, 
  CheckCircle, 
  Clock, 
  User, 
  DollarSign, 
  ShoppingBag,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function JobDetail() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const jobId = urlParams.get('id');

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      if (!jobId) return null;
      try {
        const res = await base44.entities.Job.filter({ id: jobId });
        return res && res.length > 0 ? res[0] : null;
      } catch (e) {
        console.error("Error fetching job:", e);
        return null;
      }
    },
    enabled: !!jobId
  });

  const { data: client } = useQuery({
    queryKey: ['client', job?.client_profile_id],
    queryFn: async () => {
      if (!job?.client_profile_id) return null;
      const res = await base44.entities.ClientProfile.filter({ id: job.client_profile_id });
      return res && res.length > 0 ? res[0] : null;
    },
    enabled: !!job?.client_profile_id
  });

  if (isLoading) return <div className="p-8"><Skeleton className="h-96 w-full" /></div>;
  if (!job) return <div className="p-8">Job not found.</div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link to={createPageUrl('Dashboard')}>
          <Button variant="ghost" size="icon" className="hover:bg-slate-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            {job.title}
          </h1>
          <p className="text-slate-500">Job ID: #{job.id.slice(-6)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-slate-500">Status</span>
                  <div>
                    <Badge className={
                      job.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      job.status === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-700'
                    }>
                      {job.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-slate-500">Budget</span>
                  <div className="text-xl font-bold text-slate-900 flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    {job.budget?.toLocaleString()}
                  </div>
                </div>
              </div>

              {job.scoping_notes && (
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Scoping Notes
                  </h4>
                  <p className="text-sm text-amber-800">{job.scoping_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-slate-500" />
                Material List
              </CardTitle>
            </CardHeader>
            <CardContent>
              {job.material_list?.length > 0 ? (
                <div className="space-y-4">
                  {job.material_list.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0 border-slate-100">
                      <div>
                        <div className="font-medium text-slate-900">{item.description}</div>
                        <div className="text-xs text-slate-500">
                          {item.supplier_name || 'Unknown Supplier'} • Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="font-medium text-slate-700">
                        ${(item.total || 0).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">No materials listed for this job.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Details</CardTitle>
            </CardHeader>
            <CardContent>
              {client ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{client.name}</div>
                      <div className="text-xs text-slate-500">Client</div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <span className="font-medium">{client.phone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Email:</span>
                      <span className="font-medium truncate max-w-[150px]">{client.email || 'N/A'}</span>
                    </div>
                    <div className="block mt-2">
                      <span className="text-slate-500 block mb-1">Address:</span>
                      <span className="font-medium">{client.address || 'N/A'}</span>
                    </div>
                  </div>
                  <Link to={`${createPageUrl('ClientDetail')}?id=${client.id}`}>
                    <Button variant="outline" className="w-full mt-4">View Profile</Button>
                  </Link>
                </div>
              ) : (
                <p className="text-slate-500">No client linked.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}