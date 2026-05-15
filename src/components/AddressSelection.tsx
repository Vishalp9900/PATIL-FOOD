import React, { useState } from 'react';
import { Address, PageView } from '../types';
import { MapPin, Phone, User, Building, Trash2, Plus, ArrowLeft, CheckCircle2, Navigation, Loader2 } from 'lucide-react';

interface AddressSelectionProps {
  addresses: Address[];
  selectedAddressId: number | null;
  setSelectedAddressId: (id: number) => void;
  addNewAddress: (address: Omit<Address, 'id' | 'userId'>) => void;
  deleteAddress: (id: number) => void;
  setPageView: (page: PageView) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const AddressSelection: React.FC<AddressSelectionProps> = ({
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  addNewAddress,
  deleteAddress,
  setPageView,
  showToast
}) => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [locating, setLocating] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    area: '',
    city: '',
    district: '',
    zipcode: '',
    landmark: ''
  });

  const detectLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });
        // Simulate reverse geocoding with auto-fill
        setFormData(prev => ({
          ...prev,
          area: prev.area || `Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`,
          city: prev.city || 'Pune',
          district: prev.district || 'Auto-detected',
          zipcode: prev.zipcode || '411001',
        }));
        setLocating(false);
        showToast('Location detected! Please review and complete the address.', 'success');
      },
      () => {
        setLocating(false);
        // Fallback: simulate coords for demo
        const fallbackLat = 18.5204 + (Math.random() - 0.5) * 0.05;
        const fallbackLng = 73.8567 + (Math.random() - 0.5) * 0.05;
        setCoords({ lat: fallbackLat, lng: fallbackLng });
        setFormData(prev => ({
          ...prev,
          area: prev.area || 'Detected Location',
          city: prev.city || 'Pune',
          district: prev.district || 'Auto-detected Zone',
          zipcode: prev.zipcode || '411001',
        }));
        showToast('Using approximate location (Pune). Please verify details.', 'info');
      },
      { timeout: 5000 }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.area || !formData.city || !formData.district || !formData.zipcode) {
      showToast('Please fill in all mandatory fields', 'error');
      return;
    }

    addNewAddress({
      name: formData.name,
      phone: formData.phone,
      area: formData.area,
      city: formData.city,
      district: formData.district,
      zipcode: formData.zipcode,
      landmark: formData.landmark || undefined,
      latitude: coords?.lat,
      longitude: coords?.lng,
    });

    showToast('New delivery address added successfully!', 'success');
    setShowAddForm(false);
    setCoords(null);
    setFormData({ name: '', phone: '', area: '', city: '', district: '', zipcode: '', landmark: '' });
  };

  const handleProceed = () => {
    if (!selectedAddressId) {
      showToast('Please select a delivery address first', 'error');
      return;
    }
    setPageView('checkout');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPageView('cart')}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div>
            <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight">Delivery <span className="italic animated-gradient-text">Address</span></h1>
            <p className="text-slate-500 text-sm mt-0.5">Where should we deliver your order?</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-rose-100 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New</span>
        </button>
      </div>

      {/* New Address Form Modal / Expandable Section */}
      {showAddForm && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-100 shadow-xl mb-8 transition-all">
          <h3 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-500" />
            <span>Enter Delivery Details</span>
          </h3>

          {/* Detect location button */}
          <button
            type="button"
            onClick={detectLocation}
            disabled={locating}
            className="w-full mb-5 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black rounded-xl hover:shadow-lg shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-60"
          >
            {locating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Detecting your location...</span>
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                <span>📍 Use My Current Location</span>
              </>
            )}
          </button>

          {coords && (
            <div className="mb-5 p-3 bg-emerald-50 ring-1 ring-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold">
                Location captured: {coords.lat.toFixed(4)}°, {coords.lng.toFixed(4)}°
              </span>
            </div>
          )}

          <form onSubmit={handleNewAddressSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Rahul Verma"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="phone"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                House / Flat / Area / Street *
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="area"
                  placeholder="Apartment name, street address"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                City *
              </label>
              <input
                type="text"
                name="city"
                placeholder="e.g. Bengaluru"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                District / Zone *
              </label>
              <input
                type="text"
                name="district"
                placeholder="e.g. Koramangala"
                value={formData.district}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Zip Code *
              </label>
              <input
                type="text"
                name="zipcode"
                placeholder="e.g. 560034"
                value={formData.zipcode}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Landmark (Optional)
              </label>
              <input
                type="text"
                name="landmark"
                placeholder="e.g. Opposite Metro Pillar 12"
                value={formData.landmark}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-rose-500 text-white font-extrabold rounded-xl hover:bg-rose-600 shadow-md shadow-rose-500/20 transition-all cursor-pointer"
              >
                Save & Select Address
              </button>
            </div>

          </form>

        </div>
      )}

      {/* Saved Addresses List */}
      <h3 className="text-xl font-extrabold text-slate-900 mb-4">Saved Addresses</h3>

      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-6 mb-8">
          <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No saved addresses found. Please add a new address above.</p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {addresses.map(addr => {
            const isSelected = selectedAddressId === addr.id;

            return (
              <div
                key={addr.id}
                onClick={() => setSelectedAddressId(addr.id)}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  isSelected
                    ? 'bg-rose-50/50 border-rose-500 shadow-md shadow-rose-500/10'
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                    isSelected ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-extrabold text-slate-900 text-lg">{addr.name}</h4>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-bold">
                        {addr.phone}
                      </span>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed">
                      {addr.area}, {addr.city}, {addr.district} - {addr.zipcode}
                    </p>
                    
                    {addr.landmark && (
                      <p className="text-xs text-rose-600 font-medium mt-1">
                        Landmark: {addr.landmark}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAddress(addr.id);
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Delete Address"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Button */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <button
          onClick={() => setPageView('cart')}
          className="px-6 py-3.5 text-slate-700 font-bold hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          Back to Cart
        </button>

        <button
          onClick={handleProceed}
          disabled={!selectedAddressId}
          className="px-10 py-4 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold rounded-2xl shadow-lg shadow-rose-500/25 transition-all cursor-pointer"
        >
          Confirm Address & Checkout
        </button>
      </div>

    </div>
  );
};
