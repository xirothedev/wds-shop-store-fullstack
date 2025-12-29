'use client';

import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type {
  Product,
  ProductImage,
  ProductSizeStock,
  ProductSpecItem,
} from '@/types/product';

type ProductFormProps = {
  product?: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
};

export function ProductForm({
  product,
  open,
  onOpenChange,
  onSubmit,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    priceCurrent: 0,
    priceOriginal: undefined as number | undefined,
    badge: '',
    ratingValue: 0,
    ratingCount: 0,
    isPublished: true,
    gender: 'UNISEX' as 'MALE' | 'FEMALE' | 'UNISEX',
    category: 'running' as 'running' | 'lifestyle',
    isLimited: false,
    images: [] as ProductImage[],
    specs: [] as ProductSpecItem[],
    sizeStocks: [] as ProductSizeStock[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription || '',
        priceCurrent: product.priceCurrent,
        priceOriginal: product.priceOriginal,
        badge: product.badge || '',
        ratingValue: product.ratingValue,
        ratingCount: product.ratingCount,
        isPublished: product.isPublished ?? true,
        gender: product.gender || 'UNISEX',
        category: product.category || 'running',
        isLimited: product.isLimited || false,
        images: product.images || [],
        specs: product.specs || [],
        sizeStocks: product.sizeStocks || [],
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        shortDescription: '',
        priceCurrent: 0,
        priceOriginal: undefined,
        badge: '',
        ratingValue: 0,
        ratingCount: 0,
        isPublished: true,
        gender: 'UNISEX',
        category: 'running',
        isLimited: false,
        images: [],
        specs: [],
        sizeStocks: [],
      });
    }
    setErrors({});
  }, [product, open]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: prev.slug || generateSlug(value),
    }));
  };

  const handleAddImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { id: `img-${Date.now()}`, src: '', alt: '' }],
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (
    index: number,
    field: 'src' | 'alt',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, [field]: value } : img
      ),
    }));
  };

  const handleAddSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specs: [...prev.specs, { key: '', value: '' }],
    }));
  };

  const handleRemoveSpec = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  };

  const handleSpecChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      specs: prev.specs.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      ),
    }));
  };

  const handleAddSizeStock = () => {
    setFormData((prev) => ({
      ...prev,
      sizeStocks: [
        ...prev.sizeStocks,
        { id: `size-${Date.now()}`, size: '', stock: 0 },
      ],
    }));
  };

  const handleRemoveSizeStock = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sizeStocks: prev.sizeStocks.filter((_, i) => i !== index),
    }));
  };

  const handleSizeStockChange = (
    index: number,
    field: 'size' | 'stock',
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      sizeStocks: prev.sizeStocks.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên sản phẩm là bắt buộc';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug là bắt buộc';
    }

    if (formData.priceCurrent <= 0) {
      newErrors.priceCurrent = 'Giá phải lớn hơn 0';
    }

    if (
      formData.priceOriginal &&
      formData.priceOriginal <= formData.priceCurrent
    ) {
      newErrors.priceOriginal = 'Giá gốc phải lớn hơn giá hiện tại';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      ...formData,
      badge: formData.badge || undefined,
      priceOriginal: formData.priceOriginal || undefined,
      shortDescription: formData.shortDescription || undefined,
      images: formData.images.length > 0 ? formData.images : undefined,
      specs: formData.specs.length > 0 ? formData.specs : undefined,
      sizeStocks:
        formData.sizeStocks.length > 0 ? formData.sizeStocks : undefined,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </DialogTitle>
          <DialogDescription>
            {product
              ? 'Cập nhật thông tin sản phẩm'
              : 'Điền thông tin để thêm sản phẩm mới'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên sản phẩm <span className="text-red-400">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Nhập tên sản phẩm"
              />
              {errors.name && (
                <p className="text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug <span className="text-red-400">*</span>
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="product-slug"
              />
              {errors.slug && (
                <p className="text-sm text-red-400">{errors.slug}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Mô tả ngắn</Label>
            <Input
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  shortDescription: e.target.value,
                }))
              }
              placeholder="Mô tả ngắn về sản phẩm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả đầy đủ</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Mô tả chi tiết về sản phẩm"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priceCurrent">
                Giá hiện tại <span className="text-red-400">*</span>
              </Label>
              <Input
                id="priceCurrent"
                type="number"
                value={formData.priceCurrent}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priceCurrent: Number(e.target.value),
                  }))
                }
                placeholder="0"
              />
              {errors.priceCurrent && (
                <p className="text-sm text-red-400">{errors.priceCurrent}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priceOriginal">Giá gốc</Label>
              <Input
                id="priceOriginal"
                type="number"
                value={formData.priceOriginal || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priceOriginal: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  }))
                }
                placeholder="0"
              />
              {errors.priceOriginal && (
                <p className="text-sm text-red-400">{errors.priceOriginal}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="badge">Badge</Label>
              <Select
                value={formData.badge}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, badge: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn badge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Không có</SelectItem>
                  <SelectItem value="BEST SELLER">BEST SELLER</SelectItem>
                  <SelectItem value="HOT ITEM">HOT ITEM</SelectItem>
                  <SelectItem value="NEW">NEW</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Giới tính</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: 'MALE' | 'FEMALE' | 'UNISEX') =>
                  setFormData((prev) => ({ ...prev, gender: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Nam</SelectItem>
                  <SelectItem value="FEMALE">Nữ</SelectItem>
                  <SelectItem value="UNISEX">Unisex</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Danh mục</Label>
              <Select
                value={formData.category}
                onValueChange={(value: 'running' | 'lifestyle') =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ratingValue">Rating</Label>
              <Input
                id="ratingValue"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.ratingValue}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    ratingValue: Number(e.target.value),
                  }))
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isPublished: e.target.checked,
                  }))
                }
                className="bg-background h-4 w-4 rounded border-amber-500/20"
              />
              <Label htmlFor="isPublished">Đã xuất bản</Label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isLimited"
                checked={formData.isLimited}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isLimited: e.target.checked,
                  }))
                }
                className="bg-background h-4 w-4 rounded border-amber-500/20"
              />
              <Label htmlFor="isLimited">Limited Edition</Label>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Hình ảnh</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddImage}
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm hình ảnh
              </Button>
            </div>
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="URL hình ảnh"
                  value={image.src}
                  onChange={(e) =>
                    handleImageChange(index, 'src', e.target.value)
                  }
                />
                <Input
                  placeholder="Alt text"
                  value={image.alt}
                  onChange={(e) =>
                    handleImageChange(index, 'alt', e.target.value)
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Specs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Thông số kỹ thuật</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSpec}
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm thông số
              </Button>
            </div>
            {formData.specs.map((spec, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Tên thông số"
                  value={spec.key}
                  onChange={(e) =>
                    handleSpecChange(index, 'key', e.target.value)
                  }
                />
                <Input
                  placeholder="Giá trị"
                  value={spec.value}
                  onChange={(e) =>
                    handleSpecChange(index, 'value', e.target.value)
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveSpec(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Size Stocks */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Kích thước & Tồn kho</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSizeStock}
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm size
              </Button>
            </div>
            {formData.sizeStocks.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Size (VD: EU 42)"
                  value={item.size}
                  onChange={(e) =>
                    handleSizeStockChange(index, 'size', e.target.value)
                  }
                />
                <Input
                  type="number"
                  placeholder="Số lượng"
                  value={item.stock}
                  onChange={(e) =>
                    handleSizeStockChange(
                      index,
                      'stock',
                      Number(e.target.value)
                    )
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveSizeStock(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit">{product ? 'Cập nhật' : 'Thêm mới'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
