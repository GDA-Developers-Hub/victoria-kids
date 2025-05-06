import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, X, Trash2 } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Badge } from '../../../../components/ui/badge';
import { productService } from '../../../../utils/productService';
import { categoryService } from '../../../../utils/categoryService';
import adminService from '../../../../utils/adminService';
import AdminLayout from '../../../../components/admin/AdminLayout';
import ImageUploader from '../../../../utils/imageUploader';

const NewProductPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    stock: '10',
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
    // Fetch categories for the dropdown
    const fetchCategories = async () => {
      try {
        const { categories } = await categoryService.getCategories();
        setCategories(categories);
        if (categories.length > 0) {
          setFormData(prev => ({ ...prev, category: categories[0].name }));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again.');
      }
    };

    fetchCategories();
  }, []);

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

  const handleAddImage = (url) => {
    setImageUrls(prev => [...prev, url]);
  };

  const removeImage = (index) => {
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    setImageUrls(newImageUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.name || !formData.description || !formData.price) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (imageUrls.length === 0) {
      setError('Please upload at least one product image');
      setIsLoading(false);
      return;
    }

    try {
      // Convert numeric fields to numbers
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stock: parseInt(formData.stock, 10),
        images: JSON.stringify(imageUrls) // Backend expects stringified JSON array
      };

      // Create product using adminService instead of productService
      await adminService.createProduct(productData);
      
      // Success - redirect to the product list page
      alert('Product created successfully!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      setError('Failed to create product. Please check your inputs and try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold">Create New Product</h1>
          </div>
          <Button 
            onClick={handleSubmit}
            className="bg-[#e91e63] hover:bg-[#c2185b]"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Product'}
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
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-6">
              <h2 className="mb-4 font-semibold">Pricing & Inventory</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (KSh) *</Label>
                    <Input
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleNumberInput}
                      placeholder="0.00"
                      type="text"
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
                      type="text"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleNumberInput}
                      placeholder="0"
                      type="text"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-6">
              <h2 className="mb-4 font-semibold">Product Images</h2>
              <div className="space-y-4">
                <div>
                  <Label>Upload Images *</Label>
                  <div className="mt-2">
                    <ImageUploader onSaveUrl={handleAddImage} />
                  </div>
                </div>
                {imageUrls.length > 0 && (
                  <div>
                    <Label>Uploaded Images</Label>
                    <div className="mt-2 grid grid-cols-3 gap-4">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={url} 
                            alt={`Product ${index}`} 
                            className="h-24 w-24 rounded-md object-cover border" 
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow-md hover:bg-red-50"
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="rounded-lg border p-6">
              <h2 className="mb-4 font-semibold">Product Variants</h2>
              <div className="space-y-4">
                {/* Sizes Section */}
                <div>
                  <Label>Sizes</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.sizes.map((size) => (
                      <Badge key={size} className="bg-[#e91e63] text-white">
                        {size}
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(size)}
                          className="ml-1 text-xs"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-2 flex">
                    <Input
                      value={currentSize}
                      onChange={(e) => setCurrentSize(e.target.value)}
                      placeholder="Enter size"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleAddSize}
                      className="ml-2 bg-[#e91e63] hover:bg-[#c2185b]"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Colors Section */}
                <div>
                  <Label>Colors</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.colors.map((color) => (
                      <Badge key={color.name} className="border-0 bg-transparent">
                        <div className="flex items-center">
                          <div
                            className="mr-1 h-3 w-3 rounded-full"
                            style={{ backgroundColor: color.code }}
                          />
                          {color.name}
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(color.name)}
                            className="ml-1 text-xs"
                          >
                            ×
                          </button>
                        </div>
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-2 flex">
                    <Input
                      value={currentColor.name}
                      onChange={(e) =>
                        setCurrentColor({
                          ...currentColor,
                          name: e.target.value,
                        })
                      }
                      placeholder="Color name"
                      className="flex-1"
                    />
                    <Input
                      type="color"
                      value={currentColor.code}
                      onChange={(e) =>
                        setCurrentColor({
                          ...currentColor,
                          code: e.target.value,
                        })
                      }
                      className="ml-2 w-16"
                    />
                    <Button
                      type="button"
                      onClick={handleAddColor}
                      className="ml-2 bg-[#e91e63] hover:bg-[#c2185b]"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Tags Section */}
                <div>
                  <Label>Tags</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} className="bg-gray-100 text-gray-800">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-xs"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-2 flex">
                    <Input
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="Enter tag"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      className="ml-2 bg-[#e91e63] hover:bg-[#c2185b]"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
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
                  <Label htmlFor="warranty">Warranty Information</Label>
                  <Input
                    id="warranty"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleInputChange}
                    placeholder="e.g., 1-year limited warranty"
                  />
                </div>
                <div>
                  <Label htmlFor="safetyInfo">Safety Information</Label>
                  <textarea
                    id="safetyInfo"
                    name="safetyInfo"
                    value={formData.safetyInfo}
                    onChange={handleInputChange}
                    placeholder="Enter safety information"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                
                {/* Care Instructions Section */}
                <div>
                  <Label>Care Instructions</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.careInstructions.map((instruction) => (
                      <Badge key={instruction} className="bg-gray-100 text-gray-800">
                        {instruction}
                        <button
                          type="button"
                          onClick={() => handleRemoveCareInstruction(instruction)}
                          className="ml-1 text-xs"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-2 flex">
                    <Input
                      value={currentCareInstruction}
                      onChange={(e) => setCurrentCareInstruction(e.target.value)}
                      placeholder="Enter care instruction"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleAddCareInstruction}
                      className="ml-2 bg-[#e91e63] hover:bg-[#c2185b]"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewProductPage;
