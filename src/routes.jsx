import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

// Layout components
import AdminLayout from "./components/admin/AdminLayout";
import Layout from "./components/Layout";

// Admin pages
import AdminDashboardPage from "./pages/admin/index";
import AdminProductsPage from "./pages/admin/products/index";
import AdminOrdersPage from "./pages/admin/orders/index";
import AdminCustomersPage from "./pages/admin/customers/index";
import AdminCategoriesPage from "./pages/admin/categories/index";
import AdminLogout from "./pages/admin/logout/index";
import AdminLoginPage from "./pages/admin/login/index";
import AdminForgotPasswordPage from "./pages/admin/forgot-password/index";
import AdminNewProductPage from "./pages/admin/products/new/index";
import AdminEditProductPage from "./pages/admin/products/edit/index";
import AdminAnalyticsPage from "./pages/admin/analytics/index";
import AdminNewsletterPage from "./pages/admin/newsletter/index";
import AdminSettingsPage from "./pages/admin/settings/index";

// Main pages
import HomePage from "./pages/main/HomePage";
import AboutPage from "./pages/main/AboutPage";
import ProductsPage from "./pages/main/ProductsPage";
import ProductDetailsPage from "./pages/main/ProductDetailsPage";
import CategoriesPage from "./pages/main/CategoriesPage";
import CategoryDetailsPage from "./pages/main/CategoryDetailsPage";
import ContactPage from "./pages/main/ContactPage";
import LoginPage from "./pages/main/LoginPage";
import RegisterPage from "./pages/main/RegisterPage";
import CartPage from "./pages/main/CartPage";
import CheckoutPage from "./pages/main/CheckoutPage";
import CheckoutSuccessPage from "./pages/main/checkout/success/index";
import FavoritesPage from "./pages/main/FavoritesPage";
import OnboardingPage from "./pages/main/OnboardingPage";

// Auth guard for admin routes
const AdminGuard = () => {
  // For development, we're not authenticating yet
  // In production, check if user is authenticated
  // const isAuthenticated = adminService.isAuthenticated();
  // if (!isAuthenticated) {
  //   return <Navigate to="/admin/login" replace />;
  // }
  
  return <Outlet />;
};

const router = createBrowserRouter([
  // Main routes with layout
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/products",
        element: <ProductsPage />,
      },
      {
        path: "/products/:id",
        element: <ProductDetailsPage />,
      },
      {
        path: "/categories",
        element: <CategoriesPage />,
      },
      {
        path: "/categories/:slug",
        element: <CategoryDetailsPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/checkout",
        element: <CheckoutPage />,
      },
      {
        path: "/checkout/success",
        element: <CheckoutSuccessPage />,
      },
      {
        path: "/favorites",
        element: <FavoritesPage />,
      },
    ],
  },
  // Standalone routes without main layout
  {
    path: "/onboarding",
    element: <OnboardingPage />,
  },
  // Admin Login routes (outside of auth guard)
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin/forgot-password",
    element: <AdminForgotPasswordPage />,
  },
  // Admin routes with layout and auth guard
  {
    path: "/admin",
    element: <AdminGuard />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "",
            element: <AdminDashboardPage />,
          },
          {
            path: "products",
            element: <AdminProductsPage />,
          },
          {
            path: "products/new",
            element: <AdminNewProductPage />,
          },
          {
            path: "products/edit/:id",
            element: <AdminEditProductPage />,
          },
          {
            path: "categories",
            element: <AdminCategoriesPage />,
          },
          {
            path: "orders",
            element: <AdminOrdersPage />,
          },
          {
            path: "customers",
            element: <AdminCustomersPage />,
          },
          {
            path: "analytics",
            element: <AdminAnalyticsPage />,
          },
          {
            path: "newsletter",
            element: <AdminNewsletterPage />,
          },
          {
            path: "settings",
            element: <AdminSettingsPage />,
          },
        ],
      },
      {
        path: "logout",
        element: <AdminLogout />,
      },
    ],
  },
]);

export default router;
