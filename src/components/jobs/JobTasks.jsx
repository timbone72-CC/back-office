import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function JobTasks({ tasks, onUpdate }) {
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    const task = {
      id: Date.now().toString(),
      description: newTask,
      completed: false
    };
    onUpdate([...(tasks || []), task]);
    setNewTask('');
  };

  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    onUpdate(updatedTasks);
  };

  const removeTask = (taskId) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    onUpdate(updatedTasks);
  };

  const completedCount = tasks?.filter(t => t.completed).length || 0;
  const totalCount = tasks?.length || 0;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckSquare className="w-5 h-5 text-indigo-600" />
            Punch List
          </CardTitle>
          <span className="text-sm font-medium text-slate-500">
            {completedCount}/{totalCount} Done
          </span>
        </div>
        {totalCount > 0 && (
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-green-500 h-full transition-all duration-300" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input 
            placeholder="Add new task..." 
            value={newTask} 
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <Button onClick={handleAddTask} size="icon" className="bg-indigo-600 shrink-0">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          {tasks?.length === 0 && (
            <p className="text-center text-slate-400 py-8 text-sm italic">
              No tasks yet. Add items to your punch list.
            </p>
          )}
          {tasks?.map(task => (
            <div 
              key={task.id} 
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-all",
                task.completed ? "bg-slate-50 border-slate-100" : "bg-white border-slate-200 hover:border-indigo-200"
              )}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button onClick={() => toggleTask(task.id)} className="shrink-0 text-slate-400 hover:text-green-600 transition-colors">
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <span className={cn("text-sm truncate", task.completed && "text-slate-400 line-through")}>
                  {task.description}
                </span>
              </div>
              <button 
                onClick={() => removeTask(task.id)}
                className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}