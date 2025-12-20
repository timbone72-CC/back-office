import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaintBucket, Info } from "lucide-react";

export default function PaintCalculator() {
  const [length, setLength] = useState("");
  const [height, setHeight] = useState("8");
  const [doors, setDoors] = useState("0");
  const [windows, setWindows] = useState("0");
  const [coats, setCoats] = useState("2");
  
  const [results, setResults] = useState({
    totalSqFt: 0,
    deductions: 0,
    netSqFt: 0,
    gallons: 0
  });

  useEffect(() => {
    const l = parseFloat(length) || 0;
    const h = parseFloat(height) || 0;
    const d = parseInt(doors) || 0;
    const w = parseInt(windows) || 0;
    const c = parseInt(coats) || 1;

    const totalArea = l * h;
    
    // Standard assumptions: Door = 21 sq ft (3x7), Window = 15 sq ft (3x5)
    const doorArea = d * 21;
    const windowArea = w * 15;
    const totalDeductions = doorArea + windowArea;
    
    const netArea = Math.max(0, totalArea - totalDeductions);
    
    // Standard coverage: 350 sq ft per gallon
    const gallonsNeeded = (netArea * c) / 350;

    setResults({
      totalSqFt: totalArea,
      deductions: totalDeductions,
      netSqFt: netArea,
      gallons: Math.ceil(gallonsNeeded * 10) / 10 // Round to 1 decimal place
    });
  }, [length, height, doors, windows, coats]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Wall Length (ft)</Label>
            <Input 
              type="number" 
              value={length} 
              onChange={(e) => setLength(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>Wall Height (ft)</Label>
            <Input 
              type="number" 
              value={height} 
              onChange={(e) => setHeight(e.target.value)}
              placeholder="8"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Doors (approx 21 sq ft)</Label>
            <Input 
              type="number" 
              value={doors} 
              onChange={(e) => setDoors(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>Windows (approx 15 sq ft)</Label>
            <Input 
              type="number" 
              value={windows} 
              onChange={(e) => setWindows(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-2">
            <Label>Number of Coats</Label>
            <Input 
              type="number" 
              value={coats} 
              onChange={(e) => setCoats(e.target.value)}
              min="1"
            />
        </div>
      </div>

      <Card className="bg-slate-50 border-indigo-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2 text-indigo-700">
            <PaintBucket className="w-5 h-5" />
            Estimate Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-end border-b border-slate-200 pb-2">
            <span className="text-sm text-slate-500">Gross Wall Area</span>
            <span className="font-mono font-medium">{results.totalSqFt.toFixed(1)} sq ft</span>
          </div>
          <div className="flex justify-between items-end border-b border-slate-200 pb-2 text-red-500">
            <span className="text-sm">Deductions (Openings)</span>
            <span className="font-mono font-medium">-{results.deductions.toFixed(1)} sq ft</span>
          </div>
          <div className="flex justify-between items-end border-b border-slate-200 pb-2">
            <span className="text-sm text-slate-500">Net Paintable Area</span>
            <span className="font-mono font-medium">{results.netSqFt.toFixed(1)} sq ft</span>
          </div>
          
          <div className="pt-2">
            <div className="text-sm text-slate-500 mb-1">Gallons Needed ({coats} coats)</div>
            <div className="text-4xl font-bold text-indigo-600 flex items-baseline gap-2">
              {results.gallons}
              <span className="text-base font-normal text-slate-500">gal</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Based on 350 sq ft/gal coverage
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}