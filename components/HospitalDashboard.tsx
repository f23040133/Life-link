
import React, { useState } from 'react';
import { User } from '../types';
import { Button } from './Button';
import { Search, MapPin, Droplets, Phone, Mail, Filter } from 'lucide-react';

interface HospitalDashboardProps {
  users: User[];
}

export const HospitalDashboard: React.FC<HospitalDashboardProps> = ({ users }) => {
  const [bloodTypeFilter, setBloodTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const donors = users.filter(u => u.role === 'DONOR');

  const filteredDonors = donors.filter(donor => {
    const matchBlood = bloodTypeFilter ? donor.bloodType === bloodTypeFilter : true;
    const matchLocation = locationFilter 
        ? donor.location?.toLowerCase().includes(locationFilter.toLowerCase()) 
        : true;
    return matchBlood && matchLocation;
  });

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Find Donors</h1>
            <p className="text-gray-500 dark:text-gray-400">Search the donor registry for urgent requirements.</p>
        </div>
        <Button className="bg-red-600 text-white hover:bg-red-700">
            Create Blood Request
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input 
                type="text" 
                placeholder="Search by city or location..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
            />
        </div>
        <div className="w-full md:w-48 relative">
             <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
             <select 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 outline-none appearance-none text-gray-900 dark:text-white"
                value={bloodTypeFilter}
                onChange={(e) => setBloodTypeFilter(e.target.value)}
             >
                 <option value="">All Blood Types</option>
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
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-4">
        {filteredDonors.length > 0 ? (
            filteredDonors.map(donor => (
                <div key={donor.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 font-bold">
                                {donor.bloodType}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{donor.name}</h3>
                                <div className="text-xs text-green-600 dark:text-green-400 flex items-center bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full w-fit mt-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                                    Available
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                        <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                            {donor.location || 'Location not specified'}
                        </div>
                        <div className="flex items-center">
                            <Droplets className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                            Last Donation: {donor.lastDonationDate}
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1 border-gray-200 dark:border-gray-600 dark:text-gray-300">
                            <Mail className="h-4 w-4 mr-1" /> Email
                        </Button>
                        <Button size="sm" className="flex-1">
                            <Phone className="h-4 w-4 mr-1" /> Call
                        </Button>
                    </div>
                </div>
            ))
        ) : (
            <div className="col-span-full py-12 text-center text-gray-400 dark:text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No donors found matching your criteria.</p>
            </div>
        )}
      </div>
    </div>
  );
};
