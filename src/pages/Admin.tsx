import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Home, 
  Package, 
  FolderOpen, 
  LayoutDashboard,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronDown,
  ChevronRight,
  DollarSign,
  FileText,
  Star,
  Wrench,
  Lightbulb,
  ImageIcon,
  Tags,
  Eye,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useStore, Category, Product } from "@/hooks/useStore";
import { useToast } from "@/hooks/use-toast";
import AdminLoginModal from "@/components/admin/AdminLoginModal";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { FeatureListBuilder, ProductFeature } from "@/components/admin/FeatureListBuilder";
import { SpecificationsBuilder, ProductSpecification } from "@/components/admin/SpecificationsBuilder";
import { BenefitsBuilder, ProductBenefit } from "@/components/admin/BenefitsBuilder";
import { ImageManager, ProductImage } from "@/components/admin/ImageManager";
import { cn } from "@/lib/utils";

interface ProductFormData {
  name: string;
  headline: string;
  description: string;
  categoryId: string;
  mrp: string;
  discountedPrice: string;
  inStock: boolean;
  isFeatured: boolean;
  tags: string[];
  productFeatures: ProductFeature[];
  specifications: ProductSpecification[];
  benefits: ProductBenefit[];
  productImages: ProductImage[];
}

const initialProductForm: ProductFormData = {
  name: "",
  headline: "",
  description: "",
  categoryId: "",
  mrp: "",
  discountedPrice: "",
  inStock: true,
  isFeatured: false,
  tags: [],
  productFeatures: [],
  specifications: [],
  benefits: [],
  productImages: [],
};

const availableTags = ["New Arrival", "Best Seller", "Limited Offer", "Premium", "Sale"];

