import React, { useState } from 'react';
import { FoodItem, CartItem } from '../types';
import { CATEGORIES, MOCK_FOOD_ITEMS } from '../data/mockData';
import { Search, Star, Clock, Flame, Leaf, Plus, Minus, ShoppingCart, Truck, Award, Zap } from 'lucide-react';
import { handleImageError } from '../utils/foodImage';

interface MenuProps {
  cartItems: CartItem[];
  addToCart: (foodItem: FoodItem) => void;
  updateQuantity: (foodItemId: number, delta: number) => void;
}

export const Menu: React.FC<MenuProps> = ({ cartItems, addToCart, updateQuantity }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = MOCK_FOOD_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCartQuantity = (foodItemId: number) => {
    const item = cartItems.find(c => c.foodItem.id === foodItemId);
    return item ? item.quantity : 0;
  };

  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return MOCK_FOOD_ITEMS.length;
    return MOCK_FOOD_ITEMS.filter(i => i.category === catId).length;
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Hero Banner */}
      <div className="relative rounded-[2.5rem] bg-gradient-to-br from-rose-500 via-rose-600 to-orange-500 text-white p-8 sm:p-16 mb-10 overflow-hidden shadow-2xl shadow-rose-500/30 shimmer-effect">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-orange-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-20 text-8xl opacity-10 select-none pointer-events-none sparkle-float">🍕</div>
        <div className="absolute bottom-10 right-40 text-7xl opacity-10 select-none pointer-events-none sparkle-float" style={{ animationDelay: '1.5s' }}>🍔</div>
        <div className="absolute top-1/2 right-8 text-6xl opacity-10 select-none pointer-events-none sparkle-float" style={{ animationDelay: '0.7s' }}>🍰</div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px w-12 bg-amber-300/60" />
            <span className="font-stencil text-amber-200 text-sm tracking-[0.3em]">PATIL FOODS PRESENTS</span>
          </div>

          <span className="bg-white/20 backdrop-blur-md text-white text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full mb-5 inline-flex items-center gap-1.5 ring-1 ring-white/30">
            <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> 30-Min Lightning Delivery
          </span>

          <h2 className="text-5xl sm:text-7xl font-display font-black tracking-tight mb-5 leading-[1]">
            Crafted with <span className="italic font-light">love</span>.<br />
            <span className="bg-gradient-to-r from-amber-200 via-white to-amber-100 bg-clip-text text-transparent italic">Delivered</span> with care.
          </h2>
          <p className="text-rose-50/90 text-base sm:text-lg mb-8 max-w-xl leading-relaxed">
            From sizzling tandoori specials to wood-fired pizzas — explore <strong className="font-bold text-white">{MOCK_FOOD_ITEMS.length}+ chef-curated dishes</strong> made fresh and delivered hot to your doorstep.
          </p>
          
          {/* Search Input */}
          <div className="relative max-w-lg text-slate-900">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search burgers, biryani, pizza, shakes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white pl-14 pr-4 py-4 rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-white/40 font-semibold placeholder-slate-400 text-base"
            />
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-5 mt-8 text-sm font-semibold">
            <div className="flex items-center gap-2 text-white/95">
              <div className="w-9 h-9 bg-white/15 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Truck className="w-4 h-4" />
              </div>
              <span>Free Delivery ₹500+</span>
            </div>
            <div className="flex items-center gap-2 text-white/95">
              <div className="w-9 h-9 bg-white/15 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Award className="w-4 h-4" />
              </div>
              <span>4.8★ Avg Rating</span>
            </div>
            <div className="flex items-center gap-2 text-white/95">
              <div className="w-9 h-9 bg-white/15 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Clock className="w-4 h-4" />
              </div>
              <span>Live Order Tracking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900">Browse Categories</h3>
        <span className="text-sm font-semibold text-slate-500">{filteredItems.length} dishes available</span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 -mx-4 px-4 scrollbar-none">
        {CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg shadow-slate-900/25 scale-105'
                : 'bg-white text-slate-700 hover:bg-slate-50 ring-1 ring-slate-200 hover:ring-rose-200 hover:text-rose-600'
            }`}
          >
            <span className="text-base">{category.icon}</span>
            <span>{category.name}</span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              selectedCategory === category.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {getCategoryCount(category.id)}
            </span>
          </button>
        ))}
      </div>

      {/* Food Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            🔍
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">No dishes found</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            We couldn't find anything matching "{searchQuery}". Try a different keyword or category.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="px-8 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg shadow-rose-500/30 transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {filteredItems.map(item => {
            const qty = getCartQuantity(item.id);

            return (
              <div 
                key={item.id} 
                className="bg-white rounded-3xl overflow-hidden ring-1 ring-slate-100 hover:ring-rose-200 shadow-sm hover:shadow-2xl hover:shadow-rose-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                {/* Image & Overlay Badges */}
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-rose-100 to-orange-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onError={handleImageError(item.name, item.category, item.id)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Gradient overlay for badge legibility */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20 pointer-events-none" />
                  
                  {/* Badges on Top */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[70%]">
                    {item.isBestSeller && (
                      <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                        ⭐ BESTSELLER
                      </span>
                    )}
                    {item.isVegetarian ? (
                      <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-md flex items-center gap-1 ring-1 ring-emerald-600">
                        <Leaf className="w-3 h-3" /> VEG
                      </span>
                    ) : (
                      <span className="bg-rose-700 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-md ring-1 ring-rose-800">
                        🥩 NON-VEG
                      </span>
                    )}
                  </div>

                  {item.isSpicy && (
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-md ring-1 ring-red-700">
                      <Flame className="w-3 h-3 fill-yellow-300 text-yellow-300" /> SPICY
                    </span>
                  )}

                  {/* Prep Time */}
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-md">
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    <span>{item.prepTime}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-black text-base text-slate-900 group-hover:text-rose-600 transition-colors leading-snug line-clamp-2">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg text-emerald-700 font-black text-xs shrink-0 ring-1 ring-emerald-100">
                        <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                        <span>{item.rating}</span>
                      </div>
                    </div>

                    <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="text-[11px] font-bold text-slate-400 mb-4">
                      {item.reviewsCount}+ reviews
                    </div>
                  </div>

                  {/* Footer & Price / Actions */}
                  <div className="pt-4 border-t border-dashed border-slate-200 flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Price</span>
                      <span className="text-2xl font-black text-slate-900">₹{item.price}</span>
                    </div>

                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-5 py-2.5 rounded-xl font-black text-sm shadow-md shadow-rose-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95 hover:shadow-lg"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>ADD</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-rose-50 p-1 rounded-xl ring-1 ring-rose-200">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-rose-600 hover:bg-rose-100 font-bold shadow-sm transition-colors cursor-pointer"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center font-black text-rose-700 text-base">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 bg-gradient-to-br from-rose-500 to-orange-500 text-white rounded-lg flex items-center justify-center font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
