import React, { useState, useEffect } from 'react';
import { Mail, Users, Send, Trash2, FileText, Plus, Search, Filter, Download, Upload, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Label } from '../../../components/ui/label';

// Mock newsletter service and data
const generateMockSubscribers = (count = 100) => {
  const subscribers = [];
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
  const sources = ['Website', 'Checkout', 'Social Media', 'Referral', 'Event'];
  const statuses = ['Active', 'Unsubscribed', 'Bounced', 'Pending'];

  for (let i = 1; i <= count; i++) {
    const firstName = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa'][Math.floor(Math.random() * 6)];
    const lastName = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller'][Math.floor(Math.random() * 6)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const subscribedDate = new Date();
    subscribedDate.setDate(subscribedDate.getDate() - Math.floor(Math.random() * 365));
    
    subscribers.push({
      id: i,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@${domain}`,
      name: `${firstName} ${lastName}`,
      status,
      source,
      subscribedDate: subscribedDate.toISOString().split('T')[0],
      groups: Math.random() > 0.5 ? ['All Customers'] : ['All Customers', 'Newsletter']
    });
  }
  
  return subscribers;
};

const generateMockCampaigns = () => [
  {
    id: 1,
    name: 'Summer Collection 2025',
    status: 'Sent',
    sentDate: '2025-05-01',
    recipients: 1243,
    openRate: '32.4%',
    clickRate: '12.8%',
  },
  {
    id: 2,
    name: 'Exclusive Mother\'s Day Discount',
    status: 'Scheduled',
    scheduledDate: '2025-05-10',
    recipients: 1500,
    openRate: '-',
    clickRate: '-',
  },
  {
    id: 3,
    name: 'New Baby Clothing Arrivals',
    status: 'Draft',
    lastUpdated: '2025-04-28',
    recipients: 0,
    openRate: '-',
    clickRate: '-',
  },
  {
    id: 4,
    name: 'Easter Flash Sale',
    status: 'Sent',
    sentDate: '2025-04-15',
    recipients: 1122,
    openRate: '28.9%',
    clickRate: '9.6%',
  },
  {
    id: 5,
    name: 'Welcome Series: Email 1',
    status: 'Active',
    lastUpdated: '2025-04-10',
    recipients: 356,
    openRate: '41.2%',
    clickRate: '15.3%',
  },
];

const NewsletterPage = () => {
  // State for tabs, data, pagination, etc.
  const [activeTab, setActiveTab] = useState('subscribers');
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [sortField, setSortField] = useState('subscribedDate');
  const [sortDirection, setSortDirection] = useState('desc');
  
  const itemsPerPage = 10;

  // Load mock data
  useEffect(() => {
    setSubscribers(generateMockSubscribers());
    setCampaigns(generateMockCampaigns());
  }, []);

  // Filter and sort subscribers
  const filteredSubscribers = subscribers.filter(subscriber => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      subscriber.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscriber.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'All' || subscriber.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    // Sort based on current sort field and direction
    if (sortDirection === 'asc') {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
  const paginatedSubscribers = filteredSubscribers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sort toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle checkbox selection
  const handleSelectSubscriber = (id) => {
    if (selectedSubscribers.includes(id)) {
      setSelectedSubscribers(selectedSubscribers.filter(subId => subId !== id));
    } else {
      setSelectedSubscribers([...selectedSubscribers, id]);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedSubscribers.length === paginatedSubscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(paginatedSubscribers.map(sub => sub.id));
    }
  };

  // Campaign creation form (simplified)
  const CampaignForm = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="campaignName">Campaign Name</Label>
        <Input id="campaignName" placeholder="e.g., Summer Sale 2025" />
      </div>
      <div>
        <Label htmlFor="subject">Email Subject</Label>
        <Input id="subject" placeholder="Enter email subject line" />
      </div>
      <div>
        <Label htmlFor="template">Select Template</Label>
        <select id="template" className="w-full rounded-md border border-gray-300 p-2">
          <option value="default">Default Template</option>
          <option value="promotional">Promotional Template</option>
          <option value="newsletter">Newsletter Template</option>
          <option value="announcement">Announcement Template</option>
        </select>
      </div>
      <div>
        <Label>Recipients</Label>
        <div className="mt-2 space-y-2">
          <div className="flex items-center">
            <input 
              type="radio" 
              id="allSubscribers" 
              name="recipients" 
              className="h-4 w-4 border-gray-300 text-[#e91e63] focus:ring-[#e91e63]" 
              defaultChecked 
            />
            <label htmlFor="allSubscribers" className="ml-2 text-sm">
              All Subscribers ({subscribers.filter(sub => sub.status === 'Active').length})
            </label>
          </div>
          <div className="flex items-center">
            <input 
              type="radio" 
              id="selectedSubscribers" 
              name="recipients" 
              className="h-4 w-4 border-gray-300 text-[#e91e63] focus:ring-[#e91e63]" 
            />
            <label htmlFor="selectedSubscribers" className="ml-2 text-sm">
              Selected Subscribers ({selectedSubscribers.length})
            </label>
          </div>
        </div>
      </div>
      <div className="rounded-md bg-blue-50 p-4 text-blue-700">
        <p className="text-sm">
          <strong>Note:</strong> This is a simplified form. In a real application, you would 
          add an email builder or rich text editor to create the email content.
        </p>
      </div>
      <div className="flex gap-4">
        <Button 
          onClick={() => setIsCreatingCampaign(false)} 
          variant="outline"
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          className="flex-1 bg-[#e91e63] hover:bg-[#c2185b]"
          onClick={() => {
            alert('Campaign created successfully!');
            setIsCreatingCampaign(false);
          }}
        >
          <Send className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="container px-4 py-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Newsletter Management</h1>
          {activeTab === 'campaigns' && !isCreatingCampaign && (
            <Button 
              className="mt-4 bg-[#e91e63] hover:bg-[#c2185b] sm:mt-0"
              onClick={() => setIsCreatingCampaign(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          )}
        </div>

        {isCreatingCampaign ? (
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Create New Campaign</h2>
            </div>
            <CampaignForm />
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="mb-6 border-b">
              <div className="flex space-x-4">
                <button
                  className={`py-2 px-1 ${
                    activeTab === 'subscribers'
                      ? 'border-b-2 border-[#e91e63] font-medium text-[#e91e63]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('subscribers')}
                >
                  <Users className="mr-2 inline-block h-5 w-5" />
                  Subscribers
                </button>
                <button
                  className={`py-2 px-1 ${
                    activeTab === 'campaigns'
                      ? 'border-b-2 border-[#e91e63] font-medium text-[#e91e63]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('campaigns')}
                >
                  <Mail className="mr-2 inline-block h-5 w-5" />
                  Campaigns
                </button>
              </div>
            </div>

            {/* Subscribers Tab */}
            {activeTab === 'subscribers' && (
              <div className="rounded-lg border bg-white shadow-sm">
                <div className="p-4 sm:p-6">
                  <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        placeholder="Search subscribers..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        className="rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm"
                        value={statusFilter}
                        onChange={(e) => {
                          setStatusFilter(e.target.value);
                          setCurrentPage(1);
                        }}
                      >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Unsubscribed">Unsubscribed</option>
                        <option value="Bounced">Bounced</option>
                        <option value="Pending">Pending</option>
                      </select>
                      <Button variant="outline" size="sm" className="hidden sm:flex">
                        <Filter className="mr-2 h-4 w-4" />
                        More Filters
                      </Button>
                      <Button variant="outline" size="sm" className="hidden sm:flex">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm" className="hidden sm:flex">
                        <Upload className="mr-2 h-4 w-4" />
                        Import
                      </Button>
                    </div>
                  </div>

                  {selectedSubscribers.length > 0 && (
                    <div className="mb-4 rounded-md bg-gray-50 p-2 sm:p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm">
                          <span className="font-medium">{selectedSubscribers.length}</span> subscribers selected
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedSubscribers([])}>
                            Clear Selection
                          </Button>
                          <Button size="sm" className="bg-[#e91e63] hover:bg-[#c2185b]">
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 font-medium">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                                checked={selectedSubscribers.length === paginatedSubscribers.length && paginatedSubscribers.length > 0}
                                onChange={handleSelectAll}
                              />
                            </div>
                          </th>
                          <th 
                            className="px-4 py-3 font-medium cursor-pointer"
                            onClick={() => handleSort('email')}
                          >
                            <div className="flex items-center">
                              Email
                              {sortField === 'email' && (
                                sortDirection === 'asc' ? 
                                <ChevronUp className="ml-1 h-4 w-4" /> : 
                                <ChevronDown className="ml-1 h-4 w-4" />
                              )}
                            </div>
                          </th>
                          <th 
                            className="px-4 py-3 font-medium cursor-pointer"
                            onClick={() => handleSort('name')}
                          >
                            <div className="flex items-center">
                              Name
                              {sortField === 'name' && (
                                sortDirection === 'asc' ? 
                                <ChevronUp className="ml-1 h-4 w-4" /> : 
                                <ChevronDown className="ml-1 h-4 w-4" />
                              )}
                            </div>
                          </th>
                          <th 
                            className="px-4 py-3 font-medium cursor-pointer"
                            onClick={() => handleSort('status')}
                          >
                            <div className="flex items-center">
                              Status
                              {sortField === 'status' && (
                                sortDirection === 'asc' ? 
                                <ChevronUp className="ml-1 h-4 w-4" /> : 
                                <ChevronDown className="ml-1 h-4 w-4" />
                              )}
                            </div>
                          </th>
                          <th 
                            className="px-4 py-3 font-medium cursor-pointer"
                            onClick={() => handleSort('subscribedDate')}
                          >
                            <div className="flex items-center">
                              Subscribed Date
                              {sortField === 'subscribedDate' && (
                                sortDirection === 'asc' ? 
                                <ChevronUp className="ml-1 h-4 w-4" /> : 
                                <ChevronDown className="ml-1 h-4 w-4" />
                              )}
                            </div>
                          </th>
                          <th 
                            className="px-4 py-3 font-medium cursor-pointer"
                            onClick={() => handleSort('source')}
                          >
                            <div className="flex items-center">
                              Source
                              {sortField === 'source' && (
                                sortDirection === 'asc' ? 
                                <ChevronUp className="ml-1 h-4 w-4" /> : 
                                <ChevronDown className="ml-1 h-4 w-4" />
                              )}
                            </div>
                          </th>
                          <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedSubscribers.map((subscriber) => (
                          <tr key={subscriber.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-[#e91e63] focus:ring-[#e91e63]"
                                checked={selectedSubscribers.includes(subscriber.id)}
                                onChange={() => handleSelectSubscriber(subscriber.id)}
                              />
                            </td>
                            <td className="px-4 py-3">{subscriber.email}</td>
                            <td className="px-4 py-3">{subscriber.name}</td>
                            <td className="px-4 py-3">
                              <Badge className={
                                subscriber.status === 'Active' ? 'bg-green-100 text-green-800' :
                                subscriber.status === 'Unsubscribed' ? 'bg-red-100 text-red-800' :
                                subscriber.status === 'Bounced' ? 'bg-orange-100 text-orange-800' :
                                'bg-blue-100 text-blue-800'
                              }>
                                {subscriber.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">{subscriber.subscribedDate}</td>
                            <td className="px-4 py-3">{subscriber.source}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-2">
                                <button className="text-gray-500 hover:text-[#e91e63]">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="text-gray-500 hover:text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {paginatedSubscribers.length === 0 && (
                          <tr>
                            <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                              No subscribers found matching your criteria
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredSubscribers.length)} of {filteredSubscribers.length} subscribers
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          Previous
                        </Button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={i}
                              size="sm"
                              variant={currentPage === pageNum ? "default" : "outline"}
                              className={currentPage === pageNum ? "bg-[#e91e63] hover:bg-[#c2185b]" : ""}
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Campaigns Tab */}
            {activeTab === 'campaigns' && (
              <div className="rounded-lg border bg-white shadow-sm">
                <div className="p-4 sm:p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 font-medium">Campaign Name</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                          <th className="px-4 py-3 font-medium">Date</th>
                          <th className="px-4 py-3 font-medium">Recipients</th>
                          <th className="px-4 py-3 font-medium">Open Rate</th>
                          <th className="px-4 py-3 font-medium">Click Rate</th>
                          <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaigns.map((campaign) => (
                          <tr key={campaign.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{campaign.name}</td>
                            <td className="px-4 py-3">
                              <Badge className={
                                campaign.status === 'Sent' ? 'bg-green-100 text-green-800' :
                                campaign.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                                campaign.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                                'bg-purple-100 text-purple-800'
                              }>
                                {campaign.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              {campaign.sentDate || campaign.scheduledDate || campaign.lastUpdated}
                              {campaign.scheduledDate && <span className="text-xs text-gray-500"> (Scheduled)</span>}
                            </td>
                            <td className="px-4 py-3">{campaign.recipients.toLocaleString()}</td>
                            <td className="px-4 py-3">{campaign.openRate}</td>
                            <td className="px-4 py-3">{campaign.clickRate}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-2">
                                {campaign.status === 'Draft' && (
                                  <button className="text-gray-500 hover:text-[#e91e63]">
                                    <Edit className="h-4 w-4" />
                                  </button>
                                )}
                                {campaign.status === 'Sent' && (
                                  <button className="text-gray-500 hover:text-[#e91e63]">
                                    <FileText className="h-4 w-4" />
                                  </button>
                                )}
                                {campaign.status === 'Scheduled' && (
                                  <button className="text-gray-500 hover:text-[#e91e63]">
                                    <Edit className="h-4 w-4" />
                                  </button>
                                )}
                                <button className="text-gray-500 hover:text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default NewsletterPage;
