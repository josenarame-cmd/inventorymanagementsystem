import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Globe, Landmark, Building2, Map, Home, Search } from 'lucide-react';
import { locations } from '../data/locations';

interface LocationSelectorProps {
    onLocationChange: (location: string) => void;
    onCountryCodeChange?: (code: string) => void;
    initialValue?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationChange, onCountryCodeChange, initialValue }) => {
    const [country, setCountry] = useState('Rwanda');
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [sector, setSector] = useState('');
    const [village, setVillage] = useState('');

    // Emit country code
    useEffect(() => {
        if (onCountryCodeChange && locations[country]) {
            onCountryCodeChange(locations[country].callingCode);
        }
    }, [country, onCountryCodeChange]);

    // Load initial values if any
    useEffect(() => {
        if (initialValue) {
            const parts = initialValue.split(' - ');
            if (parts.length >= 1) setCountry(parts[0]);
            if (parts.length >= 2) setProvince(parts[1]);
            if (parts.length >= 3) setDistrict(parts[2]);
            if (parts.length >= 4) setSector(parts[3]);
            if (parts.length >= 5) setVillage(parts[4]);
        }
    }, [initialValue]);

    // Update parent when any part changes
    useEffect(() => {
        const fullLocation = [country, province, district, sector, village]
            .filter(part => part !== '')
            .join(' - ');
        onLocationChange(fullLocation);
    }, [country, province, district, sector, village]);

    const countries = useMemo(() => Object.keys(locations), []);
    const provinces = useMemo(() => country ? Object.keys(locations[country]?.provinces || {}) : [], [country]);
    const districts = useMemo(() => province ? Object.keys(locations[country]?.provinces[province]?.districts || {}) : [], [country, province]);
    const sectors = useMemo(() => district ? locations[country]?.provinces[province]?.districts[district]?.sectors || [] : [], [country, province, district]);

    const SelectField = ({ label, value, onChange, options, icon: Icon, disabled, placeholder }: any) => (
        <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                <Icon size={12} className="text-blue-600" />
                {label}
            </label>
            <div className="relative group">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className={`w-full bg-gray-50/50 border border-gray-100 text-gray-900 text-sm rounded-2xl p-3.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed group-hover:bg-white ${!value ? 'text-gray-400' : 'font-semibold'}`}
                >
                    <option value="">Select {label}</option>
                    {options.sort().map((opt: string) => (
                        <option key={opt} value={opt} className="text-gray-900">{opt}</option>
                    ))}
                    <option value="Other">Other / Not Listed</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors">
                    <Building2 size={16} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 space-y-8 animate-fade-in">
            <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <Globe className="text-white" size={24} />
                    </div>
                    <div>
                        <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">Geo-Spatial Context</h3>
                        <p className="text-xs text-gray-500 font-medium">Verified Administrative Hierarchy</p>
                    </div>
                </div>
                {country === "Rwanda" && (
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-100 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Full Hierarchy Support
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                <SelectField 
                    label="Country Context" 
                    value={country} 
                    onChange={(val: string) => { setCountry(val); setProvince(''); setDistrict(''); setSector(''); setVillage(''); }}
                    options={countries} 
                    icon={Globe}
                />
                <SelectField 
                    label={country === "USA" ? "State" : "Province / Region"} 
                    value={province} 
                    onChange={(val: string) => { setProvince(val); setDistrict(''); setSector(''); setVillage(''); }}
                    options={provinces} 
                    icon={Landmark}
                    disabled={!country}
                />
                <SelectField 
                    label={country === "USA" ? "County" : "District / City"} 
                    value={district} 
                    onChange={(val: string) => { setDistrict(val); setSector(''); setVillage(''); }}
                    options={districts} 
                    icon={Building2}
                    disabled={!province}
                />
                <SelectField 
                    label={country === "USA" ? "Area / Zip" : "Sector / Sub-district"} 
                    value={sector} 
                    onChange={(val: string) => { setSector(val); setVillage(''); }}
                    options={sectors} 
                    icon={Map}
                    disabled={!district}
                />
                
                <div className="space-y-1.5 lg:col-span-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                        <Home size={12} className="text-blue-600" />
                        Specific Location (Village / Street / Cell)
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={village}
                            onChange={(e) => setVillage(e.target.value)}
                            disabled={!sector}
                            placeholder="Enter the specific village or street name..."
                            className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-2xl p-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-semibold transition-all placeholder:text-gray-300 disabled:opacity-50"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                            <Search size={18} />
                        </div>
                    </div>
                </div>
            </div>

            {country && province && district && sector && (
                <div className="mt-8 p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] flex items-center justify-between shadow-xl shadow-blue-500/20 group hover:scale-[1.01] transition-transform duration-300">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                            <MapPin size={24} className="text-white ring-offset-2" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em] mb-1">Authenticated Location Data</p>
                            <p className="text-white font-bold tracking-tight">
                                {country} <span className="text-blue-300 mx-2">→</span> {province} <span className="text-blue-300 mx-2">→</span> {district} <span className="text-blue-300 mx-2">→</span> {sector}
                                {village && <><span className="text-blue-300 mx-2">→</span> {village}</>}
                            </p>
                        </div>
                    </div>
                    <div className="hidden sm:block">
                        <div className="w-10 h-10 rounded-full border-4 border-emerald-400/30 border-t-emerald-400 animate-spin" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationSelector;
