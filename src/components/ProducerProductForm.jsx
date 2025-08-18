
// ...existing code...
import React, { useState } from 'react';
import { products } from '../services/api';
import ProductCard from './ProductCard';

const ProducerProductForm = ({ user, product, onClose }) => {
  const [name, setName] = useState(product ? product.name : '');
  const [price, setPrice] = useState(product ? product.price : '');
  const [quantity, setQuantity] = useState(product ? product.quantity : '');
  const [category, setCategory] = useState(product ? product.category || '' : '');
  const [dlc, setDlc] = useState(product && product.dlc ? product.dlc.substring(0, 10) : '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [co2Reduction, setCo2Reduction] = useState(product ? product.co2_reduction || '' : '');
  const [description, setDescription] = useState(product ? product.description || '' : '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Validation stricte
    if (!name || !price || !quantity || !category || !dlc) {
      setError("Tous les champs marqués * sont obligatoires.");
      setLoading(false);
      return;
    }
    if (parseFloat(price) <= 0) {
      setError("Le prix doit être supérieur à 0.");
      setLoading(false);
      return;
    }
    if (isNaN(parseInt(quantity, 10)) || parseInt(quantity, 10) < 0) {
      setError("La quantité ne peut pas être négative.");
      setLoading(false);
      return;
    }
    try {
      let payload;
      if (image) {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', parseFloat(price));
        formData.append('quantity', parseInt(quantity, 10));
        formData.append('producer_id', user.id);
        formData.append('category', category);
        formData.append('dlc', dlc);
        formData.append('image', image);
        formData.append('co2_reduction', co2Reduction);
        formData.append('description', description);
        payload = formData;
      } else {
        payload = {
          name,
          price: parseFloat(price),
          quantity: parseInt(quantity, 10),
          producer_id: user.id,
          category,
          dlc,
          co2_reduction: co2Reduction,
          description
        };
      }
      if (product) {
        if (image) {
          await products.update(product.id, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
        } else {
          await products.update(product.id, payload);
        }
      } else {
        if (image) {
          await products.add(payload, { headers: { 'Content-Type': 'multipart/form-data' } });
        } else {
          await products.add(payload);
        }
      }
      onClose(true);
    } catch (err) {
      let msg = "Erreur lors de l'enregistrement du produit";
      if (err.response && err.response.data && err.response.data.error) {
        msg += " : " + err.response.data.error;
      } else if (err.response && err.response.data && err.response.data.message) {
        msg += " : " + err.response.data.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="producer-product-form-modal" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.18)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 4px 24px #22C55E22',
        padding: '2.5em 2em',
        minWidth: 340,
        maxWidth: 480,
        width: '100%',
        position: 'relative',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer', color: '#22C55E' }}>×</button>
        <h2 style={{ color: '#22C55E', fontWeight: 800, marginBottom: 18 }}>{product ? 'Modifier le produit' : 'Ajouter un produit'}</h2>
        {product && (
          <div style={{ marginBottom: 24 }}>
            <ProductCard product={product} preview />
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label style={{ fontWeight: 600 }}>Nom du produit *</label>
          <input value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%' }} />
          <label style={{ fontWeight: 600 }}>Prix (€) *</label>
          <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required style={{ width: '100%' }} />
          <label style={{ fontWeight: 600 }}>Quantité *</label>
          <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required style={{ width: '100%' }} />
          <label style={{ fontWeight: 600 }}>Catégorie *</label>
          <select value={category} onChange={e => setCategory(e.target.value)} required style={{ width: '100%' }}>
            <option value="">Sélectionnez une catégorie</option>
            <option value="Fruits & légumes">Fruits & légumes</option>
            <option value="Produits laitiers">Produits laitiers</option>
            <option value="Viandes & Volaille">Viandes & Volaille</option>
            <option value="Boulangerie">Boulangerie</option>
            <option value="Boissons">Boissons</option>
          </select>
          <label style={{ fontWeight: 600 }}>Date limite de consommation *</label>
          <input type="date" value={dlc} onChange={e => setDlc(e.target.value)} required style={{ width: '100%' }} />
          <label style={{ fontWeight: 600 }}>Image</label>
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} style={{ width: '100%' }} />
          <label style={{ fontWeight: 600 }}>Réduction CO2 (%)</label>
          <input type="number" step="0.01" value={co2Reduction} onChange={e => setCo2Reduction(e.target.value)} style={{ width: '100%' }} />
          <label style={{ fontWeight: 600 }}>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%' }} />
          {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button type="submit" disabled={loading} style={{ background: '#22C55E', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>{loading ? 'Enregistrement...' : product ? 'Modifier' : 'Ajouter'}</button>
            <button type="button" onClick={() => onClose(false)} style={{ background: '#eee', color: '#222', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProducerProductForm;
