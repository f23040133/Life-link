
import React, { useState } from 'react';
import { Doctor } from '../types';
import { Button } from './Button';
import { Search, Star, MapPin, Calendar, Clock, Stethoscope, CheckCircle } from 'lucide-react';

interface DoctorAppointmentsProps {
  doctors: Doctor[];
}

export const DoctorAppointments: React.FC<DoctorAppointmentsProps> = ({ doctors }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [bookedDoctor, setBookedDoctor] = useState<string | null>(null);

  const specialties = ['All', ...Array.from(new Set(doctors.map(d => d.specialty)))];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleBook = (id: string) => {
    // Simulate booking process
    setBookedDoctor(id);
    setTimeout(() => setBookedDoctor(null), 3000); // Reset after 3 seconds
  };

  return (
    <div className="space-y-8 animate-fade-in h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Consult a Specialist</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Book appointments with top hematologists and general practitioners in Nanjing.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input 
                type="text" 
                placeholder="Search doctors or hospitals..." 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-none rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500/20 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {specialties.map(spec => (
                <button
                    key={spec}
                    onClick={() => setSelectedSpecialty(spec)}
                    className={`px-6 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
                        selectedSpecialty === spec 
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                    {spec}
                </button>
            ))}
        </div>
      </div>

      {/* Doctor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDoctors.map(doctor => (
            <div key={doctor.id} className="group bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 relative overflow-hidden">
                <div className="flex items-start gap-4">
                    <div className="relative">
                        <img 
                            src={doctor.image} 
                            alt={doctor.name} 
                            className="w-20 h-20 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 p-1.5 rounded-xl shadow-sm">
                             <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-0.5 rounded-lg">
                                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                <span className="text-xs font-bold text-yellow-700 dark:text-yellow-500">{doctor.rating}</span>
                             </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{doctor.name}</h3>
                        <p className="text-red-600 dark:text-red-400 font-medium text-sm flex items-center gap-1">
                            <Stethoscope className="h-3 w-3" /> {doctor.specialty}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {doctor.hospital}
                        </p>
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> Next Available
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">{doctor.availability}</span>
                    </div>
                </div>

                <div className="mt-6">
                    {bookedDoctor === doctor.id ? (
                        <button disabled className="w-full py-3 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 animate-pulse">
                            <CheckCircle className="h-5 w-5" /> Confirmed
                        </button>
                    ) : (
                        <Button 
                            fullWidth 
                            onClick={() => handleBook(doctor.id)}
                            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 border-none shadow-lg shadow-gray-200 dark:shadow-none"
                        >
                            Book Appointment
                        </Button>
                    )}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
