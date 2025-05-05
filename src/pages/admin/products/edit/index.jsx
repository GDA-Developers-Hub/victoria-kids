import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, X, Trash2, Save } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Badge } from '../../../../components/ui/badge';
import { productService } from '../../../../utils/productService';
import { categoryService } from '../../../../utils/categoryService';
import AdminLayout from '../../../../components/admin/AdminLayout';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    stock: '',
    tags: [],
    colors: [],
    sizes: [],
    ageRange: '',
    material: '',
    origin: '',
    warranty: '',
    safetyInfo: '',
    careInstructions: []
  });
  
  // UI state
  const [currentTag, setCurrentTag] = useState('');
  const [currentSize, setCurrentSize] = useState('');
  const [currentCareInstruction, setCurrentCareInstruction] = useState('');
  const [currentColor, setCurrentColor] = useState({ name: '', code: '#000000' });

  useEffect(() => {
    const fetchProductAndCategories = async () => {
      setIsLoading(true);
      try {
        // Fetch product data
        const { product } = await productService.getProductById(id);
        if (!product) {
          throw new Error('Product not found');
        }

        // Set form data
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price ? product.price.toString() : '',
          originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
          category: product.category || '',
          stock: product.stock ? product.stock.toString() : '',
          tags: product.tags || [],
          colors: product.colors || [],
          sizes: product.sizes || [],
          ageRange: product.ageRange || '',
          material: product.material || '',
          origin: product.origin || '',
          warranty: product.warranty || '',
          safetyInfo: product.safetyInfo || '',
          careInstructions: product.careInstructions || []
        });

        // Set image previews
        if (product.images && product.images.length > 0) {
          setImagePreviewUrls(product.images);
        }

        // Fetch categories for the dropdown
        const { categories } = await categoryService.getCategories();
        setCategories(categories);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProductAndCategories();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    if (!isNaN(value) || value === '') {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        tags: [...prev.tags, currentTag.trim()] 
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({ 
      ...prev, 
      tags: prev.tags.filter(t => t !== tag) 
    }));
  };

  const handleAddSize = () => {
    if (currentSize.trim() && !formData.sizes.includes(currentSize.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        sizes: [...prev.sizes, currentSize.trim()] 
      }));
      setCurrentSize('');
    }
  };

  const handleRemoveSize = (size) => {
    setFormData(prev => ({ 
      ...prev, 
      sizes: prev.sizes.filter(s => s !== size) 
    }));
  };

  const handleAddColor = () => {
    if (currentColor.name.trim() && !formData.colors.some(c => c.name === currentColor.name.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        colors: [...prev.colors, { ...currentColor, name: currentColor.name.trim() }] 
      }));
      setCurrentColor({ name: '', code: '#000000' });
    }
  };

  const handleRemoveColor = (colorName) => {
    setFormData(prev => ({ 
      ...prev, 
      colors: prev.colors.filter(c => c.name !== colorName) 
    }));
  };

  const handleAddCareInstruction = () => {
    if (currentCareInstruction.trim() && !formData.careInstructions.includes(currentCareInstruction.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        careInstructions: [...prev.careInstructions, currentCareInstruction.trim()] 
      }));
      setCurrentCareInstruction('');
    }
  };

  const handleRemoveCareInstruction = (instruction) => {
    setFormData(prev => ({ 
      ...prev, 
      careInstructions: prev.careInstructions.filter(i => i !== instruction) 
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length) {
      // Add new files to existing files
      const newFiles = [...imageFiles, ...files];
      setImageFiles(newFiles);
      
      // Create preview URLs for new files
      const newFileUrls = files.map(file => URL.createObjectURL(file));
      
      // Add to existing preview URLs
      setImagePreviewUrls(prev => [...prev, ...newFileUrls]);
    }
  };

  const removeImage = (index) => {
    // For newly added images, revoke the object URL
    if (index >= imagePreviewUrls.length - imageFiles.length) {
      URL.revokeObjectURL(imagePreviewUrls[index]);
      
      // Remove from image files array
      const fileIndex = index - (imagePreviewUrls.length - imageFiles.length);
      if (fileIndex >= 0) {
        const newFiles = [...imageFiles];
        newFiles.splice(fileIndex, 1);
        setImageFiles(newFiles);
      }
    }
    
    // Remove from preview URLs
    const newImageUrls = [...imagePreviewUrls];
    newImageUrls.splice(index, 1);
    setImagePreviewUrls(newImageUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      // Convert numeric fields to numbers
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stock: parseInt(formData.stock, 10),
        images: imagePreviewUrls,
      };

      // Update product
      const { product } = await productService.updateProduct(id, productData);
      
      // Success - redirect to the product list page
      alert('Product updated successfully!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product. Please check your inputs and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container px-4 py-6">
          <div className="flex items-center justify-center h-[60vh]">
            <p>Loading product data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error && !formData.name) {
    return (
      <AdminLayout>
        <div className="container px-4 py-6">
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <h2 className="text-xl font-bold mb-4">Error Loading Product</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <Button onClick={() => navigate('/admin/products')}>
              Return to Products
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/admin/products')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Edit Product: {formData.name}</h1>
          </div>
          <Button 
            onClick={handleSubmit}
            className="bg-[#e91e63] hover:bg-[#c2185b]"
            disabled={isSaving}
          >
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="rounded-lg border p-6">
              <h2 className="mb-4 font-semibold">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    className="min-h-[100px] w-full rounded-md border border-gray-300 p-2"
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="price">Price (KSh) *</Label>
                    <Input
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleNumberInput}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="originalPrice">Original Price (KSh)</Label>
                    <Input
                      id="originalPrice"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleNumberInput}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 p-2"
                      required
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock *</Label>
                    <Input
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleNumberInput}
                      placeholder="10"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-6">
              <h2 className="mb-4 font-semibold">Additional Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ageRange">Age Range</Label>
                  <Input
                    id="ageRange"
                    name="ageRange"
                    value={formData.ageRange}
                    onChange={handleInputChange}
                    placeholder="e.g., 0-3 years"
                  />
                </div>
                <div>
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    placeholder="e.g., Cotton, Polyester"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="origin">Country of Origin</Label>
                    <Input
                      id="origin"
                      name="origin"
                      value={formData.origin}
                      onChange={handleInputChange}
                      placeholder="e.g., Kenya"
                    />
                  </div>
                  <div>
                    <Label htmlFor="warranty">Warranty</Label>
                    <Input
                      id="warranty"
                      name="warranty"
                      value={formData.warranty}
                      onChange={handleInputChange}
                      placeholder="e.g., 1 Year"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="safetyInfo">Safety Information</Label>
                  <Input
                    id="safetyInfo"
                    name="safetyInfo"
                    value={formData.safetyInfo}
                    onChange={handleInputChange}
                    placeholder="Safety details for the product"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="rounded-lg border p-6">
              <h2 className="mb-4 font-semibold">Images</h2>
              <div className="mb-4">
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <Upload className="mb-3 h-8 w-8 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 2MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {imagePreviewUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-full rounded-md object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-lg border p-6">
              <h2 className="mb-4 font-semibold">Tags</h2>
              <div className="flex items-center gap-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button type="button" onClick={handleAddTag} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.tags && formData.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-lg border p-6">
              <h2 className="mb-4 font-semibold">Sizes</h2>
              <div className="flex items-center gap-2">
                <Input
                  value={currentSize}
                  onChange={(e) => setCurrentSize(e.target.value)}
                  placeholder="Add a size (e.g., S, M, L, XL)"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSize()}
                />
                <Button type="button" onClick={handleAddSize} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.sizes && formData.sizes.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {formData.sizes.map((size, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {size}
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(size)}
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-lg border p-6">
              <h2 className="mb-4 font-semibold">Colors</h2>
              <div className="flex items-center gap-2">
                <Input
                  value={currentColor.name}
                  onChange={(e) => setCurrentColor({ ...currentColor, name: e.target.value })}
                  placeholder="Color name (e.g., Red, Blue)"
                />
                <input
                  type="color"
                  value={currentColor.code}
                  onChange={(e) => setCurrentColor({ ...currentColor, code: e.target.value })}
                  className="h-10 w-12 cursor-pointer rounded-md border"
                />
                <Button type="button" onClick={handleAddColor} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.colors && formData.colors.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {formData.colors.map((color, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="relative">
                        <div
                          className="h-8 w-8 rounded-full border shadow-sm"
                          style={{ backgroundColor: color.code }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(color.name)}
                          className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="mt-1 text-xs">{color.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-lg border p-6">
              <h2 className="mb-4 font-semibold">Care Instructions</h2>
              <div className="flex items-center gap-2">
                <Input
                  value={currentCareInstruction}
                  onChange={(e) => setCurrentCareInstruction(e.target.value)}
                  placeholder="Add a care instruction"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCareInstruction()}
                />
                <Button type="button" onClick={handleAddCareInstruction} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.careInstructions && formData.careInstructions.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.careInstructions.map((instruction, index) => (
                    <div key={index} className="flex items-center justify-between rounded-md border p-2">
                      <span>{instruction}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCareInstruction(instruction)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditProductPage;
