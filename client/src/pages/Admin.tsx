import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Package, Users, Percent, ShoppingCart, Calendar, Mail, Phone, MapPin, Lock } from 'lucide-react';

const Admin = () => {
  console.log('Admin component loaded');
  
  // Set page title for admin
  useEffect(() => {
    document.title = 'Admin Dashboard - Anchor Fit';
  }, []);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminToken, setAdminToken] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    discount_percentage: '',
    usage_limit: '',
    expires_at: ''
  });
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { toast } = useToast();

  // Admin login with proper authentication
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAdminToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem('adminToken', data.token);
        fetchOrders(data.token);
        toast({
          title: "Success!",
          description: "Admin login successful",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Access Denied",
          description: error.error || "Invalid admin credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async (token?: string) => {
    try {
      const authToken = token || adminToken;
      const response = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
        
        // Calculate stats
        const totalOrders = ordersData.length;
        const totalRevenue = ordersData.reduce((sum: number, order: any) => 
          sum + parseFloat(order.total_amount), 0);
        const pendingOrders = ordersData.filter((order: any) => order.status === 'pending').length;
        const completedOrders = ordersData.filter((order: any) => order.status === 'completed').length;
        
        setStats({ totalOrders, totalRevenue, pendingOrders, completedOrders });
      } else {
        if (response.status === 401 || response.status === 403) {
          // Token expired or invalid, logout
          setIsAuthenticated(false);
          setAdminToken('');
          localStorage.removeItem('adminToken');
          toast({
            title: "Session Expired",
            description: "Please log in again",
            variant: "destructive",
          });
        } else {
          throw new Error('Failed to fetch orders');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoadingOrders(false);
    }
  };

  // Check for stored admin token on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      setAdminToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch orders when authenticated
  useEffect(() => {
    if (isAuthenticated && adminToken) {
      fetchOrders(adminToken);
    }
  }, [isAuthenticated, adminToken]);

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-white text-3xl font-bold mb-2">Admin Access</CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Enter admin credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-white text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="bg-white/5 border-white/20 text-white mt-2 h-12 text-lg placeholder:text-gray-400"
                  placeholder="Enter admin email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-white text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="bg-white/5 border-white/20 text-white mt-2 h-12 text-lg placeholder:text-gray-400"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 text-lg font-semibold disabled:opacity-50"
              >
                {isLoading ? 'Logging in...' : 'Access Admin Panel'}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Button 
                variant="link" 
                className="text-gray-300 hover:text-white text-sm"
                onClick={() => window.location.href = '/'}
              >
                ← Back to Store
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/generate-promo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          code: formData.code,
          discount_percentage: parseInt(formData.discount_percentage),
          usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
          expires_at: formData.expires_at || null
        }),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: `Promo code ${formData.code} created successfully`,
        });
        setFormData({ code: '', discount_percentage: '', usage_limit: '', expires_at: '' });
      } else {
        if (response.status === 401 || response.status === 403) {
          // Token expired or invalid, logout
          setIsAuthenticated(false);
          setAdminToken('');
          localStorage.removeItem('adminToken');
          toast({
            title: "Session Expired",
            description: "Please log in again",
            variant: "destructive",
          });
        } else {
          const error = await response.json();
          toast({
            title: "Error",
            description: error.error || "Failed to create promo code",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Anchor Fit Admin Dashboard</h1>
              <p className="text-gray-600 text-lg">Manage your store, orders, and promotions</p>
            </div>
            <Button 
              onClick={() => {
                setIsAuthenticated(false);
                setAdminToken('');
                localStorage.removeItem('adminToken');
              }}
              variant="outline"
              className="bg-white hover:bg-gray-50"
            >
              Logout
            </Button>
          </div>
          <div className="flex justify-center">
            <div className="bg-white rounded-full px-6 py-2 shadow-sm">
              <span className="text-sm font-medium text-gray-700">Welcome back, Admin</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full lg:w-auto grid-cols-4 lg:grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">📊 Overview</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">📦 Orders</TabsTrigger>
            <TabsTrigger value="promos" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">🎫 Promo Codes</TabsTrigger>
            <TabsTrigger value="guide" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">📚 Quick Guide</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-900">Total Orders</CardTitle>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">{stats.totalOrders}</div>
                  <p className="text-xs text-blue-600">All time orders</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-900">Total Revenue</CardTitle>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Package className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">₦{stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-green-600">Total earnings</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-900">Pending Orders</CardTitle>
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-900">{stats.pendingOrders}</div>
                  <p className="text-xs text-yellow-600">Need attention</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-900">Completed</CardTitle>
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">{stats.completedOrders}</div>
                  <p className="text-xs text-purple-600">Fulfilled orders</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders Preview */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <p>Loading orders...</p>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Order #{order.id.slice(-8)}</p>
                          <p className="text-sm text-gray-600">₦{parseFloat(order.total_amount).toLocaleString()}</p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No orders yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>View and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <p>Loading orders...</p>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order: any) => {
                      const customerDetails = typeof order.customer_details === 'string' 
                        ? JSON.parse(order.customer_details) 
                        : order.customer_details;
                      const items = typeof order.items === 'string' 
                        ? JSON.parse(order.items) 
                        : order.items;

                      return (
                        <Card key={order.id} className="p-6">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Order #{order.id.slice(-8)}</h3>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                              </div>
                              
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  <span>{customerDetails.fullName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  <span>{customerDetails.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  <span>{customerDetails.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{customerDetails.address}, {customerDetails.state}</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-3">Order Items</h4>
                              <div className="space-y-2">
                                {items.map((item: any, index: number) => (
                                  <div key={index} className="flex justify-between text-sm">
                                    <span>{item.name} ({item.size}, {item.color}) x{item.quantity}</span>
                                    <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="mt-4 pt-4 border-t">
                                <div className="flex justify-between text-sm">
                                  <span>Subtotal:</span>
                                  <span>₦{(parseFloat(order.total_amount) + parseFloat(order.discount_amount || 0)).toLocaleString()}</span>
                                </div>
                                {order.discount_amount > 0 && (
                                  <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount:</span>
                                    <span>-₦{parseFloat(order.discount_amount).toLocaleString()}</span>
                                  </div>
                                )}
                                <div className="flex justify-between font-semibold">
                                  <span>Total:</span>
                                  <span>₦{parseFloat(order.total_amount).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 text-xs text-gray-500">
                            Ordered: {new Date(order.created_at).toLocaleDateString()}
                            {order.paystack_reference && (
                              <span className="ml-4">Paystack: {order.paystack_reference}</span>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No orders found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Promo Codes Tab */}
          <TabsContent value="promos">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Create Promo Code</CardTitle>
                  <CardDescription>Generate new discount codes for marketing</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="code">Promo Code</Label>
                      <Input
                        id="code"
                        placeholder="LAUNCH25"
                        value={formData.code}
                        onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="discount">Discount Percentage</Label>
                      <Input
                        id="discount"
                        type="number"
                        placeholder="25"
                        min="1"
                        max="99"
                        value={formData.discount_percentage}
                        onChange={(e) => setFormData({...formData, discount_percentage: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="usage_limit">Usage Limit (Optional)</Label>
                      <Input
                        id="usage_limit"
                        type="number"
                        placeholder="100"
                        min="1"
                        value={formData.usage_limit}
                        onChange={(e) => setFormData({...formData, usage_limit: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="expires_at">Expiration Date (Optional)</Label>
                      <Input
                        id="expires_at"
                        type="date"
                        value={formData.expires_at}
                        onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                      />
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? 'Creating...' : 'Create Promo Code'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Examples</CardTitle>
                  <CardDescription>Common promo code patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900">LAUNCH25</h4>
                      <p className="text-sm text-blue-700">25% off launch campaign</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900">FIRST10</h4>
                      <p className="text-sm text-green-700">10% off first order</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-900">SUMMER50</h4>
                      <p className="text-sm text-purple-700">50% summer sale</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h4 className="font-medium text-orange-900">VIP20</h4>
                      <p className="text-sm text-orange-700">20% VIP customer discount</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Quick Guide Tab */}
          <TabsContent value="guide">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Access</CardTitle>
                  <CardDescription>How to access this dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <strong>URL:</strong> Add <code>/admin</code> to your website URL<br />
                        <strong>Example:</strong> <code>https://your-store.replit.app/admin</code>
                      </p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <h4 className="font-medium">Dashboard Features:</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• View sales overview and statistics</li>
                        <li>• Manage all customer orders</li>
                        <li>• Create and track promo codes</li>
                        <li>• Monitor revenue and performance</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>How to handle customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-medium">Order Status:</h4>
                      <div className="grid gap-2 mt-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-yellow-100 text-yellow-800">pending</Badge>
                          <span className="text-gray-600">Payment processing</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800">completed</Badge>
                          <span className="text-gray-600">Payment confirmed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-red-100 text-red-800">cancelled</Badge>
                          <span className="text-gray-600">Order cancelled</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">Customer Info:</h4>
                      <p className="text-gray-600">All orders show customer contact details and shipping address for easy fulfillment.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;