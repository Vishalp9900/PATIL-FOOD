import React, { useEffect, useState } from 'react';
import { PageView, CartItem, Address, Order, FoodItem, ToastNotification, User, OrderStatus } from './types';
import { INITIAL_ADDRESSES, INITIAL_ORDERS, INITIAL_USERS, MOCK_FOOD_ITEMS, DELIVERY_PARTNERS, MASTER_ADMIN_EMAIL } from './data/mockData';
import { ensureFoodImage } from './utils/foodImage';

// Customer-facing components
import { Header } from './components/Header';
import { Menu } from './components/Menu';
import { Cart } from './components/Cart';
import { AddressSelection } from './components/AddressSelection';
import { Checkout } from './components/Checkout';
import { Orders } from './components/Orders';
import { OrderSuccess } from './components/OrderSuccess';
import { OrderTracking } from './components/OrderTracking';
import { Toast } from './components/Toast';
import { Login } from './components/Login';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { CustomerBottomNav } from './components/CustomerBottomNav';
import { BrandLogo } from './components/BrandLogo';

// Admin components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminFood } from './components/admin/AdminFood';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminUsers } from './components/admin/AdminUsers';

const PAGE_PATHS: Record<PageView, string> = {
  menu: '/',
  cart: '/cart',
  address: '/address',
  checkout: '/checkout',
  orders: '/orders',
  'order-success': '/order-success',
  'order-tracking': '/order-tracking',
  login: '/login',
  profile: '/profile',
  settings: '/settings',
  'admin-dashboard': '/admin/dashboard',
  'admin-food': '/admin/food',
  'admin-orders': '/admin/orders',
  'admin-users': '/admin/users',
};

const PATH_TO_PAGE: Record<string, PageView> = Object.entries(PAGE_PATHS).reduce((acc, [page, path]) => {
  acc[path] = page as PageView;
  return acc;
}, {} as Record<string, PageView>);

const AUTH_PAGES = new Set<PageView>([
  'cart',
  'address',
  'checkout',
  'orders',
  'order-success',
  'order-tracking',
  'profile',
  'settings',
]);

const ADMIN_PAGES = new Set<PageView>(['admin-dashboard', 'admin-food', 'admin-orders', 'admin-users']);

const resolvePageFromPath = (pathname: string): PageView => PATH_TO_PAGE[pathname] ?? 'menu';

const getInitialPage = (): PageView => {
  if (typeof window === 'undefined') return 'menu';
  const page = resolvePageFromPath(window.location.pathname);
  return AUTH_PAGES.has(page) || ADMIN_PAGES.has(page) ? 'login' : page;
};

