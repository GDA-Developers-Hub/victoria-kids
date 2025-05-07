import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "../../../utils/api";
import adminService from "../../../utils/adminService";
import { categoryService } from "../../../utils/categoryService";
import ImageUploader from "../../../utils/imageUploader";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    stock: "",
    category: "",
    images: [],
    is_new: false,
    is_featured: false,
    status: "active"
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // Fetch categories and product data if in edit mode
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const categoriesData = await categoryService.getCategories();
        setCategories(categoriesData.categories || []);
        
        // If edit mode, fetch product data
        if (isEditMode) {
          const productData = await adminService.getProductById(id);
          if (productData) {
            // Format data for form
            setFormData({
              name: productData.name || "",
              description: productData.description || "",
              price: productData.price || "",
              original_price: productData.original_price || "",
              stock: productData.stock || "",
              category: productData.category_id || "",
              images: productData.images || [],
              is_new: productData.is_new || false,
              is_featured: productData.is_featured || false,
              status: productData.status || "active"
            });
          }
        }
      } catch (error) {
        console.error("Error loading form data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };
  
  const handleImageSave = (url) => {
    setFormData({
      ...formData,
      images: [...formData.images, url]
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, index) => index !== indexToRemove)
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Format data for API
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        stock: parseInt(formData.stock, 10)
      };
      
      if (isEditMode) {
        await adminService.updateProduct(id, productData);
        toast.success("Product updated successfully");
      } else {
        await adminService.createProduct(productData);
        toast.success("Product created successfully");
      }
      
      // Redirect back to products list
      navigate("/admin/products");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEditMode) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="ml-2">Loading product data...</p>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{isEditMode ? "Edit Product" : "Add New Product"}</h1>
        <p className="text-muted-foreground">
          {isEditMode ? "Update product information" : "Add a new product to your store"}
        </p>
      </div>
      
      <div className="bg-white rounded-lg border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter product name"
              />
            </div>
            
            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Price */}
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Price (KSh) <span className="text-red-500">*</span>
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="0.00"
              />
            </div>
            
            {/* Original Price (for discounts) */}
            <div className="space-y-2">
              <label htmlFor="original_price" className="text-sm font-medium">
                Original Price (KSh)
              </label>
              <input
                id="original_price"
                name="original_price"
                type="number"
                min="0"
                step="0.01"
                value={formData.original_price}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">Leave empty if there's no discount</p>
            </div>
            
            {/* Stock */}
            <div className="space-y-2">
              <label htmlFor="stock" className="text-sm font-medium">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="0"
              />
            </div>
            
            {/* Status */}
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter product description"
            />
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                id="is_new"
                name="is_new"
                type="checkbox"
                checked={formData.is_new}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
              />
              <label htmlFor="is_new" className="text-sm font-medium">
                Mark as New Arrival
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="is_featured"
                name="is_featured"
                type="checkbox"
                checked={formData.is_featured}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
              />
              <label htmlFor="is_featured" className="text-sm font-medium">
                Feature on Homepage
              </label>
            </div>
          </div>
          
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Product Images</label>
            <div className="border rounded-md p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((imageUrl, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={imageUrl} 
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 rounded-full text-white p-1 shadow-sm hover:bg-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18"></path>
                        <path d="M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                ))}
                <div className="flex items-center justify-center border-2 border-dashed rounded-md h-32">
                  <ImageUploader onSaveUrl={handleImageSave} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Submit Buttons */}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#e91e63] text-primary-foreground hover:bg-[#c2185b] h-10 px-4 py-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEditMode ? "Update Product" : "Create Product"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm; 