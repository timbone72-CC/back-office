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
  FileText,
  Plus,
  Save,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import JobTasks from '@/components/jobs/JobTasks';
import JobTimeTracker from '@/components/jobs/JobTimeTracker';

export default function JobDetail() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const jobId = urlParams.get('id');
  const queryClient = useQueryClient();

  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [newItem, setNewItem] = useState({ description: '', quantity: 1, unit_cost: 0, supplier_name: '' });

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

  const updateJobMutation = useMutation({
    mutationFn: (data) => base44.entities.Job.update(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['job', jobId]);
      // Quiet success for small updates, or toast for big ones? 
      // Let's rely on UI updates for now, maybe small toast
    }
  });

  const handleTaskUpdate = (newTasks) => {
    updateJobMutation.mutate({ tasks: newTasks });
  };

  const handleTimeUpdate = (updates) => {
    updateJobMutation.mutate(updates);
  };

  const handleAddMaterial = () => {
    if (!newItem.description) return;
    
    const quantity = parseFloat(newItem.quantity) || 0;
    const unit_cost = parseFloat(newItem.unit_cost) || 0;
    const total = quantity * unit_cost;

    const itemToAdd = {
      description: newItem.description,
      quantity,
      unit_cost,
      total,
      supplier_name: newItem.supplier_name || 'Additional Order'
    };

    const updatedList = [...(job.material_list || []), itemToAdd];
    
    // Update budget if it's a change order (adding to total)
    // Assuming budget tracks total estimated cost
    const newBudget = (job.budget || 0) + total;

    updateJobMutation.mutate({ 
      material_list: updatedList,
      budget: newBudget
    }, {
      onSuccess: () => {
        toast.success('Change Order added to job');
        setIsAddMaterialOpen(false);
        setNewItem({ description: '', quantity: 1, unit_cost: 0, supplier_name: '' });
      }
    });
  };

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <JobTimeTracker job={job} onUpdate={handleTimeUpdate} />
            <JobTasks tasks={job.tasks} onUpdate={handleTaskUpdate} />
          </div>

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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-slate-500" />
                Material List
              </CardTitle>
              <Dialog open={isAddMaterialOpen} onOpenChange={setIsAddMaterialOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="w-4 h-4" /> Change Order
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Order / Add Material</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input 
                        value={newItem.description}
                        onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                        placeholder="e.g. Extra 2x4 Studs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input 
                          type="number"
                          value={newItem.quantity}
                          onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit Cost ($)</Label>
                        <Input 
                          type="number"
                          value={newItem.unit_cost}
                          onChange={(e) => setNewItem({...newItem, unit_cost: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Supplier (Optional)</Label>
                      <Input 
                        value={newItem.supplier_name}
                        onChange={(e) => setNewItem({...newItem, supplier_name: e.target.value})}
                        placeholder="Store Name"
                      />
                    </div>
                    <div className="bg-slate-50 p-3 rounded text-right font-bold text-indigo-600">
                      Total Impact: ${((parseFloat(newItem.quantity)||0) * (parseFloat(newItem.unit_cost)||0)).toFixed(2)}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddMaterial} className="bg-indigo-600 hover:bg-indigo-700">
                      Add Item & Update Budget
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                  <div className="pt-4 border-t border-slate-200 flex justify-between items-center font-bold text-slate-900">
                    <span>Total Materials</span>
                    <span>${job.material_list.reduce((sum, item) => sum + (item.total || 0), 0).toFixed(2)}</span>
                  </div>
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