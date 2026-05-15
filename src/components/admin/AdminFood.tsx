import React, { useState } from 'react';
import { FoodItem } from '../../types';
import { CATEGORIES } from '../../data/mockData';
import { Plus, Edit2, Trash2, Star, Search, X, Save, Image as ImageIcon } from 'lucide-react';
import { handleImageError } from '../../utils/foodImage';

interface AdminFoodProps {
  foodItems: FoodItem[];
  addFoodItem: (food: Omit<FoodItem, 'id'>) => void;
  updateFoodItem: (id: number, food: Partial<FoodItem>) => void;
  deleteFoodItem: (id: number) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

const EMPTY_FORM: Omit<FoodItem, 'id'> = {
  name: '',
  description: '',
  price: 0,
  image: '',
  category: 'burgers',
  rating: 4.5,
  reviewsCount: 0,
  prepTime: '15-20 min',
  isVegetarian: false,
  isSpicy: false,
  isBestSeller: false,
  isAvailable: true,
};

export const AdminFood: React.FC<AdminFoodProps> = ({ foodItems, addFoodItem, updateFoodItem, deleteFoodItem, showToast }) => {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<FoodItem, 'id'>>(EMPTY_FORM);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const filtered = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === 'all' || item.category === filterCat;
    return matchesSearch && matchesCat;
  });

  const openAddForm = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (item: FoodItem) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category,
      rating: item.rating,
      reviewsCount: item.reviewsCount,
      prepTime: item.prepTime,
      isVegetarian: item.isVegetarian,
      isSpicy: item.isSpicy,
      isBestSeller: item.isBestSeller,
      isAvailable: item.isAvailable !== false,
    });
    setShowForm(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (name === 'price' || name === 'rating' || name === 'reviewsCount') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Image is now optional — a category fallback is auto-applied if empty
    if (!formData.name || !formData.description || formData.price <= 0) {
      showToast('Please fill name, description and a valid price', 'error');
      return;
    }
    if (editingId !== null) {
      updateFoodItem(editingId, formData);
      showToast('Food item updated successfully!', 'success');
    } else {
      addFoodItem(formData);
      showToast('New food item added to menu!', 'success');
    }
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  return (
    <div className="p-6 sm:p-8">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Food Items</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your menu — add, edit, or remove dishes</p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black rounded-xl shadow-md shadow-rose-500/25 hover:shadow-lg transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 ring-1 ring-slate-100 shadow-sm flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by item name..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl ring-1 ring-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 rounded-xl ring-1 ring-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
        >
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
          ))}
        </select>
      </div>

      {/* Items table */}
      <div className="bg-white rounded-3xl ring-1 ring-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-wider">Tags</th>
                <th className="px-6 py-4 text-right text-[11px] font-black text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-500 text-sm font-semibold">
                    No food items found. Try adjusting filters or add a new item.
                  </td>
                </tr>
              ) : (
                filtered.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={handleImageError(item.name, item.category, item.id)}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 bg-gradient-to-br from-rose-100 to-orange-100"
                        />
                        <div>
                          <div className="font-black text-sm text-slate-900">{item.name}</div>
                          <div className="text-[11px] text-slate-500 font-semibold truncate max-w-xs">{item.description.substring(0, 50)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-600 capitalize">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900">₹{item.price}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{item.rating}</span>
                        <span className="text-slate-400 font-semibold">({item.reviewsCount})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {item.isVegetarian && <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">VEG</span>}
                        {item.isSpicy && <span className="text-[9px] font-black bg-red-100 text-red-700 px-1.5 py-0.5 rounded">SPICY</span>}
                        {item.isBestSeller && <span className="text-[9px] font-black bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">BEST</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditForm(item)}
                          className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(item.id)}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl my-8">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl">
              <h3 className="text-xl font-black text-slate-900">
                {editingId !== null ? 'Edit Food Item' : 'Add New Food Item'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="rounded-2xl overflow-hidden ring-1 ring-slate-200 mb-4 bg-gradient-to-br from-rose-100 to-orange-100">
                <img
                  src={formData.image || `https://placehold.co/800x300/f43f5e/ffffff/png?text=${encodeURIComponent(formData.name || 'Preview')}`}
                  alt="Preview"
                  onError={handleImageError(formData.name || 'New Item', formData.category, 0)}
                  className="w-full h-48 object-cover"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">Item Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 rounded-xl ring-1 ring-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500" />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">Description *</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl ring-1 ring-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500" />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5" /> Image URL <span className="text-slate-400 normal-case font-semibold">(optional — leave blank for auto image)</span>
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://... (or leave blank — we'll pick a beautiful one for you)"
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl ring-1 ring-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">Price (₹) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" className="w-full px-4 py-2.5 bg-slate-50 rounded-xl ring-1 ring-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500" />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl ring-1 ring-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer">
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">Prep Time</label>
                  <input type="text" name="prepTime" value={formData.prepTime} onChange={handleChange} placeholder="15-20 min" className="w-full px-4 py-2.5 bg-slate-50 rounded-xl ring-1 ring-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500" />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase block mb-1.5">Rating (0-5)</label>
                  <input type="number" name="rating" value={formData.rating} onChange={handleChange} min="0" max="5" step="0.1" className="w-full px-4 py-2.5 bg-slate-50 rounded-xl ring-1 ring-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500" />
                </div>

                <div className="sm:col-span-2 flex flex-wrap items-center gap-4 p-4 bg-slate-50 rounded-2xl ring-1 ring-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isVegetarian" checked={!!formData.isVegetarian} onChange={handleChange} className="w-4 h-4 accent-emerald-500" />
                    <span className="text-sm font-bold text-slate-700">🌿 Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isSpicy" checked={!!formData.isSpicy} onChange={handleChange} className="w-4 h-4 accent-red-500" />
                    <span className="text-sm font-bold text-slate-700">🌶️ Spicy</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isBestSeller" checked={!!formData.isBestSeller} onChange={handleChange} className="w-4 h-4 accent-amber-500" />
                    <span className="text-sm font-bold text-slate-700">⭐ Bestseller</span>
                  </label>
                </div>

              </div>

              <div className="flex items-center gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black rounded-xl shadow-md shadow-rose-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <Save className="w-4 h-4" />
                  <span>{editingId !== null ? 'Update' : 'Add Item'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Delete this item?</h3>
            <p className="text-slate-500 text-sm mb-6">This action cannot be undone. The item will be removed from the menu.</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer">Cancel</button>
              <button onClick={() => { deleteFoodItem(confirmDelete); setConfirmDelete(null); showToast('Food item deleted', 'info'); }} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl transition-colors cursor-pointer">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
