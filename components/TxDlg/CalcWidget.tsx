// OriginalName: CalculatorWidget
// ShortName: CalcWidget

import { Button } from '../ui/button';
import {
  Collapsible,
  CollapsibleContent,
} from '../ui/collapsible';

interface CalcWidgetProps {
  open: boolean;
  display: string;
  onInput: (value: string) => void;
}

export function CalcWidget({ open, display, onInput }: CalcWidgetProps) {
  const calcButtons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '←', '=', '+'],
  ];

  return (
    <Collapsible open={open}>
      <CollapsibleContent>
        <div className="border rounded-lg p-3 space-y-2 bg-muted/30">
          <div className="bg-card p-3 rounded text-right font-mono text-lg border">
            {display}
          </div>
          <div className="grid grid-cols-4 gap-1">
            {calcButtons.flat().map((key) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={() => onInput(key)}
              >
                {key}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="col-span-4"
              onClick={() => onInput('C')}
            >
              Clear
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
