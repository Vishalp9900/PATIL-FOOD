import React, { useState } from 'react';
import { User, Order, Address, PageView } from '../types';
import { MASTER_ADMIN_EMAIL } from '../data/mockData';
import { User as UserIcon, Mail, Phone, Calendar, ShoppingBag, IndianRupee, MapPin, Edit2, Save, X } from 'lucide-react';

interface ProfileProps {
  currentUser: User;
  orders: Order[];
  addresses: Address[];
  updateUser: (updates: Partial<User>) => void;
  setPageView: (page: PageView) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const Profile: React.FC<ProfileProps> = ({ currentUser, orders, addresses, updateUser, setPageView, showToast }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    phone: currentUser.phone,
    email: currentUser.email,
  });

  const userOrders = orders.filter(o => o.userId === currentUser.id);
  const totalSpent = userOrders.reduce((acc, o) => acc + o.totalPrice, 0);
  const primaryAddress = addresses.find(addr => addr.isDefault) || addresses[0] || null;

  const handleSave = () => {
    if (!formData.name || !formData.phone || !formData.email) {
      showToast('All fields are required', 'error');
      return;
    }
    updateUser(formData);
    showToast('Profile updated successfully!', 'success');
    setEditing(false);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      <div className="mb-8">
        <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight">My <span className="italic animated-gradient-text">Profile</span></h1>
        <p className="text-slate-500 text-sm mt-1">Manage your personal details and view account activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-rose-500 to-orange-500 rounded-3xl p-6 text-white shadow-xl shadow-rose-500/20">
          <div className="flex flex-col items-center text-center">
            <img
              src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`}
              alt={currentUser.name}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-white/30 shadow-lg mb-4"
            />
            <h2 className="text-2xl font-black mb-1">{currentUser.name}</h2>
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              {currentUser.role === 'admin' && currentUser.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase() ? '🛡️ Administrator' : '👤 Customer'}
            </span>

            <div className="grid grid-cols-2 gap-3 w-full mt-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center">
                <ShoppingBag className="w-5 h-5 mx-auto mb-1 opacity-80" />
                <div className="text-xl font-black">{userOrders.length}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Orders</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center">
                <IndianRupee className="w-5 h-5 mx-auto mb-1 opacity-80" />
                <div className="text-xl font-black">₹{totalSpent}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Spent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 ring-1 ring-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-slate-900">Personal Information</h3>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-black transition-colors cursor-pointer">
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditing(false); setFormData({ name: currentUser.name, phone: currentUser.phone, email: currentUser.email }); }} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-black transition-colors cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                  <button onClick={handleSave} className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-xl text-xs font-black transition-colors cursor-pointer">
                    <Save className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl">
                <UserIcon className="w-5 h-5 text-rose-500 mt-1" />
                <div className="flex-1">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Full Name</div>
                  {editing ? (
                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-white rounded-lg ring-1 ring-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rose-500" />
                  ) : (
                    <div className="font-black text-slate-900">{currentUser.name}</div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl">
                <Mail className="w-5 h-5 text-rose-500 mt-1" />
                <div className="flex-1">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Email Address</div>
                  {editing ? (
                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 bg-white rounded-lg ring-1 ring-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rose-500" />
                  ) : (
                    <div className="font-black text-slate-900">{currentUser.email}</div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl">
                <Phone className="w-5 h-5 text-rose-500 mt-1" />
                <div className="flex-1">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Phone Number</div>
                  {editing ? (
                    <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 bg-white rounded-lg ring-1 ring-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rose-500" />
                  ) : (
                    <div className="font-black text-slate-900">{currentUser.phone}</div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl">
                <Calendar className="w-5 h-5 text-rose-500 mt-1" />
                <div className="flex-1">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Member Since</div>
                  <div className="font-black text-slate-900">{currentUser.createdAt.split(' ')[0]}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl">
                <MapPin className="w-5 h-5 text-rose-500 mt-1" />
                <div className="flex-1">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Address</div>
                  {primaryAddress ? (
                    <div>
                      <div className="font-black text-slate-900">{primaryAddress.name}</div>
                      <div className="text-sm text-slate-600 mt-1 leading-relaxed">
                        {primaryAddress.area}, {primaryAddress.city}, {primaryAddress.district} - {primaryAddress.zipcode}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 font-semibold">No saved address found. Add one in checkout to speed up future orders.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="bg-white rounded-3xl p-6 ring-1 ring-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-500" />
                Saved Addresses
              </h3>
              <button onClick={() => setPageView('address')} className="text-xs font-black text-rose-600 hover:underline cursor-pointer">
                Manage →
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center py-8 text-slate-500 text-sm font-semibold">
                No saved addresses yet. Save one during checkout to reuse it here.
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.slice(0, 3).map(addr => (
                  <div key={addr.id} className="p-4 bg-slate-50 rounded-2xl">
                    <div className="font-black text-sm text-slate-900">{addr.name}</div>
                    <div className="text-xs text-slate-600 mt-1">
                      {addr.area}, {addr.city}, {addr.district} - {addr.zipcode}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
