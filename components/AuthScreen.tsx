
import React, { useState } from 'react';
import { Droplets, ArrowRight, Loader2, Mail, Lock, User as UserIcon, Activity, Building2, ShieldCheck, ArrowLeft, Heart } from 'lucide-react';
import { Button } from './Button';
import { User } from '../types';

interface AuthScreenProps {
  users: User[];
  onLogin: (user: User) => void;
  onRegister: (newUser: User) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ users, onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '1234', // Default password set to 1234
    bloodType: '',
    location: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleDemoLogin = (role: 'DONOR' | 'ADMIN' | 'HOSPITAL') => {
    const demoUser = users.find(u => u.role === role);
    if (demoUser) {
        setIsLoading(true);
        // Simulate a brief loading state for better UX
        setTimeout(() => {
            setIsLoading(false);
            onLogin(demoUser);
        }, 600);
    } else {
        setError(`No ${role.toLowerCase()} account found.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const emailInput = formData.email.toLowerCase().trim();
    const passInput = formData.password.trim();

    if (isLogin) {
        const foundUser = users.find(u => u.email.toLowerCase() === emailInput);
        
        if (!foundUser) {
             setError('Account not found. Please create an account first.');
             setIsLoading(false);
             return;
        }

        // Allow '1234' as a universal master password for this demo, or the specific user password
        if (foundUser.password === passInput || passInput === '1234') {
            onLogin(foundUser);
        } else {
            setError('Incorrect password. The default is 1234.');
            setIsLoading(false);
        }
    } else {
        // Registration
        const emailExists = users.some(u => u.email.toLowerCase() === emailInput);
        if (emailExists) {
            setError('This email is already registered. Please sign in.');
            setIsLoading(false);
            return;
        }

        const newUser: User = {
            id: Date.now().toString(),
            name: formData.name.trim(),
            email: emailInput,
            password: passInput || '1234', // Default if empty
            bloodType: formData.bloodType || 'Unknown',
            role: 'DONOR',
            totalDonations: 0,
            livesSaved: 0,
            lastDonationDate: 'Never',
            location: formData.location.trim() || 'Unknown',
            status: 'Active'
        };

        onRegister(newUser);
        onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      {/* Left Side - Hero / Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-900 opacity-90 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1000" 
          alt="Blood Donation" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
        />
        
        <div className="relative z-20 flex flex-col justify-between h-full p-12">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
              <Droplets className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight">LifeLink</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              Every drop creates a <br/>
              <span className="text-red-200">ripple of life.</span>
            </h1>
            <p className="text-lg text-red-100 max-w-md leading-relaxed">
              Join the ecosystem connecting donors, hospitals, and heroes.
              Seamlessly managed, universally accessible.
            </p>
          </div>

          <div className="text-sm text-red-200">
            © 2024 LifeLink Inc. Premium Healthcare.
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 animate-fade-in bg-white">
        <div className="w-full max-w-md space-y-8">
            {/* Back Button for Register Mode */}
            {!isLogin && (
                <button 
                    onClick={() => {
                        setIsLogin(true);
                        setError('');
                    }}
                    className="flex items-center text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                </button>
            )}

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">
              {isLogin ? 'Welcome back' : 'Join as a Donor'}
            </h2>
            <p className="mt-2 text-gray-500">
              {isLogin 
                ? 'Enter your credentials to access your dashboard.' 
                : 'Start your journey as a life saver today.'}
            </p>
          </div>

          {/* Quick Demo Login Buttons */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button 
                onClick={() => handleDemoLogin('DONOR')}
                className="flex-1 whitespace-nowrap text-xs bg-red-50 hover:bg-red-100 text-red-700 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-red-100"
            >
                <Heart className="h-3 w-3" /> Donor Demo
            </button>
            <button 
                onClick={() => handleDemoLogin('ADMIN')}
                className="flex-1 whitespace-nowrap text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-gray-100"
            >
                <ShieldCheck className="h-3 w-3" /> Admin Demo
            </button>
            <button 
                onClick={() => handleDemoLogin('HOSPITAL')}
                className="flex-1 whitespace-nowrap text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-gray-100"
            >
                <Building2 className="h-3 w-3" /> Hospital Demo
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                 <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    placeholder="Full Name"
                  />
                </div>
                
                <div className="flex gap-4">
                    <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Activity className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all bg-white text-gray-600"
                    >
                        <option value="">Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                    </div>
                    <div className="relative flex-1">
                        <input
                            name="location"
                            type="text"
                            value={formData.location}
                            onChange={handleChange}
                            className="block w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                            placeholder="City"
                        />
                    </div>
                </div>
              </>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                placeholder="Email address"
              />
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  placeholder="Password"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 ml-1">Default password: 1234</p>
            </div>
            
            {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center border border-red-100">{error}</div>}

            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
              className="mt-6 shadow-red-500/30 shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                <span className="flex items-center justify-center">
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              )}
            </Button>
          </form>

          <div className="flex justify-center mt-6">
             <button
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ name: '', email: '', password: '1234', bloodType: '', location: '' });
                setError('');
              }}
              className="text-red-600 hover:text-red-700 font-semibold text-sm transition-colors"
             >
               {isLogin ? 'Create a donor account' : 'Sign in to existing account'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
