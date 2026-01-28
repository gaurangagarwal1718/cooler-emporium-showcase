import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export interface ProductSpecification {
  id: string;
  label: string;
  value: string;
  unit: string;
}

interface SpecificationsBuilderProps {
  specifications: ProductSpecification[];
  onChange: (specifications: ProductSpecification[]) => void;
}

const generateId = () => `spec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const commonSpecs = [
  { label: 'Model Number', value: '', unit: '' },
  { label: 'Storage Capacity', value: '', unit: 'Liters' },
  { label: 'Power Consumption', value: '', unit: 'Watts' },
  { label: 'Dimensions (HxWxD)', value: '', unit: 'cm' },
  { label: 'Net Weight', value: '', unit: 'kg' },
  { label: 'Voltage', value: '230V, 50Hz', unit: '' },
];

export function SpecificationsBuilder({ specifications, onChange }: SpecificationsBuilderProps) {
  const addSpecification = () => {
    const newSpec: ProductSpecification = {
      id: generateId(),
      label: '',
      value: '',
      unit: '',
    };
    onChange([...specifications, newSpec]);
  };

  const addCommonSpecs = () => {
    const newSpecs = commonSpecs.map(spec => ({
      ...spec,
      id: generateId(),
    }));
    onChange([...specifications, ...newSpecs]);
  };

  const updateSpecification = (id: string, updates: Partial<ProductSpecification>) => {
    onChange(specifications.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removeSpecification = (id: string) => {
    onChange(specifications.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-3">
      {specifications.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {specifications.map((spec) => (
                <div key={spec.id} className="flex items-center gap-2 p-3">
                  <Input
                    placeholder="Specification name"
                    value={spec.label}
                    onChange={(e) => updateSpecification(spec.id, { label: e.target.value })}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Value"
                    value={spec.value}
                    onChange={(e) => updateSpecification(spec.id, { value: e.target.value })}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Unit (optional)"
                    value={spec.unit}
                    onChange={(e) => updateSpecification(spec.id, { unit: e.target.value })}
                    className="w-24"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
                    onClick={() => removeSpecification(spec.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 border-dashed"
          onClick={addSpecification}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Specification
        </Button>
        
        {specifications.length === 0 && (
          <Button
            type="button"
            variant="secondary"
            onClick={addCommonSpecs}
          >
            Add Common Specs
          </Button>
        )}
      </div>

      {specifications.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No specifications added. Add individual specs or use common templates.
        </p>
      )}
    </div>
  );
}
