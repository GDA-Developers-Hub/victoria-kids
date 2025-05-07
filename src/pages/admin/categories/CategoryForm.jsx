import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "../../../utils/api";
import adminService from "../../../utils/adminService";
import ImageUploader from "../../../utils/imageUploader";
import { slugify } from "../../../utils/stringUtils";
import placeholderImage from "../../../assets/placeholder.webp";

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    imageUrl: "",
    featured: false,
    status: "active"
  });

  const [loading, setLoading] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);
  
  // Fetch category data if in edit mode
  useEffect(() => {
    const fetchCategory = async () => {
      if (!isEditMode) return;
      
      setLoading(true);
      try {
        const response = await adminService.getCategoryById(id);
        if (response) {
          setFormData({
            name: response.name || "",
            description: response.description || "",
            slug: response.slug || "",
            imageUrl: response.imageUrl || "",
            featured: response.featured || false,
            status: response.status || "active"
          });
          setAutoSlug(false);
        }
      } catch (error) {
        console.error("Error fetching category:", error);
        toast.error("Failed to load category");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategory();
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Auto-generate slug when name changes if autoSlug is enabled
    if (name === "name" && autoSlug) {
      setFormData(prev => ({
        ...prev,
        slug: slugify(value)
      }));
    }
  };
  
  const handleSlugChange = (e) => {
    setFormData(prev => ({
      ...prev,
      slug: slugify(e.target.value)
    }));
    setAutoSlug(false);
  };
  
  const handleImageSave = (url) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: url
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const categoryData = { ...formData };
      
      if (isEditMode) {
        await adminService.updateCategory(id, categoryData);
        toast.success("Category updated successfully");
      } else {
        await adminService.createCategory(categoryData);
        toast.success("Category created successfully");
      }
      
      navigate("/admin/categories");
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(error.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEditMode) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="ml-2">Loading category data...</p>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{isEditMode ? "Edit Category" : "Add New Category"}</h1>
        <p className="text-muted-foreground">
          {isEditMode ? "Update category information" : "Add a new category to your store"}
        </p>
      </div>
      
      <div className="bg-white rounded-lg border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter category name"
            />
          </div>
          
          {/* Slug */}
          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-medium">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              value={formData.slug}
              onChange={handleSlugChange}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="category-slug"
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly name for the category (auto-generated from name)
            </p>
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
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter category description"
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
            </select>
          </div>
          
          {/* Featured */}
          <div className="flex items-center space-x-2">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
            />
            <label htmlFor="featured" className="text-sm font-medium">
              Feature on Homepage
            </label>
          </div>
          
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category Image</label>
            <div className="border rounded-md p-4">
              <div className="flex flex-col items-center space-y-4">
                {formData.imageUrl && (
                  <div className="relative">
                    <img 
                      src={formData.imageUrl || placeholderImage} 
                      alt="Category"
                      className="w-full max-w-xs h-auto rounded-md object-cover"
                      onError={(e) => {
                        e.target.src = placeholderImage;
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: "" })}
                      className="absolute top-2 right-2 bg-red-500 rounded-full text-white p-1 shadow-sm hover:bg-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18"></path>
                        <path d="M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                )}
                {!formData.imageUrl && (
                  <ImageUploader onSaveUrl={handleImageSave} />
                )}
              </div>
            </div>
          </div>
          
          {/* Submit Buttons */}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/categories")}
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
                <>{isEditMode ? "Update Category" : "Create Category"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm; 