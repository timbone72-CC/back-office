import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SpecSheet() {
  return (
    <ScrollArea className="h-[300px] w-full pr-4">
      <div className="space-y-4">
        <Card className="border-indigo-100 shadow-sm">
          <CardHeader className="py-3 bg-indigo-50/50">
            <CardTitle className="text-sm font-bold text-indigo-900">IRC Standards: Stairs</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 text-sm space-y-2">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-600">Max Riser Height</span>
              <span className="font-semibold">7 ¾ inches</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-600">Min Tread Depth</span>
              <span className="font-semibold">10 inches</span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-slate-600">Min Headroom</span>
              <span className="font-semibold">6 ft 8 in</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-indigo-100 shadow-sm">
          <CardHeader className="py-3 bg-indigo-50/50">
            <CardTitle className="text-sm font-bold text-indigo-900">IRC Standards: Decks</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 text-sm space-y-2">
            <div className="grid grid-cols-2 gap-2 text-slate-600 mb-2 font-medium">
              <span>Joist Spacing</span>
              <span>Max Span (Southern Pine)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 border-b border-slate-100 pb-2">
              <span>12" OC</span>
              <span>13 ft 8 in (2x8)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 border-b border-slate-100 pb-2">
              <span>16" OC</span>
              <span>11 ft 10 in (2x8)</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span>24" OC</span>
              <span>9 ft 8 in (2x8)</span>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-xs text-slate-400 italic text-center pt-2">
          * Always verify with local Elk City/Clinton building codes as they may vary from IRC.
        </div>
      </div>
    </ScrollArea>
  );
}