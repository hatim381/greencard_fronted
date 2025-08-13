import React from 'react';

const ProductCard = ({ product }) => {
  const defaultImage = '/default-product.png'; // Placez une image par défaut dans public/
  const imageUrl = product.imageUrl || defaultImage;

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