import { useState } from 'react';
import { Plus, Trash2, Star, StarOff, GripVertical, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  order: number;
}

interface ImageManagerProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}

const generateId = () => `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export function ImageManager({ images, onChange }: ImageManagerProps) {
  const [newUrl, setNewUrl] = useState('');

  const addImage = () => {
    if (!newUrl.trim()) return;
    
    const newImage: ProductImage = {
      id: generateId(),
      url: newUrl.trim(),
      altText: '',
      isPrimary: images.length === 0,
      order: images.length + 1,
    };
    onChange([...images, newImage]);
    setNewUrl('');
  };

  const updateImage = (id: string, updates: Partial<ProductImage>) => {
    onChange(images.map(img => img.id === id ? { ...img, ...updates } : img));
  };

  const removeImage = (id: string) => {
    const newImages = images.filter(img => img.id !== id);
    // If removed image was primary, make first image primary
    if (images.find(img => img.id === id)?.isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }
    onChange(newImages.map((img, i) => ({ ...img, order: i + 1 })));
  };

  const setPrimaryImage = (id: string) => {
    onChange(images.map(img => ({ ...img, isPrimary: img.id === id })));
  };

  return (
    <div className="space-y-4">
      {/* Add Image Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Paste image URL (https://...)"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addImage()}
        />
        <Button type="button" onClick={addImage} disabled={!newUrl.trim()}>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image) => (
            <Card key={image.id} className={cn(
              "relative overflow-hidden",
              image.isPrimary && "ring-2 ring-primary"
            )}>
              <CardContent className="p-0">
                <div className="aspect-square relative bg-muted">
                  <img
                    src={image.url}
                    alt={image.altText || 'Product image'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  {image.isPrimary && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Primary
                    </div>
                  )}
                </div>
                <div className="p-2 space-y-2">
                  <Input
                    placeholder="Alt text for SEO"
                    value={image.altText}
                    onChange={(e) => updateImage(image.id, { altText: e.target.value })}
                    className="text-xs h-8"
                  />
                  <div className="flex gap-1">
                    {!image.isPrimary && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="flex-1 h-7 text-xs"
                        onClick={() => setPrimaryImage(image.id)}
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Set Primary
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-destructive hover:text-destructive"
                      onClick={() => removeImage(image.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            No images added. Paste image URLs above to add product images.
          </p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Tip: Use high-quality images (min 800x800px). The primary image will be shown on product cards.
      </p>
    </div>
  );
}
