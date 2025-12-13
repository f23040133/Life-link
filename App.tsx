
import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  MapPin, 
  User as UserIcon, 
  Droplets, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Menu,
  X,
  Award,
  Activity,
  LogOut,
  Users,
  Search,
  LayoutDashboard,
  Building2,
  ArrowLeft,
  Moon,
  Sun,
  Stethoscope,
  MoreHorizontal
} from 'lucide-react';
import { AppView, User, Center, ChatMessage, UserRole, Doctor } from './types';
import { Button } from './components/Button';
import { StatCard } from './components/StatCard';
import { AuthScreen } from './components/AuthScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { HospitalDashboard } from './components/HospitalDashboard';
import { FloatingChat } from './components/FloatingChat';
import { DoctorAppointments } from './components/DoctorAppointments';

// Mock Data for Initial State - Nanjing Locations
const INITIAL_USERS: User[] = [
  { 
    id: '1', name: 'Alex Johnson', email: 'alex@test.com', password: '1234', 
    bloodType: 'O+', role: 'DONOR', totalDonations: 12, livesSaved: 36, 
    lastDonationDate: '2023-10-15', location: 'Gulou District, Nanjing', status: 'Active' 
  },
  { 
    id: '2', name: 'Li Wei', email: 'liwei@test.com', password: '1234', 
    bloodType: 'A-', role: 'DONOR', totalDonations: 5, livesSaved: 15, 
    lastDonationDate: '2023-11-20', location: 'Xuanwu District, Nanjing', status: 'Active' 
  },
  { 
    id: '3', name: 'Chen Yu', email: 'chen@test.com', password: '1234', 
    bloodType: 'B+', role: 'DONOR', totalDonations: 2, livesSaved: 6, 
    lastDonationDate: '2024-01-05', location: 'Jianye District, Nanjing', status: 'Active' 
  },
  { 
    id: 'admin', name: 'System Admin', email: 'admin@lifelink.com', password: '1234', 
    bloodType: 'AB+', role: 'ADMIN', totalDonations: 0, livesSaved: 0, 
    lastDonationDate: '-', location: 'Nanjing HQ', status: 'Active' 
  },
  { 
    id: 'hosp1', name: 'Drum Tower Hospital', email: 'hospital@lifelink.com', password: '1234', 
    bloodType: '-', role: 'HOSPITAL', totalDonations: 0, livesSaved: 0, 
    lastDonationDate: '-', location: 'Gulou District, Nanjing', status: 'Active' 
  },
];

const MOCK_CENTERS: Center[] = [
  { id: 'c1', name: 'Nanjing Drum Tower Hospital', address: '321 Zhongshan Road, Gulou District', distance: '1.2 km', openUntil: '8:00 PM', rating: 4.9 },
  { id: 'c2', name: 'Jiangsu Province Hospital', address: '300 Guangzhou Road, Gulou District', distance: '3.5 km', openUntil: '6:00 PM', rating: 4.8 },
  { id: 'c3', name: 'Nanjing First Hospital', address: '68 Changle Road, Qinhuai District', distance: '5.1 km', openUntil: '5:00 PM', rating: 4.6 },
];

