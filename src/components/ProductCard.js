import React from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'https://greencard-backend.onrender.com/api';

const ProductCard = ({ product }) => {
  const defaultImage = '/placeholder.jpg';
  let imageUrl = product.image_url || product.imageUrl || product.image;
  if (imageUrl && !imageUrl.startsWith('http') && imageUrl.startsWith('/uploads')) {
    imageUrl = `${API_URL.replace('/api', '')}${imageUrl}`;
  }
  if (!imageUrl) imageUrl = defaultImage;

  return (
    <div className="product-card">
      <img
        src={imageUrl}
        alt={product.name}
        onError={e => { e.target.onerror = null; e.target.src = defaultImage; }}
        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
      />
      {/* ...existing code... */}
    </div>
  );
};

export default ProductCard;