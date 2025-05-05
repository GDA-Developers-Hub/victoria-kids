import React, { useState } from 'react';
import { Save, User, Store, CreditCard, Bell, Lock, ShieldCheck, Globe, Mail, Smartphone } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Badge } from '../../../components/ui/badge';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Form states for different settings tabs
  const [generalSettings, setGeneralSettings] = useState({
    storeName: 'Victoria Kids Shop',
    storeDescription: 'Premium baby and children products for the modern family',
    storeEmail: 'support@victoriakids.com',
    storePhone: '+254 712 345 678',
    storeCurrency: 'KSh',
    storeLanguage: 'English'
  });
  
  const [paymentSettings, setPaymentSettings] = useState({
    acceptCreditCards: true,
    acceptMpesa: true,
    acceptBankTransfer: true,
    acceptCashOnDelivery: true,
    minimumOrderAmount: '500',
    taxRate: '16',
    freeShippingThreshold: '5000'
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    requireStrongPasswords: true,
    twoFactorAuth: false,
    sessionTimeout: '30',
    loginAttempts: '5',
    passwordExpiryDays: '90'
  });

  const handleGeneralSettingsChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: value
    });
  };

  const handlePaymentSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentSettings({
      ...paymentSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSecuritySettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings({
      ...securitySettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Simulate API call to save settings
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <AdminLayout>
      <div className="container px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Settings</h1>
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

        {saveSuccess && (
          <div className="mb-6 rounded-md bg-green-50 p-4 text-green-800">
            Settings saved successfully!
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
          {/* Settings Navigation */}
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <nav className="space-y-1">
              <button
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                  activeTab === 'general' ? 'bg-pink-50 text-[#e91e63]' : 'text-gray-700'
                }`}
                onClick={() => setActiveTab('general')}
              >
                <Store className="h-5 w-5" />
                General Settings
              </button>
              <button
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                  activeTab === 'payment' ? 'bg-pink-50 text-[#e91e63]' : 'text-gray-700'
                }`}
                onClick={() => setActiveTab('payment')}
              >
                <CreditCard className="h-5 w-5" />
                Payment & Taxes
              </button>
              <button
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                  activeTab === 'security' ? 'bg-pink-50 text-[#e91e63]' : 'text-gray-700'
                }`}
                onClick={() => setActiveTab('security')}
              >
                <ShieldCheck className="h-5 w-5" />
                Security & Privacy
              </button>
              <button
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                  activeTab === 'account' ? 'bg-pink-50 text-[#e91e63]' : 'text-gray-700'
                }`}
                onClick={() => setActiveTab('account')}
              >
                <User className="h-5 w-5" />
                Account Settings
              </button>
              <button
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                  activeTab === 'notifications' ? 'bg-pink-50 text-[#e91e63]' : 'text-gray-700'
                }`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell className="h-5 w-5" />
                Notifications
              </button>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div>
                <h2 className="mb-6 text-xl font-semibold">General Settings</h2>
                <form className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="storeName">Store Name</Label>
                      <Input
                        id="storeName"
                        name="storeName"
                        value={generalSettings.storeName}
                        onChange={handleGeneralSettingsChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="storeEmail">Store Email</Label>
                      <Input
                        id="storeEmail"
                        name="storeEmail"
                        type="email"
                        value={generalSettings.storeEmail}
                        onChange={handleGeneralSettingsChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="storeDescription">Store Description</Label>
                    <textarea
                      id="storeDescription"
                      name="storeDescription"
                      rows="3"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-[#e91e63] focus:ring-[#e91e63]"
                      value={generalSettings.storeDescription}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="storePhone">Store Phone</Label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Smartphone className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="storePhone"
                          name="storePhone"
                          className="pl-10"
                          value={generalSettings.storePhone}
                          onChange={handleGeneralSettingsChange}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="storeCurrency">Currency</Label>
                      <select
                        id="storeCurrency"
                        name="storeCurrency"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-[#e91e63] focus:ring-[#e91e63]"
                        value={generalSettings.storeCurrency}
                        onChange={handleGeneralSettingsChange}
                      >
                        <option value="KSh">Kenyan Shilling (KSh)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                        <option value="GBP">British Pound (£)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="storeLanguage">Default Language</Label>
                    <select
                      id="storeLanguage"
                      name="storeLanguage"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-[#e91e63] focus:ring-[#e91e63]"
                      value={generalSettings.storeLanguage}
                      onChange={handleGeneralSettingsChange}
                    >
                      <option value="English">English</option>
                      <option value="Swahili">Swahili</option>
                      <option value="French">French</option>
                      <option value="Arabic">Arabic</option>
                    </select>
                  </div>

                  <div className="rounded-md bg-blue-50 p-4 text-blue-700">
                    <p className="text-sm">
                      <strong>Note:</strong> These settings affect how your store appears to customers.
                      Changes will be reflected immediately after saving.
                    </p>
                  </div>
                </form>
              </div>
            )}

            {/* Payment & Taxes */}
            {activeTab === 'payment' && (
              <div>
                <h2 className="mb-6 text-xl font-semibold">Payment & Taxes</h2>
                <form className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-base font-medium">Payment Methods</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          id="acceptCreditCards"
                          name="acceptCreditCards"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                          checked={paymentSettings.acceptCreditCards}
                          onChange={handlePaymentSettingsChange}
                        />
                        <label htmlFor="acceptCreditCards" className="ml-2 text-sm text-gray-700">
                          Accept Credit Cards
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="acceptMpesa"
                          name="acceptMpesa"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                          checked={paymentSettings.acceptMpesa}
                          onChange={handlePaymentSettingsChange}
                        />
                        <label htmlFor="acceptMpesa" className="ml-2 text-sm text-gray-700">
                          Accept M-Pesa
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="acceptBankTransfer"
                          name="acceptBankTransfer"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                          checked={paymentSettings.acceptBankTransfer}
                          onChange={handlePaymentSettingsChange}
                        />
                        <label htmlFor="acceptBankTransfer" className="ml-2 text-sm text-gray-700">
                          Accept Bank Transfer
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="acceptCashOnDelivery"
                          name="acceptCashOnDelivery"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                          checked={paymentSettings.acceptCashOnDelivery}
                          onChange={handlePaymentSettingsChange}
                        />
                        <label htmlFor="acceptCashOnDelivery" className="ml-2 text-sm text-gray-700">
                          Accept Cash on Delivery
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="minimumOrderAmount">Minimum Order Amount (KSh)</Label>
                      <Input
                        id="minimumOrderAmount"
                        name="minimumOrderAmount"
                        type="number"
                        min="0"
                        value={paymentSettings.minimumOrderAmount}
                        onChange={handlePaymentSettingsChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input
                        id="taxRate"
                        name="taxRate"
                        type="number"
                        min="0"
                        max="100"
                        value={paymentSettings.taxRate}
                        onChange={handlePaymentSettingsChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (KSh)</Label>
                    <Input
                      id="freeShippingThreshold"
                      name="freeShippingThreshold"
                      type="number"
                      min="0"
                      value={paymentSettings.freeShippingThreshold}
                      onChange={handlePaymentSettingsChange}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Orders above this amount will qualify for free shipping.
                    </p>
                  </div>

                  <div className="rounded-md bg-yellow-50 p-4 text-yellow-800">
                    <p className="text-sm">
                      <strong>Important:</strong> Changes to payment methods and tax rates may affect
                      ongoing transactions. It's recommended to make these changes during off-peak hours.
                    </p>
                  </div>
                </form>
              </div>
            )}

            {/* Security & Privacy */}
            {activeTab === 'security' && (
              <div>
                <h2 className="mb-6 text-xl font-semibold">Security & Privacy</h2>
                <form className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-base font-medium">Password Policies</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          id="requireStrongPasswords"
                          name="requireStrongPasswords"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                          checked={securitySettings.requireStrongPasswords}
                          onChange={handleSecuritySettingsChange}
                        />
                        <label htmlFor="requireStrongPasswords" className="ml-2 text-gray-700">
                          Require strong passwords
                        </label>
                      </div>
                      <div>
                        <Label htmlFor="passwordExpiryDays">Password Expiry (days)</Label>
                        <Input
                          id="passwordExpiryDays"
                          name="passwordExpiryDays"
                          type="number"
                          min="0"
                          value={securitySettings.passwordExpiryDays}
                          onChange={handleSecuritySettingsChange}
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Set to 0 for no expiry.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-base font-medium">Authentication</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          id="twoFactorAuth"
                          name="twoFactorAuth"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                          checked={securitySettings.twoFactorAuth}
                          onChange={handleSecuritySettingsChange}
                        />
                        <label htmlFor="twoFactorAuth" className="ml-2 flex items-center text-gray-700">
                          Enable Two-Factor Authentication
                          <Badge className="ml-2 bg-blue-100 text-blue-800">
                            Recommended
                          </Badge>
                        </label>
                      </div>
                      <div>
                        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                        <Input
                          id="sessionTimeout"
                          name="sessionTimeout"
                          type="number"
                          min="5"
                          value={securitySettings.sessionTimeout}
                          onChange={handleSecuritySettingsChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                        <Input
                          id="loginAttempts"
                          name="loginAttempts"
                          type="number"
                          min="1"
                          value={securitySettings.loginAttempts}
                          onChange={handleSecuritySettingsChange}
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Number of failed attempts before temporary account lockout.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md bg-red-50 p-4 text-red-800">
                    <p className="text-sm">
                      <strong>Warning:</strong> Security settings affect how users access the admin panel.
                      Ensure all admins are informed of changes that might affect their access.
                    </p>
                  </div>
                </form>
              </div>
            )}

            {/* Account Settings */}
            {activeTab === 'account' && (
              <div>
                <h2 className="mb-6 text-xl font-semibold">Account Settings</h2>
                <form className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-200">
                      <img
                        src="/placeholder-avatar.png"
                        alt="Profile"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://ui-avatars.com/api/?name=Admin&background=e91e63&color=fff';
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-medium">Admin User</h3>
                      <p className="text-sm text-gray-500">admin@victoriakids.com</p>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        defaultValue="Admin"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        defaultValue="User"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue="admin@victoriakids.com"
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="mb-4 text-base font-medium">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            placeholder="Enter new password"
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="mb-6 text-xl font-semibold">Notification Settings</h2>
                <form className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-base font-medium">Email Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label htmlFor="newOrder" className="font-medium">New Order Notifications</label>
                          <p className="text-sm text-gray-500">Receive email when a new order is placed</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="newOrder"
                            name="newOrder"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                            defaultChecked
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label htmlFor="lowStock" className="font-medium">Low Stock Alerts</label>
                          <p className="text-sm text-gray-500">Receive email when product stock is low</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="lowStock"
                            name="lowStock"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                            defaultChecked
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label htmlFor="returns" className="font-medium">Return Requests</label>
                          <p className="text-sm text-gray-500">Receive email when a customer requests a return</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="returns"
                            name="returns"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                            defaultChecked
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label htmlFor="reviews" className="font-medium">New Reviews</label>
                          <p className="text-sm text-gray-500">Receive email when a product receives a review</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="reviews"
                            name="reviews"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                            defaultChecked
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-base font-medium">System Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label htmlFor="browserNotifications" className="font-medium">Browser Notifications</label>
                          <p className="text-sm text-gray-500">Show browser notifications for important events</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="browserNotifications"
                            name="browserNotifications"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                            defaultChecked
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label htmlFor="smsNotifications" className="font-medium">SMS Notifications</label>
                          <p className="text-sm text-gray-500">Receive text messages for critical alerts</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="smsNotifications"
                            name="smsNotifications"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-base font-medium">Summary Reports</h3>
                    <div>
                      <Label htmlFor="summaryFrequency">Email Summary Frequency</Label>
                      <select
                        id="summaryFrequency"
                        name="summaryFrequency"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-[#e91e63] focus:ring-[#e91e63]"
                        defaultValue="daily"
                      >
                        <option value="never">Never</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                      <p className="mt-1 text-sm text-gray-500">
                        Receive a summary report of sales, inventory, and other store metrics.
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