export const App: React.FC = () => {
  // Auth state
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Page navigation
  const [currentPage, setCurrentPage] = useState<PageView>(getInitialPage());

  // Customer state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null);

  // Admin state
  const [foodItems, setFoodItems] = useState<FoodItem[]>(MOCK_FOOD_ITEMS);

  // Notifications
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ id: Math.random().toString(), message, type });
  };

  const navigateTo = (page: PageView, mode: 'push' | 'replace' = 'push') => {
    const nextPath = PAGE_PATHS[page] ?? '/';
    if (typeof window !== 'undefined') {
      const historyMethod = mode === 'replace' ? 'replaceState' : 'pushState';
      if (window.location.pathname !== nextPath || mode === 'replace') {
        window.history[historyMethod]({}, '', nextPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setCurrentPage(page);
  };

  const setPageView = (page: PageView) => navigateTo(page);
  const replacePageView = (page: PageView) => navigateTo(page, 'replace');

  // ===== AUTH =====
  const login = (user: User) => {
    setCurrentUser(user);
    // Auto-select this user's default/first saved address (so cart→address feels seamless)
    const userAddrs = addresses.filter(a => a.userId === user.id);
    const defaultAddr = userAddrs.find(a => a.isDefault) || userAddrs[0];
    setSelectedAddressId(defaultAddr ? defaultAddr.id : null);
  };

  const register = (data: Omit<User, 'id' | 'createdAt' | 'role'>): User => {
    // Security: New registrations are ALWAYS customer role.
    // Even if someone tries to register the master admin email, they get customer role only.
    const newUser: User = {
      ...data,
      id: `USR-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      role: 'customer',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.name}`,
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  // Master admin verification — ONLY this exact email can access the admin panel.
  // Even if the role field is somehow tampered with, this email check is the source of truth.
  const isMasterAdmin = (user: User | null): boolean => {
    return !!user && user.role === 'admin' && user.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();
  };

  const logout = () => {
    // Clear all session-bound state so the next user starts fresh
    // (orders & addresses are kept in storage but only shown to their owner)
    setCurrentUser(null);
    setCartItems([]);
    setSelectedAddressId(null);
    setLastOrder(null);
    setActiveTrackingOrderId(null);
    replacePageView('login');
    showToast('Signed out successfully. See you again soon! 👋', 'info');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
  };

  // ===== CART =====
  const addToCart = (foodItem: FoodItem) => {
    // Require login before adding anything to the cart — keeps carts strictly per-user
    if (!currentUser) {
      showToast('Please sign in to add items to your cart', 'info');
      setPageView('login');
      return;
    }
    setCartItems(prev => {
      const existing = prev.find(item => item.foodItem.id === foodItem.id);
      if (existing) {
        return prev.map(item =>
          item.foodItem.id === foodItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: foodItem.id, foodItem, quantity: 1 }];
    });
    showToast(`Added ${foodItem.name} to cart!`, 'success');
  };

  const updateQuantity = (foodItemId: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.foodItem.id === foodItemId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const removeItem = (foodItemId: number) => {
    setCartItems(prev => prev.filter(item => item.foodItem.id !== foodItemId));
    showToast('Item removed from cart', 'info');
  };

  // ===== ADDRESS =====
  const addNewAddress = (addrWithoutId: Omit<Address, 'id' | 'userId'>) => {
    if (!currentUser) return;
    const newId = Date.now();
    // Always tag the address to the currently logged-in user
    const newAddr: Address = { ...addrWithoutId, id: newId, userId: currentUser.id };
    setAddresses(prev => [newAddr, ...prev]);
    setSelectedAddressId(newId);
  };

  const deleteAddress = (addressId: number) => {
    setAddresses(prev => prev.filter(a => a.id !== addressId));
    if (selectedAddressId === addressId) {
      // Pick another address belonging to this user (or null)
      const remaining = addresses.filter(a => a.id !== addressId && a.userId === currentUser?.id);
      setSelectedAddressId(remaining[0]?.id || null);
    }
    showToast('Saved address deleted', 'info');
  };

  // ===== ORDERS =====
  const placeOrder = (_paymentMethod: 'cod' | 'online', newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setLastOrder(newOrder);
    setActiveTrackingOrderId(newOrder.id);
    setCartItems([]);
    setPageView('order-success');
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const reorderItems = (items: { foodItem: any; quantity: number }[]) => {
    const newCartItems: CartItem[] = items.map(item => ({
      id: item.foodItem.id,
      foodItem: item.foodItem,
      quantity: item.quantity
    }));
    setCartItems(newCartItems);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const newTime = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const alreadyTracked = o.statusTimeline.some(t => t.status === status);
      return {
        ...o,
        status,
        statusTimeline: alreadyTracked
          ? o.statusTimeline
          : [...o.statusTimeline, { status, time: newTime }],
      };
    }));
  };

  // ===== ADMIN: FOOD MANAGEMENT =====
  const addFoodItem = (food: Omit<FoodItem, 'id'>) => {
    const newId = Math.max(...foodItems.map(f => f.id), 0) + 1;
    // Guarantee an image — even if admin left the field empty
    const safeImage = ensureFoodImage(food.image, food.category, food.name, newId);
    setFoodItems(prev => [{ ...food, image: safeImage, id: newId }, ...prev]);
  };

  const updateFoodItem = (id: number, updates: Partial<FoodItem>) => {
    setFoodItems(prev => prev.map(f => {
      if (f.id !== id) return f;
      const merged = { ...f, ...updates };
      // If image was cleared or is invalid, give it a category fallback
      merged.image = ensureFoodImage(merged.image, merged.category, merged.name, merged.id);
      return merged;
    }));
  };

  const deleteFoodItem = (id: number) => {
    setFoodItems(prev => prev.filter(f => f.id !== id));
  };

  // ===== Helpers — STRICTLY isolate data by current user =====
  const selectedAddress = addresses.find(a => a.id === selectedAddressId);
  // Only the master admin sees all orders; customers only see their own.
  const userOrders = currentUser
    ? (isMasterAdmin(currentUser) ? orders : orders.filter(o => o.userId === currentUser.id))
    : [];
  // Each user only sees addresses they personally saved.
  const userAddresses = currentUser
    ? addresses.filter(a => a.userId === currentUser.id)
    : [];
  const activeTrackingOrder = orders.find(o => o.id === activeTrackingOrderId) || null;

  // ===== AUTH GUARDS =====
  // Protected routes that require login
  const requiresAuth = ['cart', 'address', 'checkout', 'orders', 'order-success', 'order-tracking', 'profile', 'settings'];
  const adminOnlyPages = ['admin-dashboard', 'admin-food', 'admin-orders', 'admin-users'];

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(resolvePageFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  React.useEffect(() => {
    if (requiresAuth.includes(currentPage) && !currentUser) {
      showToast('Please sign in to continue', 'info');
      replacePageView('login');
    }
    if (adminOnlyPages.includes(currentPage) && !isMasterAdmin(currentUser)) {
      showToast('🔒 Admin access denied. Restricted to authorized administrator only.', 'error');
      replacePageView(currentUser ? 'menu' : 'login');
    }
  }, [currentPage, currentUser]);

  // ===== ADMIN VIEW — gated by master admin check =====
  if (currentUser && isMasterAdmin(currentUser) && adminOnlyPages.includes(currentPage)) {
    const adminUser = currentUser; // narrowed to non-null
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <Header
          currentPage={currentPage}
          setPageView={setPageView}
          cartItems={cartItems}
          currentUser={adminUser}
          logout={logout}
        />
        <AdminLayout currentPage={currentPage} setPageView={setPageView} currentUser={adminUser} logout={logout}>
          {currentPage === 'admin-dashboard' && (
            <AdminDashboard orders={orders} foodItems={foodItems} users={users} />
          )}
          {currentPage === 'admin-food' && (
            <AdminFood
              foodItems={foodItems}
              addFoodItem={addFoodItem}
              updateFoodItem={updateFoodItem}
              deleteFoodItem={deleteFoodItem}
              showToast={showToast}
            />
          )}
          {currentPage === 'admin-orders' && (
            <AdminOrders orders={orders} updateOrderStatus={updateOrderStatus} showToast={showToast} />
          )}
          {currentPage === 'admin-users' && (
            <AdminUsers users={users} orders={orders} />
          )}
        </AdminLayout>
        <Toast notification={toast} onClose={() => setToast(null)} />
      </div>
    );
  }

  // ===== CUSTOMER VIEW =====
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <Header
        currentPage={currentPage}
        setPageView={setPageView}
        cartItems={cartItems}
        currentUser={currentUser}
        logout={logout}
      />

      <main className="flex-1 pb-28 md:pb-16">
        {currentPage === 'menu' && (
          <Menu
            cartItems={cartItems}
            addToCart={addToCart}
            updateQuantity={updateQuantity}
          />
        )}

        {currentPage === 'login' && (
          <Login
            users={users}
            login={login}
            register={register}
            setPageView={setPageView}
            showToast={showToast}
          />
        )}

        {currentPage === 'cart' && currentUser && (
          <Cart
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
            setPageView={setPageView}
            showToast={showToast}
          />
        )}

        {currentPage === 'address' && currentUser && (
          <AddressSelection
            addresses={userAddresses}
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelectedAddressId}
            addNewAddress={addNewAddress}
            deleteAddress={deleteAddress}
            setPageView={setPageView}
            showToast={showToast}
          />
        )}

        {currentPage === 'checkout' && currentUser && (
          <Checkout
            cartItems={cartItems}
            selectedAddress={selectedAddress}
            placeOrder={placeOrder}
            setPageView={setPageView}
            showToast={showToast}
            currentUser={currentUser}
            deliveryPartners={DELIVERY_PARTNERS}
          />
        )}

        {currentPage === 'orders' && currentUser && (
          <Orders
            orders={userOrders}
            deleteOrder={deleteOrder}
            reorderItems={reorderItems}
            setPageView={setPageView}
            showToast={showToast}
            setActiveTrackingOrder={setActiveTrackingOrderId}
          />
        )}

        {currentPage === 'order-success' && currentUser && (
          <OrderSuccess
            lastOrder={lastOrder}
            setPageView={setPageView}
          />
        )}

        {currentPage === 'order-tracking' && currentUser && (
          <OrderTracking
            order={activeTrackingOrder}
            setPageView={setPageView}
            updateOrderStatus={updateOrderStatus}
          />
        )}

        {currentPage === 'profile' && currentUser && (
          <Profile
            currentUser={currentUser}
            orders={userOrders}
            addresses={userAddresses}
            updateUser={updateUser}
            setPageView={setPageView}
            showToast={showToast}
          />
        )}

        {currentPage === 'settings' && currentUser && (
          <Settings
            currentUser={currentUser}
            setPageView={setPageView}
            logout={logout}
            showToast={showToast}
          />
        )}
      </main>

      {currentPage !== 'login' && <CustomerBottomNav currentPage={currentPage} currentUser={currentUser} setPageView={setPageView} />}

      <Toast
        notification={toast}
        onClose={() => setToast(null)}
      />

      {/* Footer (hide on login page for cleaner look) */}
      {currentPage !== 'login' && (
        <footer className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-slate-400 py-14 border-t border-slate-800 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

              <div className="md:col-span-2">
                <div className="mb-4">
                  <BrandLogo size="md" variant="dark" showTagline={true} />
                </div>
                <p className="text-sm text-slate-400 leading-relaxed max-w-md mt-4">
                  Bringing authentic, chef-curated cuisine right to your doorstep. Every dish crafted with passion, delivered with care, in under 30 minutes.
                </p>
                <div className="flex items-center gap-3 mt-5 flex-wrap">
                  <div className="px-3 py-1.5 bg-slate-800 rounded-lg text-xs font-bold text-slate-300">📞 1800-PATIL</div>
                  <div className="px-3 py-1.5 bg-slate-800 rounded-lg text-xs font-bold text-slate-300">✉️ hello@patilfoods.com</div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-black text-sm uppercase tracking-wider mb-4">Quick Links</h4>
                <ul className="space-y-2.5 text-sm font-semibold">
                  <li className="hover:text-rose-400 cursor-pointer transition-colors" onClick={() => setPageView('menu')}>Our Menu</li>
                  <li className="hover:text-rose-400 cursor-pointer transition-colors" onClick={() => setPageView('cart')}>View Cart</li>
                  <li className="hover:text-rose-400 cursor-pointer transition-colors" onClick={() => setPageView('orders')}>Order History</li>
                  <li className="hover:text-rose-400 cursor-pointer transition-colors" onClick={() => currentUser ? setPageView('profile') : setPageView('login')}>My Profile</li>
                  <li className="hover:text-rose-400 cursor-pointer transition-colors" onClick={() => currentUser ? setPageView('settings') : setPageView('login')}>Settings</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-black text-sm uppercase tracking-wider mb-4">Account</h4>
                <ul className="space-y-2.5 text-sm font-semibold">
                  {!currentUser ? (
                    <li className="hover:text-rose-400 cursor-pointer transition-colors" onClick={() => setPageView('login')}>Sign In / Register</li>
                  ) : (
                    <li className="hover:text-rose-400 cursor-pointer transition-colors" onClick={logout}>Sign Out</li>
                  )}
                  <li className="hover:text-rose-400 cursor-pointer transition-colors">Privacy Policy</li>
                  <li className="hover:text-rose-400 cursor-pointer transition-colors">Terms of Service</li>
                  <li className="hover:text-rose-400 cursor-pointer transition-colors">Help Center</li>
                </ul>
              </div>

            </div>

            <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <span>&copy; 2026 Patil Foods Pvt. Ltd. All rights reserved.</span>
              <span className="font-semibold">Made with ❤️ for food lovers in India</span>
            </div>
          </div>
        </footer>
      )}

    </div>
  );
};

export default App;
