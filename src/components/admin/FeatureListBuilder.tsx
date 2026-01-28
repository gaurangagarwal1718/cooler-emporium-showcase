import { useState } from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

export interface ProductFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

interface FeatureListBuilderProps {
  features: ProductFeature[];
  onChange: (features: ProductFeature[]) => void;
}

const generateId = () => `feat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export function FeatureListBuilder({ features, onChange }: FeatureListBuilderProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addFeature = () => {
    const newFeature: ProductFeature = {
      id: generateId(),
      title: '',
      description: '',
      icon: '✨',
      order: features.length + 1,
    };
    onChange([...features, newFeature]);
    setExpandedId(newFeature.id);
  };

  const updateFeature = (id: string, updates: Partial<ProductFeature>) => {
    onChange(features.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeFeature = (id: string) => {
    onChange(features.filter(f => f.id !== id).map((f, i) => ({ ...f, order: i + 1 })));
  };

  const moveFeature = (id: string, direction: 'up' | 'down') => {
    const index = features.findIndex(f => f.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === features.length - 1)
    ) {
      return;
    }

    const newFeatures = [...features];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newFeatures[index], newFeatures[targetIndex]] = [newFeatures[targetIndex], newFeatures[index]];
    onChange(newFeatures.map((f, i) => ({ ...f, order: i + 1 })));
  };

  return (
    <div className="space-y-3">
      {features.map((feature, index) => (
        <Card key={feature.id} className="border border-border">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <div className="flex flex-col gap-1 pt-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => moveFeature(feature.id, 'up')}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => moveFeature(feature.id, 'down')}
                  disabled={index === features.length - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Icon (emoji)"
                    value={feature.icon}
                    onChange={(e) => updateFeature(feature.id, { icon: e.target.value })}
                    className="w-16 text-center"
                  />
                  <Input
                    placeholder="Feature title (e.g., 4-Stage Purification)"
                    value={feature.title}
                    onChange={(e) => updateFeature(feature.id, { title: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removeFeature(feature.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <Textarea
                  placeholder="Feature description (e.g., Removes 99.9% of harmful contaminants)"
                  value={feature.description}
                  onChange={(e) => updateFeature(feature.id, { description: e.target.value })}
                  className="min-h-[60px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={addFeature}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Feature
      </Button>

      {features.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No features added yet. Click "Add Feature" to start.
        </p>
      )}
    </div>
  );
}
