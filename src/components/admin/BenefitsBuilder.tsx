import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface ProductBenefit {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: string;
}

interface BenefitsBuilderProps {
  benefits: ProductBenefit[];
  onChange: (benefits: ProductBenefit[]) => void;
}

const generateId = () => `benefit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const benefitCategories = [
  'For Health',
  'For Convenience',
  'For Savings',
  'For Style',
  'For Safety',
  'For Families',
  'Other',
];

export function BenefitsBuilder({ benefits, onChange }: BenefitsBuilderProps) {
  const addBenefit = () => {
    const newBenefit: ProductBenefit = {
      id: generateId(),
      category: 'For Health',
      title: '',
      description: '',
      icon: '✅',
    };
    onChange([...benefits, newBenefit]);
  };

  const updateBenefit = (id: string, updates: Partial<ProductBenefit>) => {
    onChange(benefits.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const removeBenefit = (id: string) => {
    onChange(benefits.filter(b => b.id !== id));
  };

  // Group benefits by category
  const groupedBenefits = benefits.reduce((acc, benefit) => {
    const category = benefit.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(benefit);
    return acc;
  }, {} as Record<string, ProductBenefit[]>);

  return (
    <div className="space-y-3">
      {benefits.map((benefit) => (
        <Card key={benefit.id} className="border border-border">
          <CardContent className="p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Icon"
                value={benefit.icon}
                onChange={(e) => updateBenefit(benefit.id, { icon: e.target.value })}
                className="w-16 text-center"
              />
              <Select
                value={benefit.category}
                onValueChange={(value) => updateBenefit(benefit.id, { category: value })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {benefitCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Benefit title"
                value={benefit.title}
                onChange={(e) => updateBenefit(benefit.id, { title: e.target.value })}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => removeBenefit(benefit.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              placeholder="Describe this benefit..."
              value={benefit.description}
              onChange={(e) => updateBenefit(benefit.id, { description: e.target.value })}
              className="min-h-[60px]"
            />
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={addBenefit}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Benefit
      </Button>

      {benefits.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No benefits added. Highlight what makes this product great for customers.
        </p>
      )}
    </div>
  );
}
