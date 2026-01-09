import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';

export default function FramingCalculator() {
  const [length, setLength] = useState('');
  const [spacing, setSpacing] = useState('16');

  const calculate = () => {
    const l = parseFloat(length) || 0;
    if (l === 0) return 0;
    
    // Convert length to inches, divide by spacing, add 1 for starter, plus potential corners/plates logic 
    // Basic formula: (Length * 12) / OC + 1
    const studs = Math.ceil((l * 12) / parseInt(spacing)) + 1;
    // Add typically 2 for corners/partition intersections per wall section for better estimate
    return studs + 2; 
  };

  const totalStuds = calculate();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Wall Length (ft)</Label>
        <Input 
          type="number" 
          value={length} 
          onChange={(e) => setLength(e.target.value)} 
          placeholder="e.g. 10"
        />
      </div>
      
      <div className="space-y-2">
        <Label>On-Center Spacing</Label>
        <RadioGroup defaultValue="16" value={spacing} onValueChange={setSpacing} className="flex gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="16" id="r16" />
            <Label htmlFor="r16">16" OC</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="24" id="r24" />
            <Label htmlFor="r24">24" OC</Label>
          </div>
        </RadioGroup>
      </div>

      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-sm text-slate-500 mb-1">Total Studs Required</div>
            <div className="text-3xl font-bold text-indigo-600">{totalStuds}</div>
            <div className="text-xs text-slate-400 mt-2">
              Includes +1 starter and +2 for corners
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}