const Admin = () => {
  const { isAuthenticated, logout } = useAdminAuth();
  const { toast } = useToast();
  const { 
    categories, 
    products, 
    addCategory, 
    updateCategory, 
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    getCategoryProductCount,
    getCategoryById
  } = useStore();

  // Category state
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "", icon: "" });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Product state
  const [productForm, setProductForm] = useState<ProductFormData>(initialProductForm);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProductForm, setEditProductForm] = useState<ProductFormData>(initialProductForm);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [productStatusFilter, setProductStatusFilter] = useState("all");

  // Collapsible sections state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true,
    pricing: true,
    description: false,
    features: false,
    specifications: false,
    benefits: false,
    images: false,
    status: false,
  });

  // Auto-save draft
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cooler_emporium_product_draft");
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        setProductForm(draft);
        toast({ title: "Draft Restored", description: "Your previous draft has been restored." });
      } catch (e) {
        // Invalid draft
      }
    }
  }, []);

  useEffect(() => {
    if (productForm.name || productForm.description) {
      const timer = setTimeout(() => {
        setIsSaving(true);
        localStorage.setItem("cooler_emporium_product_draft", JSON.stringify(productForm));
        setLastSaved(new Date());
        setTimeout(() => setIsSaving(false), 500);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [productForm]);

  if (!isAuthenticated) {
    return <AdminLoginModal />;
  }

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Calculate discount percentage
  const calculateDiscount = (mrp: string, discounted: string) => {
    const mrpNum = parseFloat(mrp);
    const discountedNum = parseFloat(discounted);
    if (mrpNum && discountedNum && mrpNum > discountedNum) {
      return Math.round(((mrpNum - discountedNum) / mrpNum) * 100);
    }
    return 0;
  };

  // Category handlers
  const handleAddCategory = () => {
    if (!categoryForm.name.trim()) {
      toast({ title: "Error", description: "Category name is required", variant: "destructive" });
      return;
    }
    if (categories.some(c => c.name.toLowerCase() === categoryForm.name.toLowerCase())) {
      toast({ title: "Error", description: "Category already exists", variant: "destructive" });
      return;
    }
    addCategory({
      name: categoryForm.name,
      slug: "",
      description: categoryForm.description,
      icon: categoryForm.icon || "📦"
    });
    setCategoryForm({ name: "", description: "", icon: "" });
    toast({ title: "Success", description: "Category added successfully" });
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.name.trim()) return;
    updateCategory(editingCategory.id, {
      name: editingCategory.name,
      description: editingCategory.description,
      icon: editingCategory.icon
    });
    setEditingCategory(null);
    toast({ title: "Success", description: "Category updated successfully" });
  };

  const handleDeleteCategory = () => {
    if (!deletingCategory) return;
    deleteCategory(deletingCategory.id);
    setDeletingCategory(null);
    toast({ title: "Success", description: "Category deleted successfully" });
  };

  // Product handlers
  const handleAddProduct = () => {
    if (!productForm.name.trim() || !productForm.categoryId) {
      toast({ title: "Error", description: "Product name and category are required", variant: "destructive" });
      return;
    }
    
    const mrp = productForm.mrp ? parseFloat(productForm.mrp) : undefined;
    const discountedPrice = productForm.discountedPrice ? parseFloat(productForm.discountedPrice) : undefined;
    const discountPercentage = calculateDiscount(productForm.mrp, productForm.discountedPrice);

    addProduct({
      name: productForm.name,
      headline: productForm.headline,
      description: productForm.description,
      categoryId: productForm.categoryId,
      images: productForm.productImages.map(img => img.url),
      productImages: productForm.productImages,
      mrp,
      discountedPrice,
      discountPercentage,
      price: discountedPrice || mrp,
      inStock: productForm.inStock,
      isFeatured: productForm.isFeatured,
      features: productForm.productFeatures.map(f => f.title),
      productFeatures: productForm.productFeatures,
      specifications: productForm.specifications,
      benefits: productForm.benefits,
      tags: productForm.tags,
    });
    
    setProductForm(initialProductForm);
    localStorage.removeItem("cooler_emporium_product_draft");
    toast({ title: "Success", description: "Product added successfully" });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditProductForm({
      name: product.name,
      headline: product.headline || "",
      description: product.description,
      categoryId: product.categoryId,
      mrp: product.mrp?.toString() || "",
      discountedPrice: product.discountedPrice?.toString() || product.price?.toString() || "",
      inStock: product.inStock,
      isFeatured: product.isFeatured || false,
      tags: product.tags || [],
      productFeatures: product.productFeatures || [],
      specifications: product.specifications || [],
      benefits: product.benefits || [],
      productImages: product.productImages || product.images.map((url, i) => ({
        id: `img_${i}`,
        url,
        altText: "",
        isPrimary: i === 0,
        order: i + 1,
      })),
    });
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    
    const mrp = editProductForm.mrp ? parseFloat(editProductForm.mrp) : undefined;
    const discountedPrice = editProductForm.discountedPrice ? parseFloat(editProductForm.discountedPrice) : undefined;
    const discountPercentage = calculateDiscount(editProductForm.mrp, editProductForm.discountedPrice);

    updateProduct(editingProduct.id, {
      name: editProductForm.name,
      headline: editProductForm.headline,
      description: editProductForm.description,
      categoryId: editProductForm.categoryId,
      images: editProductForm.productImages.map(img => img.url),
      productImages: editProductForm.productImages,
      mrp,
      discountedPrice,
      discountPercentage,
      price: discountedPrice || mrp,
      inStock: editProductForm.inStock,
      isFeatured: editProductForm.isFeatured,
      features: editProductForm.productFeatures.map(f => f.title),
      productFeatures: editProductForm.productFeatures,
      specifications: editProductForm.specifications,
      benefits: editProductForm.benefits,
      tags: editProductForm.tags,
    });
    
    setEditingProduct(null);
    toast({ title: "Success", description: "Product updated successfully" });
  };

  const handleDeleteProduct = () => {
    if (!deletingProduct) return;
    deleteProduct(deletingProduct.id);
    setDeletingProduct(null);
    toast({ title: "Success", description: "Product deleted successfully" });
  };

  const handleDuplicateProduct = (product: Product) => {
    addProduct({
      ...product,
      name: `${product.name} (Copy)`,
    });
    toast({ title: "Success", description: "Product duplicated successfully" });
  };

  const toggleTag = (tag: string, isEdit = false) => {
    if (isEdit) {
      setEditProductForm(prev => ({
        ...prev,
        tags: prev.tags.includes(tag) 
          ? prev.tags.filter(t => t !== tag)
          : [...prev.tags, tag]
      }));
    } else {
      setProductForm(prev => ({
        ...prev,
        tags: prev.tags.includes(tag) 
          ? prev.tags.filter(t => t !== tag)
          : [...prev.tags, tag]
      }));
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategoryFilter === "all" || p.categoryId === productCategoryFilter;
    const matchesStatus = productStatusFilter === "all" || 
      (productStatusFilter === "inStock" && p.inStock) ||
      (productStatusFilter === "outOfStock" && !p.inStock) ||
      (productStatusFilter === "featured" && p.isFeatured);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getSectionSummary = (section: string) => {
    switch (section) {
      case "features":
        return productForm.productFeatures.length > 0 ? `${productForm.productFeatures.length} features` : "";
      case "specifications":
        return productForm.specifications.length > 0 ? `${productForm.specifications.length} specs` : "";
      case "benefits":
        return productForm.benefits.length > 0 ? `${productForm.benefits.length} benefits` : "";
      case "images":
        return productForm.productImages.length > 0 ? `${productForm.productImages.length} images` : "";
      default:
        return "";
    }
  };

  const CollapsibleSection = ({ 
    id, 
    title, 
    icon: Icon, 
    children 
  }: { 
    id: string; 
    title: string; 
    icon: React.ComponentType<{ className?: string }>; 
    children: React.ReactNode;
  }) => (
    <Collapsible open={openSections[id]} onOpenChange={() => toggleSection(id)}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Icon className="w-5 h-5 text-primary" />
                {title}
                {getSectionSummary(id) && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {getSectionSummary(id)}
                  </Badge>
                )}
              </CardTitle>
              {openSections[id] ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Cooler Emporium - Admin Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            {isSaving && (
              <span className="text-sm text-muted-foreground">Saving...</span>
            )}
            {lastSaved && !isSaving && (
              <span className="text-xs text-muted-foreground">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link to="/"><Home className="w-4 h-4 mr-2" /> Back to Website</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{categories.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{products.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{products.filter(p => p.inStock).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Featured</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{products.filter(p => p.isFeatured).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="products" className="gap-2">
              <Package className="w-4 h-4" /> Manage Products
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <FolderOpen className="w-4 h-4" /> Manage Categories
            </TabsTrigger>
          </TabsList>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            {/* Add Category Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" /> Add New Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label>Category Name *</Label>
                    <Input
                      placeholder="e.g., Air Conditioners"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="Brief description of category"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Icon (emoji)</Label>
                    <Input
                      placeholder="e.g., ❄️"
                      value={categoryForm.icon}
                      onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                    />
                  </div>
                </div>
                <Button className="mt-4" onClick={handleAddCategory}>
                  <Plus className="w-4 h-4 mr-2" /> Add Category
                </Button>
              </CardContent>
            </Card>

            {/* Categories List */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Categories</CardTitle>
                <CardDescription>{categories.length} categories total</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categories.map((category) => (
                    <Card key={category.id} className="card-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{category.icon}</span>
                            <div>
                              <h3 className="font-semibold text-foreground">{category.name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {category.description || "No description"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <Badge variant="secondary">
                            {getCategoryProductCount(category.id)} products
                          </Badge>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingCategory({ ...category })}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeletingCategory(category)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            {/* Add Product Form - Collapsible Sections */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Plus className="w-5 h-5" /> Add New Product
              </h2>

              {/* Basic Information */}
              <CollapsibleSection id="basic" title="Basic Information" icon={Package}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Product Name *</Label>
                    <div className="relative">
                      <Input
                        placeholder="e.g., Havells Albus UV Plus Water Purifier"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        maxLength={100}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        {productForm.name.length}/100
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={productForm.categoryId}
                      onValueChange={(value) => setProductForm({ ...productForm, categoryId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Product Headline/Tagline</Label>
                    <div className="relative">
                      <Input
                        placeholder="e.g., Pure Water, Healthy Living"
                        value={productForm.headline}
                        onChange={(e) => setProductForm({ ...productForm, headline: e.target.value })}
                        maxLength={150}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        {productForm.headline.length}/150
                      </span>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Pricing */}
              <CollapsibleSection id="pricing" title="Pricing & Discounts" icon={DollarSign}>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>MRP (₹) *</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 15000"
                      value={productForm.mrp}
                      onChange={(e) => setProductForm({ ...productForm, mrp: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Discounted Price (₹)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 9900"
                      value={productForm.discountedPrice}
                      onChange={(e) => setProductForm({ ...productForm, discountedPrice: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Discount</Label>
                    <div className="h-10 flex items-center">
                      {calculateDiscount(productForm.mrp, productForm.discountedPrice) > 0 ? (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500 text-white">
                            {calculateDiscount(productForm.mrp, productForm.discountedPrice)}% OFF
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Save ₹{(parseFloat(productForm.mrp) - parseFloat(productForm.discountedPrice)).toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">No discount applied</span>
                      )}
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Description - Rich Text */}
              <CollapsibleSection id="description" title="Product Description" icon={FileText}>
                <RichTextEditor
                  content={productForm.description}
                  onChange={(content) => setProductForm({ ...productForm, description: content })}
                  placeholder="Describe your product in detail. Highlight key features, benefits, and what makes it special..."
                />
              </CollapsibleSection>

              {/* Features */}
              <CollapsibleSection id="features" title="Product Features" icon={Star}>
                <FeatureListBuilder
                  features={productForm.productFeatures}
                  onChange={(features) => setProductForm({ ...productForm, productFeatures: features })}
                />
              </CollapsibleSection>

              {/* Technical Specifications */}
              <CollapsibleSection id="specifications" title="Technical Specifications" icon={Wrench}>
                <SpecificationsBuilder
                  specifications={productForm.specifications}
                  onChange={(specs) => setProductForm({ ...productForm, specifications: specs })}
                />
              </CollapsibleSection>

              {/* Customer Benefits */}
              <CollapsibleSection id="benefits" title="Customer Benefits" icon={Lightbulb}>
                <BenefitsBuilder
                  benefits={productForm.benefits}
                  onChange={(benefits) => setProductForm({ ...productForm, benefits: benefits })}
                />
              </CollapsibleSection>

              {/* Images */}
              <CollapsibleSection id="images" title="Images & Media" icon={ImageIcon}>
                <ImageManager
                  images={productForm.productImages}
                  onChange={(images) => setProductForm({ ...productForm, productImages: images })}
                />
              </CollapsibleSection>

              {/* Status & Tags */}
              <CollapsibleSection id="status" title="Status & Tags" icon={Tags}>
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={productForm.inStock}
                        onCheckedChange={(checked) => setProductForm({ ...productForm, inStock: checked })}
                      />
                      <Label className="flex items-center gap-2">
                        In Stock
                        <Badge variant={productForm.inStock ? "default" : "destructive"}>
                          {productForm.inStock ? "Available" : "Out of Stock"}
                        </Badge>
                      </Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={productForm.isFeatured}
                        onCheckedChange={(checked) => setProductForm({ ...productForm, isFeatured: checked })}
                      />
                      <Label className="flex items-center gap-2">
                        Featured Product
                        {productForm.isFeatured && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Product Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={productForm.tags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleTag(tag)}
                        >
                          {productForm.tags.includes(tag) && <Check className="w-3 h-3 mr-1" />}
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Submit Button */}
              <div className="flex justify-end gap-2 sticky bottom-4 bg-background p-4 rounded-lg shadow-lg border border-border">
                <Button
                  variant="outline"
                  onClick={() => {
                    setProductForm(initialProductForm);
                    localStorage.removeItem("cooler_emporium_product_draft");
                  }}
                >
                  Clear Form
                </Button>
                <Button onClick={handleAddProduct} size="lg">
                  <Plus className="w-4 h-4 mr-2" /> Add Product
                </Button>
              </div>
            </div>

            {/* Products List */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div>
                    <CardTitle>Existing Products</CardTitle>
                    <CardDescription>{filteredProducts.length} products shown</CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        className="pl-10 w-48"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                      />
                    </div>
                    <Select value={productCategoryFilter} onValueChange={setProductCategoryFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={productStatusFilter} onValueChange={setProductStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="inStock">In Stock</SelectItem>
                        <SelectItem value="outOfStock">Out of Stock</SelectItem>
                        <SelectItem value="featured">Featured</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredProducts.map((product) => {
                    const category = getCategoryById(product.categoryId);
                    return (
                      <div
                        key={product.id}
                        className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-smooth"
                      >
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                            {product.isFeatured && (
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            )}
                            {!product.inStock && (
                              <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {category?.icon} {category?.name || "Uncategorized"}
                            </Badge>
                            {product.discountedPrice && product.mrp && product.discountedPrice < product.mrp ? (
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-semibold text-primary">₹{product.discountedPrice.toLocaleString()}</span>
                                <span className="text-xs text-muted-foreground line-through">₹{product.mrp.toLocaleString()}</span>
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                  {product.discountPercentage}% OFF
                                </Badge>
                              </div>
                            ) : product.price ? (
                              <span className="text-sm text-muted-foreground">₹{product.price.toLocaleString()}</span>
                            ) : null}
                            {product.tags?.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDuplicateProduct(product)}
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeletingProduct(product)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No products found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Icon</Label>
                <Input
                  value={editingCategory.icon}
                  onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCategory(null)}>Cancel</Button>
            <Button onClick={handleUpdateCategory}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Product Name *</Label>
                  <Input
                    value={editProductForm.name}
                    onChange={(e) => setEditProductForm({ ...editProductForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={editProductForm.categoryId}
                    onValueChange={(value) => setEditProductForm({ ...editProductForm, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Headline</Label>
                  <Input
                    value={editProductForm.headline}
                    onChange={(e) => setEditProductForm({ ...editProductForm, headline: e.target.value })}
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>MRP (₹)</Label>
                  <Input
                    type="number"
                    value={editProductForm.mrp}
                    onChange={(e) => setEditProductForm({ ...editProductForm, mrp: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Discounted Price (₹)</Label>
                  <Input
                    type="number"
                    value={editProductForm.discountedPrice}
                    onChange={(e) => setEditProductForm({ ...editProductForm, discountedPrice: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Discount</Label>
                  <div className="h-10 flex items-center">
                    {calculateDiscount(editProductForm.mrp, editProductForm.discountedPrice) > 0 ? (
                      <Badge className="bg-green-500 text-white">
                        {calculateDiscount(editProductForm.mrp, editProductForm.discountedPrice)}% OFF
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">No discount</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <RichTextEditor
                  content={editProductForm.description}
                  onChange={(content) => setEditProductForm({ ...editProductForm, description: content })}
                  minHeight="200px"
                />
              </div>

              {/* Features */}
              <div className="space-y-2">
                <Label>Features</Label>
                <FeatureListBuilder
                  features={editProductForm.productFeatures}
                  onChange={(features) => setEditProductForm({ ...editProductForm, productFeatures: features })}
                />
              </div>

              {/* Specifications */}
              <div className="space-y-2">
                <Label>Specifications</Label>
                <SpecificationsBuilder
                  specifications={editProductForm.specifications}
                  onChange={(specs) => setEditProductForm({ ...editProductForm, specifications: specs })}
                />
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <Label>Benefits</Label>
                <BenefitsBuilder
                  benefits={editProductForm.benefits}
                  onChange={(benefits) => setEditProductForm({ ...editProductForm, benefits: benefits })}
                />
              </div>

              {/* Images */}
              <div className="space-y-2">
                <Label>Images</Label>
                <ImageManager
                  images={editProductForm.productImages}
                  onChange={(images) => setEditProductForm({ ...editProductForm, productImages: images })}
                />
              </div>

              {/* Status & Tags */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={editProductForm.inStock}
                      onCheckedChange={(checked) => setEditProductForm({ ...editProductForm, inStock: checked })}
                    />
                    <Label>In Stock</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={editProductForm.isFeatured}
                      onCheckedChange={(checked) => setEditProductForm({ ...editProductForm, isFeatured: checked })}
                    />
                    <Label>Featured</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={editProductForm.tags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag, true)}
                      >
                        {editProductForm.tags.includes(tag) && <Check className="w-3 h-3 mr-1" />}
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProduct(null)}>Cancel</Button>
            <Button onClick={handleUpdateProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirmation */}
      <AlertDialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingCategory?.name}"? 
              {getCategoryProductCount(deletingCategory?.id || "") > 0 && 
                ` This will mark ${getCategoryProductCount(deletingCategory?.id || "")} product(s) as uncategorized.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Product Confirmation */}
      <AlertDialog open={!!deletingProduct} onOpenChange={() => setDeletingProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingProduct?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