const MOCK_DOCTORS: Doctor[] = [
    { id: 'd1', name: 'Dr. Zhang Min', specialty: 'Hematologist', hospital: 'Drum Tower Hospital', rating: 4.9, availability: 'Today, 2:00 PM', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200' },
    { id: 'd2', name: 'Dr. Wang Wei', specialty: 'General Practitioner', hospital: 'Jiangsu Province Hospital', rating: 4.8, availability: 'Tomorrow, 9:00 AM', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200' },
    { id: 'd3', name: 'Dr. Liu Yan', specialty: 'Immunologist', hospital: 'Nanjing First Hospital', rating: 4.9, availability: 'Today, 4:30 PM', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200' },
    { id: 'd4', name: 'Dr. Chen Bo', specialty: 'Hematologist', hospital: 'Drum Tower Hospital', rating: 4.7, availability: 'Wed, 10:00 AM', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200' },
    { id: 'd5', name: 'Dr. Sarah Lin', specialty: 'Nutritionist', hospital: 'LifeLink Wellness Center', rating: 5.0, availability: 'Thu, 11:00 AM', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200' },
];

const App: React.FC = () => {
  // Initialize users from Local Storage if available, otherwise use initial mock data
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const savedUsers = localStorage.getItem('lifelink_users');
      return savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS;
    } catch (e) {
      console.error('Failed to load users from local storage', e);
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Save users to Local Storage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('lifelink_users', JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users to local storage', e);
    }
  }, [users]);

  // Helper to determine default view based on role
  const getDefaultView = (role?: UserRole): AppView => {
    switch (role) {
      case 'ADMIN': return AppView.DASHBOARD;
      case 'HOSPITAL': return AppView.FIND_DONOR;
      default: return AppView.DASHBOARD;
    }
  };

  useEffect(() => {
    // Reset view when user changes
    if (currentUser) {
        setCurrentView(getDefaultView(currentUser.role));
    }
  }, [currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleRegister = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const NavItem = ({ view, icon: Icon, label }: { view: AppView; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center w-full px-4 py-3.5 text-sm font-semibold transition-all duration-200 rounded-2xl mb-1 ${
        currentView === view
          ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md shadow-red-500/20'
          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
      }`}
    >
      <Icon className={`mr-3 h-5 w-5 ${currentView === view ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
      {label}
    </button>
  );

  const getSidebarItems = () => {
    if (!currentUser) return [];
    
    switch(currentUser.role) {
      case 'ADMIN':
        return [
          { view: AppView.DASHBOARD, icon: LayoutDashboard, label: 'System Overview' },
          { view: AppView.USER_MANAGEMENT, icon: Users, label: 'Manage Users' },
        ];
      case 'HOSPITAL':
        return [
          { view: AppView.FIND_DONOR, icon: Search, label: 'Find Donors' },
          { view: AppView.DASHBOARD, icon: Activity, label: 'My Requests' },
          { view: AppView.PROFILE, icon: Building2, label: 'Hospital Profile' },
        ];
      default: // DONOR
        return [
          { view: AppView.DASHBOARD, icon: Activity, label: 'Dashboard' },
          { view: AppView.DONATE, icon: MapPin, label: 'Find Center' },
          { view: AppView.APPOINTMENTS, icon: Stethoscope, label: 'Doctor Appointment' },
          { view: AppView.PROFILE, icon: UserIcon, label: 'Profile' },
        ];
    }
  };

  const renderContent = () => {
    // Shared Views
    if (currentView === AppView.PROFILE) return renderProfile();

    // Admin Views
    if (currentUser?.role === 'ADMIN') {
        if (currentView === AppView.DASHBOARD || currentView === AppView.USER_MANAGEMENT) {
            return <AdminDashboard users={users} />;
        }
    }

    // Hospital Views
    if (currentUser?.role === 'HOSPITAL') {
        if (currentView === AppView.FIND_DONOR) {
            return <HospitalDashboard users={users} />;
        }
        if (currentView === AppView.DASHBOARD) {
            return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Hospital Request Dashboard (Under Construction)</div>;
        }
    }

    // Donor Views (Default)
    if (currentView === AppView.DASHBOARD) return renderDonorDashboard();
    if (currentView === AppView.DONATE) return renderDonate();
    if (currentView === AppView.APPOINTMENTS) return <DoctorAppointments doctors={MOCK_DOCTORS} />;
    
    return null;
  };

  const renderDonorDashboard = () => {
    if (!currentUser) return null;
    return (
        <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-red-900 dark:to-gray-900 text-white shadow-2xl">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-red-600/30 opacity-50 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-blue-600/20 opacity-30 blur-3xl"></div>
            
            <div className="relative p-10 sm:p-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
                <div>
                <div className="flex items-center space-x-3 mb-3">
                    <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-semibold backdrop-blur-md uppercase tracking-wider">
                    {currentUser.totalDonations > 10 ? 'Elite Donor' : 'New Donor'}
                    </span>
                    <span className="flex items-center text-xs font-medium text-green-400">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                        Active
                    </span>
                </div>
                <h2 className="text-4xl font-bold tracking-tight mb-2">Hello, {currentUser.name}</h2>
                <p className="text-gray-300 text-lg max-w-lg leading-relaxed">
                    Your {currentUser.bloodType} blood can save 3 lives. The world needs heroes like you today.
                </p>
                </div>
                <Button 
                className="bg-white text-gray-900 hover:bg-gray-100 border-none shadow-xl px-8 py-4 text-base font-bold rounded-2xl transition-transform hover:scale-105"
                onClick={() => setCurrentView(AppView.DONATE)}
                >
                Book Donation
                </Button>
            </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Lives Saved" value={currentUser.livesSaved} icon={Heart} color="bg-red-500" subtitle="Impact Score: High" />
            <StatCard title="Donations" value={currentUser.totalDonations} icon={Droplets} color="bg-blue-500" subtitle={currentUser.totalDonations > 0 ? "Next milestone: 15" : "Make your first!"} />
            <StatCard title="Blood Type" value={currentUser.bloodType} icon={Activity} color="bg-purple-500" subtitle="Universal Donor (RBC)" />
            <StatCard title="Next Eligible" value="Available" icon={Calendar} color="bg-green-500" subtitle={`Last: ${currentUser.lastDonationDate}`} />
        </div>

        {/* Recent Activity & Map Teaser */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Activity Feed */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Journey</h3>
                <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <MoreHorizontal className="h-5 w-5 text-gray-400" />
                </button>
            </div>
            {currentUser.totalDonations > 0 ? (
                 <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100 dark:bg-gray-700"></div>
                    
                    <div className="space-y-8">
                        {[1, 2, 3].map((item, index) => (
                        <div key={item} className="relative flex items-start group">
                            <div className="absolute left-0 mt-1.5 w-10 h-10 rounded-full border-4 border-white dark:border-gray-800 bg-red-100 dark:bg-red-900/50 flex items-center justify-center z-10">
                                <Droplets className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="ml-16 flex-1 bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Whole Blood Donation</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Nanjing Drum Tower Hospital</p>
                                    </div>
                                    <span className="text-xs font-medium text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">2 months ago</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                        Verified
                                    </span>
                                    <span className="text-xs text-gray-500">+ 300 Pts</span>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
               </div>
            ) : (
                <div className="text-center py-16 text-gray-400 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <Droplets className="h-12 w-12 mx-auto mb-4 opacity-30 text-red-500" />
                    <h4 className="font-semibold text-gray-600 dark:text-gray-300">No donations yet</h4>
                    <p className="text-sm mt-1">Schedule your first appointment to start your journey!</p>
                </div>
            )}
           
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Urgent Requests</h3>
                <div className="space-y-4 flex-1">
                {MOCK_CENTERS.slice(0, 2).map((center) => (
                    <div key={center.id} className="p-5 rounded-2xl bg-gradient-to-br from-red-50 to-white dark:from-gray-700 dark:to-gray-700/50 border border-red-100 dark:border-gray-600 group hover:shadow-md transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                         <span className="px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-[10px] font-bold rounded uppercase tracking-wider">Urgent A+</span>
                         <span className="text-xs font-bold text-gray-400">{center.distance}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{center.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{center.address}</p>
                    </div>
                ))}
                </div>
                <Button 
                    variant="outline" 
                    fullWidth 
                    className="mt-6 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-red-500 dark:hover:border-gray-400"
                    onClick={() => setCurrentView(AppView.DONATE)}
                >
                    View All Centers
                </Button>
            </div>
        </div>
        </div>
    );
  };

  const renderDonate = () => (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 animate-fade-in">
      {/* List View */}
      <div className="lg:w-1/3 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Donation Centers</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Found 3 locations near Nanjing</p>
          
          <div className="mt-6 relative group">
            <input 
              type="text" 
              placeholder="Search area in Nanjing..." 
              className="w-full pl-12 pr-4 py-3 border-none bg-gray-50 dark:bg-gray-700 rounded-2xl focus:ring-2 focus:ring-red-500 focus:bg-white dark:focus:bg-gray-600 transition-all outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
            />
            <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {MOCK_CENTERS.map((center) => (
            <div key={center.id} className="bg-white dark:bg-gray-700/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-600 hover:shadow-lg hover:border-red-200 dark:hover:border-red-500/30 transition-all cursor-pointer group">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{center.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{center.address}</p>
                  <div className="flex items-center mt-3 text-xs font-medium space-x-3">
                    <span className="flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                      <Clock className="h-3 w-3 mr-1" /> Open until {center.openUntil}
                    </span>
                    <span className="flex items-center text-gray-500 dark:text-gray-400">
                      <MapPin className="h-3 w-3 mr-1" /> {center.distance}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                    <span className="text-xs font-bold bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 px-2 py-1 rounded-lg flex items-center">
                        <span className="mr-1">★</span> {center.rating}
                    </span>
                </div>
              </div>
              <Button size="sm" fullWidth className="mt-4 h-10 text-xs font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 shadow-none">
                Book Appointment
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Map View Placeholder */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden relative shadow-inner border border-gray-200 dark:border-gray-700 group">
        <img 
            src="https://picsum.photos/seed/map/1200/800" 
            alt="Map" 
            className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
        />
        <div className="absolute top-6 right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/20 max-w-xs">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Interactive Map</h4>
            <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">Find the nearest center in Nanjing quickly.</p>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => {
    if (!currentUser) return null;
    return (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 animate-fade-in p-4">
        <div className="text-center bg-white dark:bg-gray-800 p-12 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 max-w-md w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-700 dark:to-gray-800"></div>
            
            <div className="relative z-10">
                <div className="w-28 h-28 bg-white dark:bg-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-gray-400 dark:text-gray-500 uppercase p-1 shadow-lg">
                        <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                            {currentUser.name.charAt(0)}{currentUser.name.split(' ')[1]?.charAt(0)}
                        </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{currentUser.name}</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1 mb-8 font-medium">{currentUser.email || 'user@lifelink.com'}</p>
                <div className="inline-block bg-red-50 dark:bg-red-900/20 px-4 py-1.5 rounded-full text-xs font-bold text-red-600 dark:text-red-400 mb-8 uppercase tracking-wider border border-red-100 dark:border-red-900/30">
                    {currentUser.role}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{currentUser.bloodType || '-'}</div>
                            <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Blood Type</div>
                        </div>
                        <div className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{currentUser.totalDonations}</div>
                            <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Donations</div>
                        </div>
                </div>

                <Button variant="outline" fullWidth onClick={handleLogout} className="border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20 dark:border-red-900/50 dark:text-red-400 py-3.5 rounded-xl font-bold">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                </Button>
            </div>
        </div>
        </div>
    );
  };

  // If not logged in, show Auth Screen with Floating Chat
  if (!currentUser) {
    return (
        <>
            <AuthScreen users={users} onLogin={handleLogin} onRegister={handleRegister} />
            <FloatingChat />
        </>
    );
  }

  // Calculate default view for back button logic
  const defaultView = getDefaultView(currentUser.role);
  const showBackButton = currentView !== defaultView;

  // Main App Interface
  return (
    <div className="min-h-screen bg-[#F3F4F6] dark:bg-[#0f172a] font-sans text-slate-800 dark:text-gray-200 flex transition-colors duration-200">
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed h-full z-10 transition-colors duration-200 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
        <div className="p-8 flex items-center space-x-3">
          <div className="bg-gradient-to-br from-red-600 to-red-500 p-2.5 rounded-2xl shadow-lg shadow-red-500/30">
             <Droplets className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">LifeLink</span>
        </div>
        
        <nav className="flex-1 px-6 space-y-1 mt-2">
            <p className="px-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 mt-2">Menu</p>
            {getSidebarItems().map((item) => (
                <NavItem key={item.label} view={item.view} icon={item.icon} label={item.label} />
            ))}
        </nav>

        {currentUser.role === 'DONOR' && (
            <div className="mx-6 mb-6 p-5 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-red-900 dark:to-red-950 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="flex items-center space-x-3 mb-3 relative z-10">
                    <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                        <Award className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                        <span className="font-bold text-sm block">Platinum Status</span>
                        <span className="text-[10px] text-gray-400 block">Top 5% Donor</span>
                    </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-1.5 rounded-full w-[80%] shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                </div>
                <p className="text-[10px] text-gray-400 relative z-10">80% to next reward tier</p>
            </div>
        )}

        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-3">
           <button 
             onClick={toggleDarkMode}
             className="flex items-center justify-between w-full p-3 rounded-2xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
           >
              <div className="flex items-center space-x-3">
                  {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <span className="text-sm font-medium">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
           </button>

           <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2.5 rounded-2xl transition-all group" onClick={() => setCurrentView(AppView.PROFILE)}>
               <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-300 font-bold uppercase group-hover:bg-red-100 dark:group-hover:bg-red-900/30 group-hover:text-red-600 transition-colors">
                 {currentUser.name.charAt(0)}{currentUser.name.split(' ')[1]?.charAt(0)}
               </div>
               <div className="flex-1 min-w-0">
                   <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-red-600 transition-colors">{currentUser.name}</p>
                   <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser.role}</p>
               </div>
               <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-red-500" />
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 min-h-screen flex flex-col transition-colors duration-200 relative">
        
        {/* Decorative background Elements */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-gray-200/50 to-transparent dark:from-gray-800/20 dark:to-transparent pointer-events-none z-0"></div>

        {/* Mobile Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-2">
               <div className="bg-red-600 p-1.5 rounded-lg">
                    <Droplets className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">LifeLink</span>
            </div>
            <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                </button>
                <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>
          </div>
          
          {/* Mobile Navigation Dropdown */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg px-4 py-4 space-y-2 animate-slide-down">
                {getSidebarItems().map((item) => (
                     <NavItem key={item.label} view={item.view} icon={item.icon} label={item.label} />
                ))}
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                </button>
            </div>
          )}
        </header>

        {/* Content Container */}
        <div className="p-4 lg:p-10 flex-1 overflow-x-hidden relative z-0">
            {showBackButton && (
                <button 
                    onClick={() => setCurrentView(defaultView)} 
                    className="group mb-8 flex items-center text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-xl mr-3 group-hover:scale-105 transition-transform shadow-sm">
                        <ArrowLeft className="h-4 w-4" />
                    </div>
                    Back to Dashboard
                </button>
            )}
            {renderContent()}
            
            {/* AI Assistant Floating Chat */}
            <FloatingChat />
        </div>
      </main>
    </div>
  );
};

export default App;
