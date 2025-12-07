
import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  MapPin, 
  MessageCircle, 
  User as UserIcon, 
  Droplets, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Send,
  Menu,
  X,
  Award,
  Activity,
  LogOut,
  Users,
  Search,
  LayoutDashboard,
  Building2,
  ArrowLeft
} from 'lucide-react';
import { AppView, User, Center, ChatMessage, UserRole } from './types';
import { Button } from './components/Button';
import { StatCard } from './components/StatCard';
import { AuthScreen } from './components/AuthScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { HospitalDashboard } from './components/HospitalDashboard';
import { sendMessageToAI, initializeChat } from './services/geminiService';

// Mock Data for Initial State - Updated to Nanjing Locations and Default Password '1234'
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
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

        initializeChat();
        setMessages([
            { id: '1', role: 'model', text: `Hi ${currentUser.name.split(' ')[0]}! I'm LifeLink AI. Ask me about donation eligibility or health tips!`, timestamp: new Date() }
        ]);
    }
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleRegister = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setMessages([]);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    const responseText = await sendMessageToAI(userMsg.text);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const NavItem = ({ view, icon: Icon, label }: { view: AppView; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-xl ${
        currentView === view
          ? 'bg-red-50 text-red-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon className={`mr-3 h-5 w-5 ${currentView === view ? 'text-red-600' : 'text-gray-400'}`} />
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
          { view: AppView.ASSISTANT, icon: MessageCircle, label: 'AI Assistant' },
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
          { view: AppView.ASSISTANT, icon: MessageCircle, label: 'AI Assistant' },
          { view: AppView.PROFILE, icon: UserIcon, label: 'Profile' },
        ];
    }
  };

  const renderContent = () => {
    // Shared Views
    if (currentView === AppView.ASSISTANT) return renderAssistant();
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
            return <div className="p-8 text-center text-gray-500">Hospital Request Dashboard (Under Construction)</div>;
        }
    }

    // Donor Views (Default)
    if (currentView === AppView.DASHBOARD) return renderDonorDashboard();
    if (currentView === AppView.DONATE) return renderDonate();
    
    return null;
  };

  const renderDonorDashboard = () => {
    if (!currentUser) return null;
    return (
        <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 to-red-800 text-white shadow-xl">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-red-400 opacity-20 blur-3xl"></div>
            
            <div className="relative p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                <div className="flex items-center space-x-2 mb-2">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm">
                    {currentUser.totalDonations > 10 ? 'Elite Donor' : 'New Donor'}
                    </span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Welcome back, {currentUser.name}</h2>
                <p className="mt-2 text-red-100 text-lg max-w-md">
                    Your {currentUser.bloodType} blood type is in high demand right now. You can help save 3 lives today.
                </p>
                </div>
                <Button 
                className="bg-white text-red-700 hover:bg-red-50 hover:text-red-800 border-none shadow-lg"
                onClick={() => setCurrentView(AppView.DONATE)}
                >
                Schedule Donation
                </Button>
            </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Lives Saved" value={currentUser.livesSaved} icon={Heart} color="bg-red-500" subtitle="Impact Score: High" />
            <StatCard title="Donations" value={currentUser.totalDonations} icon={Droplets} color="bg-blue-500" subtitle={currentUser.totalDonations > 0 ? "Next milestone: 15" : "Make your first!"} />
            <StatCard title="Blood Type" value={currentUser.bloodType} icon={Activity} color="bg-purple-500" subtitle="Universal Donor (RBC)" />
            <StatCard title="Next Eligible" value="Available Now" icon={Calendar} color="bg-green-500" subtitle={`Last: ${currentUser.lastDonationDate}`} />
        </div>

        {/* Recent Activity & Map Teaser */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Activity Feed */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                <button className="text-sm text-red-600 font-medium hover:text-red-700">View All</button>
            </div>
            {currentUser.totalDonations > 0 ? (
                 <div className="space-y-6">
                 {[1, 2, 3].map((item) => (
                   <div key={item} className="flex items-start pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                     <div className="flex-shrink-0 bg-red-50 rounded-full p-2.5">
                       <Droplets className="h-5 w-5 text-red-600" />
                     </div>
                     <div className="ml-4 flex-1">
                       <div className="flex justify-between">
                         <p className="text-sm font-semibold text-gray-900">Whole Blood Donation</p>
                         <span className="text-xs text-gray-400">2 months ago</span>
                       </div>
                       <p className="text-sm text-gray-500 mt-1">Nanjing Drum Tower Hospital • 450ml</p>
                       <div className="mt-2 flex items-center space-x-2">
                         <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                           Completed
                         </span>
                         <span className="text-xs text-gray-400">+300 Points</span>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            ) : (
                <div className="text-center py-10 text-gray-400">
                    <Droplets className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>No donations yet. Schedule your first appointment!</p>
                </div>
            )}
           
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Urgent Needs Nearby</h3>
                <div className="space-y-4">
                {MOCK_CENTERS.slice(0, 2).map((center) => (
                    <div key={center.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 group hover:border-red-200 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start">
                        <div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">{center.name}</h4>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" /> {center.distance}
                        </p>
                        </div>
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md">Urgent A+</span>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            <Button 
                variant="outline" 
                fullWidth 
                className="mt-6"
                onClick={() => setCurrentView(AppView.DONATE)}
            >
                Find More Centers
            </Button>
            </div>
        </div>
        </div>
    );
  };

  const renderDonate = () => (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 animate-fade-in">
      {/* List View */}
      <div className="lg:w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Donation Centers</h2>
          <p className="text-sm text-gray-500 mt-1">Found 3 locations near Nanjing</p>
          
          <div className="mt-4 relative">
            <input 
              type="text" 
              placeholder="Search area in Nanjing..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
            />
            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {MOCK_CENTERS.map((center) => (
            <div key={center.id} className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md hover:border-red-200 transition-all cursor-pointer group">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-red-600">{center.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{center.address}</p>
                  <div className="flex items-center mt-3 text-xs text-gray-500 space-x-3">
                    <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-md">
                      <Clock className="h-3 w-3 mr-1" /> Open until {center.openUntil}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" /> {center.distance}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                    <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        ★ {center.rating}
                    </span>
                </div>
              </div>
              <Button size="sm" fullWidth className="mt-4 h-8 text-xs">
                Book Appointment
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Map View Placeholder */}
      <div className="flex-1 bg-gray-100 rounded-2xl overflow-hidden relative shadow-inner">
        <img 
            src="https://picsum.photos/seed/map/1200/800" 
            alt="Map" 
            className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
        />
        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg max-w-xs">
            <h4 className="font-bold text-gray-900 text-sm">Map View</h4>
            <p className="text-xs text-gray-500 mt-1">Interactive map integration would go here using Google Maps Grounding.</p>
        </div>
      </div>
    </div>
  );

  const renderAssistant = () => (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-full">
                <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
                <h2 className="text-white font-bold">LifeLink Assistant</h2>
                <p className="text-gray-300 text-xs flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                    Online • Powered by Gemini
                </p>
            </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] lg:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-red-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
              }`}
            >
              {msg.text.split('\n').map((line, i) => (
                  <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
              ))}
              <div className={`text-[10px] mt-2 text-right ${msg.role === 'user' ? 'text-red-100' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="bg-white rounded-2xl rounded-bl-none border border-gray-100 px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleChatSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about eligibility, health tips, or donor rewards..."
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-sm"
          />
          <Button type="submit" disabled={!inputText.trim() || isTyping} className="w-12 h-12 !px-0 rounded-xl">
            <Send className="h-5 w-5" />
          </Button>
        </form>
        <p className="text-center text-[10px] text-gray-400 mt-2">
            AI can make mistakes. Please consult with a medical professional.
        </p>
      </div>
    </div>
  );

  const renderProfile = () => {
    if (!currentUser) return null;
    return (
        <div className="flex items-center justify-center h-full text-gray-500 animate-fade-in">
        <div className="text-center bg-white p-12 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold text-gray-400 uppercase">
                    {currentUser.name.charAt(0)}{currentUser.name.split(' ')[1]?.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{currentUser.name}</h2>
            <p className="text-gray-500 mt-1 mb-8">{currentUser.email || 'user@lifelink.com'}</p>
            <div className="inline-block bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600 mb-8">
                Role: {currentUser.role}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-gray-50 rounded-2xl">
                        <div className="text-2xl font-bold text-gray-900">{currentUser.bloodType || '-'}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Blood Type</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                        <div className="text-2xl font-bold text-gray-900">{currentUser.totalDonations}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Donations</div>
                    </div>
            </div>

            <Button variant="outline" fullWidth onClick={handleLogout} className="border-red-200 text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
            </Button>
        </div>
        </div>
    );
  };

  // If not logged in, show Auth Screen
  if (!currentUser) {
    return <AuthScreen users={users} onLogin={handleLogin} onRegister={handleRegister} />;
  }

  // Calculate default view for back button logic
  const defaultView = getDefaultView(currentUser.role);
  const showBackButton = currentView !== defaultView;

  // Main App Interface
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800 flex">
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-10">
        <div className="p-6 flex items-center space-x-3">
          <div className="bg-red-600 p-2 rounded-xl">
             <Droplets className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">LifeLink</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
            {getSidebarItems().map((item) => (
                <NavItem key={item.label} view={item.view} icon={item.icon} label={item.label} />
            ))}
        </nav>

        {currentUser.role === 'DONOR' && (
            <div className="p-4 m-4 bg-red-50 rounded-2xl">
                <div className="flex items-center space-x-3 mb-2">
                    <Award className="h-5 w-5 text-red-600" />
                    <span className="font-bold text-red-900 text-sm">Platinum Status</span>
                </div>
                <div className="w-full bg-red-200 rounded-full h-1.5 mb-2">
                    <div className="bg-red-600 h-1.5 rounded-full w-[80%]"></div>
                </div>
                <p className="text-xs text-red-700">80% to next reward tier</p>
            </div>
        )}

        <div className="p-4 border-t border-gray-100">
           <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" onClick={() => setCurrentView(AppView.PROFILE)}>
               <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold uppercase">
                 {currentUser.name.charAt(0)}{currentUser.name.split(' ')[1]?.charAt(0)}
               </div>
               <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
                   <p className="text-xs text-gray-500 truncate">{currentUser.role}</p>
               </div>
               <ChevronRight className="h-4 w-4 text-gray-400" />
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-2">
               <div className="bg-red-600 p-1.5 rounded-lg">
                    <Droplets className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">LifeLink</span>
            </div>
            <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          
          {/* Mobile Navigation Dropdown */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg px-4 py-4 space-y-2 animate-slide-down">
                {getSidebarItems().map((item) => (
                     <NavItem key={item.label} view={item.view} icon={item.icon} label={item.label} />
                ))}
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                </button>
            </div>
          )}
        </header>

        {/* Content Container */}
        <div className="p-4 lg:p-8 flex-1 overflow-x-hidden">
            {showBackButton && (
                <button 
                    onClick={() => setCurrentView(defaultView)} 
                    className="group mb-6 flex items-center text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                >
                    <div className="bg-white border border-gray-200 p-1.5 rounded-lg mr-2 group-hover:border-red-200 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                    </div>
                    Back to Dashboard
                </button>
            )}
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
