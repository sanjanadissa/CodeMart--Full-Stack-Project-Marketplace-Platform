import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit, Star, Package, TrendingUp } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: 'January 2024',
    rating: 4.8,
    totalSales: 45,
    totalEarnings: 15420
  };

  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      price: 299,
      sales: 15,
      rating: 4.8,
      status: 'Active',
      image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      title: 'Task Management App',
      price: 199,
      sales: 12,
      rating: 4.6,
      status: 'Active',
      image: 'https://images.pexels.com/photos/3183165/pexels-photo-3183165.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      title: 'Weather Dashboard',
      price: 149,
      sales: 18,
      rating: 4.9,
      status: 'Pending',
      image: 'https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const stats = [
    { label: 'Total Projects', value: '12', icon: Package, color: 'text-blue-600 bg-blue-100' },
    { label: 'Total Sales', value: user.totalSales, icon: TrendingUp, color: 'text-green-600 bg-green-100' },
    { label: 'Average Rating', value: user.rating, icon: Star, color: 'text-yellow-600 bg-yellow-100' },
    { label: 'Total Earnings', value: `$${user.totalEarnings}`, icon: TrendingUp, color: 'text-purple-600 bg-purple-100' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover"
              />
              <button className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors">
                <Edit className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
              <div className="space-y-2 text-gray-600 mb-4">
                <div className="flex items-center justify-center md:justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  {user.email}
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  {user.phone}
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  {user.location}
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold">{user.rating}</span>
                  <span className="text-gray-500 ml-1">rating</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-gray-600">Member since {user.joinDate}</span>
              </div>
            </div>
            
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm p-6 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-in">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {['overview', 'projects', 'purchases', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-4"></div>
                      <div>
                        <p className="font-medium text-gray-900">New sale: E-commerce Platform</p>
                        <p className="text-sm text-gray-600">2 hours ago • $299</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
                      <div>
                        <p className="font-medium text-gray-900">Project updated: Task Management App</p>
                        <p className="text-sm text-gray-600">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-4"></div>
                      <div>
                        <p className="font-medium text-gray-900">New review received (5 stars)</p>
                        <p className="text-sm text-gray-600">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    Add New Project
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-gray-50 rounded-xl overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            project.status === 'Active' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {project.status}
                          </span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm">{project.rating}</span>
                          </div>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">{project.title}</h3>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Price: ${project.price}</span>
                          <span>Sales: {project.sales}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'purchases' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Purchase History</h2>
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No purchases yet</p>
                  <p className="text-gray-400">When you buy projects, they'll appear here</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                        <span className="ml-2 text-gray-700">Email notifications for new sales</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                        <span className="ml-2 text-gray-700">Email notifications for new reviews</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                        <span className="ml-2 text-gray-700">Marketing emails</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                        <span className="ml-2 text-gray-700">Show profile publicly</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                        <span className="ml-2 text-gray-700">Allow contact from buyers</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;