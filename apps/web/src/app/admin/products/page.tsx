'use client';

import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { ProductActions } from '@/components/admin/ProductActions';
import { ProductForm } from '@/components/admin/ProductForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  createProduct,
  deleteProduct,
  getAllProductsForAdmin,
  getProductById,
  updateProduct,
} from '@/lib/products';
import type { Product } from '@/types/product';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const allProducts = getAllProductsForAdmin();
    setProducts(allProducts);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.slug.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGender =
        genderFilter === 'all' || product.gender === genderFilter;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && product.isPublished) ||
        (statusFilter === 'unpublished' && !product.isPublished);

      return matchesSearch && matchesGender && matchesStatus;
    });
  }, [products, searchQuery, genderFilter, statusFilter]);

  const handleCreate = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = async (productId: string) => {
    const product = await getProductById(productId);
    if (product) {
      setEditingProduct(product);
      setIsFormOpen(true);
    }
  };

  const handleDelete = (productId: string) => {
    try {
      deleteProduct(productId);
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Không thể xóa sản phẩm');
    }
  };

  const handleSubmit = (
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      if (editingProduct) {
        updateProduct(editingProduct.id, productData);
      } else {
        createProduct(productData);
      }
      loadProducts();
      setIsFormOpen(false);
      setEditingProduct(undefined);
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error instanceof Error ? error.message : 'Không thể lưu sản phẩm');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <>
      <AdminHeader />
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>
            <p className="text-sm text-gray-400">
              Tổng số: {filteredProducts.length} sản phẩm
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm sản phẩm mới
          </Button>
        </div>

        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Tìm kiếm theo tên hoặc slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Giới tính" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="MALE">Nam</SelectItem>
              <SelectItem value="FEMALE">Nữ</SelectItem>
              <SelectItem value="UNISEX">Unisex</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="published">Đã xuất bản</SelectItem>
              <SelectItem value="unpublished">Chưa xuất bản</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-amber-500/20">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead>Badge</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-400">
                    Không có sản phẩm nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{product.name}</div>
                        <div className="text-xs text-gray-400">
                          {product.slug}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-amber-500">
                          {formatPrice(product.priceCurrent)}
                        </div>
                        {product.priceOriginal &&
                          product.priceOriginal > product.priceCurrent && (
                            <div className="text-xs text-gray-500 line-through">
                              {formatPrice(product.priceOriginal)}
                            </div>
                          )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {product.gender === 'MALE'
                          ? 'Nam'
                          : product.gender === 'FEMALE'
                            ? 'Nữ'
                            : 'Unisex'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {product.badge ? (
                        <Badge variant="default">{product.badge}</Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.isPublished ? (
                        <Badge variant="default">Đã xuất bản</Badge>
                      ) : (
                        <Badge variant="secondary">Chưa xuất bản</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-amber-500">★</span>
                        <span>{product.ratingValue.toFixed(1)}</span>
                        <span className="text-gray-400">
                          ({product.ratingCount})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(product.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <ProductActions
                        productId={product.id}
                        productName={product.name}
                        onEdit={() => handleEdit(product.id)}
                        onDelete={() => handleDelete(product.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ProductForm
        product={editingProduct}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
      />
    </>
  );
}
