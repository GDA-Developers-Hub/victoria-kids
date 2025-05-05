import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { categoryService } from '../../utils/categoryService';
import { productService } from '../../utils/productService';
import Layout from '../../components/Layout';

const CategoryDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const { category } = await categoryService.getCategoryBySlug(slug);
        
        if (!category) {
          setError('Category not found');
          return;
        }
        
        setCategory(category);
        
        // Get products for this category
        const { products } = await productService.getProductsByCategory(category.name);
        setProducts(products);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('Failed to load category. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryData();
    }
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <p>Loading category details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !category) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold mb-4">Category Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The requested category could not be found.'}</p>
            <Button onClick={() => navigate('/categories')}>Browse Categories</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/categories')}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to categories</span>
          </Button>
          <h1 className="text-3xl font-bold">{category.name}</h1>
        </div>

        <p className="mb-8 text-lg text-muted-foreground">{category.description}</p>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div 
                key={product.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <div className="overflow-hidden rounded-lg border bg-white">
                  <div className="relative aspect-square">
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {product.discount > 0 && (
                      <div className="absolute left-0 top-0 bg-[#e91e63] px-2 py-1 text-xs font-medium text-white">
                        {product.discount}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-1 text-sm font-medium">{product.name}</h3>
                    <div className="mt-1 flex items-center justify-between">
                      <div>
                        {product.originalPrice ? (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">KSh {product.price.toFixed(2)}</span>
                            <span className="text-xs text-gray-500 line-through">
                              KSh {product.originalPrice.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-medium">KSh {product.price.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border p-8 text-center">
            <h2 className="text-xl font-medium">No products found</h2>
            <p className="mt-2 text-muted-foreground">We couldn't find any products in this category.</p>
            <Button className="mt-4 bg-[#e91e63] hover:bg-[#c2185b]" onClick={() => navigate('/products')}>
              Browse all products
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryDetailsPage;
