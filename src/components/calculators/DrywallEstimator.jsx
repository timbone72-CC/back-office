import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

export default function DrywallEstimator() {
  const [length, setLength] = useState('');
  const [height, setHeight] = useState('');

  const calculate = () => {
    const l = parseFloat(length) || 0;
    const h = parseFloat(height) || 0;
    const area = l * h;
    const sheetArea = 32; // 4x8 sheet
    const rawSheets = area / sheetArea;
    const totalSheets = Math.ceil(rawSheets * 1.10); // +10% waste

    return { area, totalSheets };
  };

  const result = calculate();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Wall Length (ft)</Label>
          <Input 
            type="number" 
            value={length} 
            onChange={(e) => setLength(e.target.value)} 
            placeholder="e.g. 12"
          />
        </div>
        <div className="space-y-2">
          <Label>Wall Height (ft)</Label>
          <Input 
            type="number" 
            value={height} 
            onChange={(e) => setHeight(e.target.value)} 
            placeholder="e.g. 8"
          />
        </div>
      </div>
      
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-sm text-slate-500 mb-1">Total 4x8 Sheets Needed</div>
            <div className="text-3xl font-bold text-indigo-600">{result.totalSheets}</div>
            <div className="text-xs text-slate-400 mt-2">
              Includes 10% waste factor<br/>
              ({result.area.toFixed(1)} sq ft coverage)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}