import React, { useState } from 'react';
import { User, Order } from '../../types';
import { Search, Mail, Phone, ShoppingBag, IndianRupee, Shield, User as UserIcon } from 'lucide-react';

interface AdminUsersProps {
  users: User[];
  orders: Order[];
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ users, orders }) => {
  const [search, setSearch] = useState('');

  const customers = users.filter(u => u.role === 'customer');
  const filtered = customers.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const getUserStats = (userId: string) => {
    const userOrders = orders.filter(o => o.userId === userId);
    return {
      orderCount: userOrders.length,
      totalSpent: userOrders.reduce((acc, o) => acc + o.totalPrice, 0),
    };
  };

  return (
    <div className="p-6 sm:p-8">
      
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Customers</h1>
        <p className="text-slate-500 text-sm mt-1">View all registered customers and their order history</p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg">
          <UserIcon className="w-8 h-8 mb-3 opacity-80" />
          <div className="text-3xl font-black">{customers.length}</div>
          <div className="text-xs font-bold uppercase tracking-wider opacity-80">Total Customers</div>
        </div>
        <div className="bg-gradient-to-br from-rose-500 to-orange-500 rounded-3xl p-6 text-white shadow-lg">
          <ShoppingBag className="w-8 h-8 mb-3 opacity-80" />
          <div className="text-3xl font-black">{orders.length}</div>
          <div className="text-xs font-bold uppercase tracking-wider opacity-80">Total Orders</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg">
          <IndianRupee className="w-8 h-8 mb-3 opacity-80" />
          <div className="text-3xl font-black">₹{orders.reduce((a, o) => a + o.totalPrice, 0).toLocaleString()}</div>
          <div className="text-xs font-bold uppercase tracking-wider opacity-80">Total Revenue</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 ring-1 ring-slate-100 shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl ring-1 ring-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Customers Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center ring-1 ring-slate-100">
          <UserIcon className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-bold">No customers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(user => {
            const stats = getUserStats(user.id);
            return (
              <div key={user.id} className="bg-white rounded-3xl p-6 ring-1 ring-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-rose-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-slate-900 truncate">{user.name}</div>
                    <div className="text-xs text-slate-500 font-bold flex items-center gap-1 mt-0.5">
                      <Shield className="w-3 h-3" /> Customer
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold">{user.phone}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-rose-50 rounded-xl p-3 text-center ring-1 ring-rose-100">
                    <div className="text-lg font-black text-rose-700">{stats.orderCount}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Orders</div>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3 text-center ring-1 ring-emerald-100">
                    <div className="text-lg font-black text-emerald-700">₹{stats.totalSpent}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Spent</div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-bold mt-3 text-right">
                  Member since {user.createdAt.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
