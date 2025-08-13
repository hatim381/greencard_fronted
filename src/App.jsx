import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Cart from './components/Cart';
import PrivateRoute from './components/PrivateRoute';
import useUser from './hooks/useUser';
import useCart from './hooks/useCart';
import useDarkMode from './hooks/useDarkMode';

// Lazy loaded pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const ProductList = lazy(() => import('./pages/ProductList'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Blog = lazy(() => import('./pages/Blog'));
const About = lazy(() => import('./pages/About'));
const Producers = lazy(() => import('./pages/Producers'));
const Impact = lazy(() => import('./pages/Impact'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Legal = lazy(() => import('./pages/Legal'));
const Cookies = lazy(() => import('./pages/Cookies'));
const Accessibilite = lazy(() => import('./pages/Accessibilite'));
const PlanDuSite = lazy(() => import('./pages/PlanDuSite'));
const Faq = lazy(() => import('./pages/Faq'));
const IAFormMeilleurProduit = lazy(() => import('./pages/IAFormMeilleurProduit'));
const IAFormPredictGoodSale = lazy(() => import('./pages/IAFormPredictGoodSale'));

function App() {
  const { user, setUser, login, register, logout } = useUser();
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const [darkMode, setDarkMode] = useDarkMode();

  const cartCount =
    user && user.role === 'consumer'
      ? cart.reduce((sum, i) => sum + i.quantity, 0)
      : 0;

  return (
    <Router>
      <Navbar
        user={user}
        onLogout={logout}
        cartCount={cartCount}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((dm) => !dm)}
      />
      <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '2em' }}>Chargement…</div>}>
        <Routes>
          <Route
            path="/"
            element={<Home user={user} onAddToCart={user && user.role === 'consumer' ? addToCart : undefined} />}
          />
          <Route
            path="/products"
            element={<ProductList onAddToCart={user && user.role === 'consumer' ? addToCart : undefined} user={user} />}
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute
                user={user}
                element={<Dashboard user={user} setUser={setUser} />}
              />
            }
          />
          <Route
            path="/admin"
            element={<PrivateRoute user={user} roles={['owner']} element={<AdminPanel />} />}
          />
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="/register" element={<Register onRegister={register} />} />
          <Route
            path="/cart"
            element={
              <PrivateRoute
                user={user && user.role === 'consumer' ? user : null}
                element={<Cart cart={cart} onRemove={removeFromCart} onClear={clearCart} user={user} />}
              />
            }
          />
          <Route path="/blog" element={<Blog />} />
          <Route path="/apropos" element={<About />} />
          <Route path="/producteurs" element={<Producers />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/conditions-generales" element={<Terms />} />
          <Route path="/confidentialite" element={<Privacy />} />
          <Route path="/mentions-legales" element={<Legal />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/accessibilite" element={<Accessibilite />} />
          <Route path="/plan-du-site" element={<PlanDuSite />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/ia/meilleur-produit" element={<IAFormMeilleurProduit />} />
          <Route path="/ia/prevision-ventes" element={<IAFormPredictGoodSale />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
}

export default App;
