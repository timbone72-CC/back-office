import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Briefcase,
  MapPin,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function JobDetail() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const jobId = urlParams.get('id');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      if (!jobId) return null;
      const res = await base44.entities.Job.filter({ id: jobId });
      return res && res.length > 0 ? res[0] : null;
    },
    enabled: !!jobId
  });

  const { data: client } = useQuery({
    queryKey: ['client', job?.client_profile_id],
    queryFn: async () => {
       const res = await base44.entities.ClientProfile.filter({ id: job.client_profile_id });
       return res && res.length > 0 ? res[0] : null;
    },
    enabled: !!job?.client_profile_id
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Job.update(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['job', jobId]);
      toast.success('Job updated');
    }
  });

  if (isLoading) return <div className="p-8"><Skeleton className="h-96 w-full" /></div>;
  if (!job) return <div className="p-8">Job not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('JobEstimates')}>
            <Button variant="ghost" size="icon" className="hover:bg-slate-100 rounded-full">
              <ArrowLeft className="w-5 h-5 text-slate-500" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              {job.title}
              <Badge className={job.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}>
                {job.status.toUpperCase()}
              </Badge>
            </h1>
            <p className="text-slate-500">Job #{jobId.slice(-6)} • Started {job.start_date}</p>
          </div>
        </div>
        
        {job.status === 'active' && (
          <Button 
            className="bg-green-600 hover:bg-green-700 gap-2"
            onClick={() => updateMutation.mutate({ ...job, status: 'completed' })}
          >
            <CheckCircle2 className="w-4 h-4" /> Mark Completed
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {job.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{item.description}</p>
                      <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Add execution notes..."
                value={job.notes || ''}
                onChange={(e) => updateMutation.mutate({ ...job, notes: e.target.value })}
                className="min-h-[150px]"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {client && (
             <Card>
               <CardHeader>
                 <CardTitle className="text-base">Client Details</CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                 <div className="font-medium text-slate-900">{client.name}</div>
                 {client.phone && (
                   <div className="flex items-center gap-2 text-sm text-slate-600">
                     <Phone className="w-4 h-4" /> {client.phone}
                   </div>
                 )}
                 {client.address && (
                   <div className="flex items-center gap-2 text-sm text-slate-600">
                     <MapPin className="w-4 h-4" /> {client.address}
                   </div>
                 )}
               </CardContent>
             </Card>
          )}

          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-500">Total Value</span>
                <span className="font-bold text-xl text-slate-900">${job.total_amount?.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}