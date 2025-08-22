import React, { useState, useEffect, useRef } from 'react';

const VideoIntro = ({ onVideoEnd }) => {
  const [showVideo, setShowVideo] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleInteraction = () => {
      if (showVideo) {
        setShowVideo(false);
        onVideoEnd();
      }
    };

    const handleVideoEnd = () => {
      setShowVideo(false);
      onVideoEnd();
    };

    // Gestion des événements d'interaction
    const handleClick = handleInteraction;
    const handleTouch = handleInteraction;
    const handleKeyPress = (e) => {
      // N'importe quelle touche du clavier
      handleInteraction();
    };

    // Ajouter les listeners d'événements
    if (showVideo) {
      document.addEventListener('click', handleClick);
      document.addEventListener('touchstart', handleTouch);
      document.addEventListener('keydown', handleKeyPress);
      
      // Listener pour la fin de la vidéo
      const videoElement = videoRef.current;
      if (videoElement) {
        videoElement.addEventListener('ended', handleVideoEnd);
      }
    }

    // Cleanup des listeners
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('touchstart', handleTouch);
      document.removeEventListener('keydown', handleKeyPress);
      
      const videoElement = videoRef.current;
      if (videoElement) {
        videoElement.removeEventListener('ended', handleVideoEnd);
      }
    };
  }, [showVideo, onVideoEnd]);

  // Si la vidéo ne doit plus être affichée, ne rien rendre
  if (!showVideo) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(2px)', // Ajoute un effet de flou pour renforcer l'opacité
      WebkitBackdropFilter: 'blur(2px)', // Support Safari mobile
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      // Force le fond blanc sur mobile
      background: 'rgba(255, 255, 255, 0.95)',
      // Empêche les problèmes de rendu mobile
      transform: 'translateZ(0)',
      WebkitTransform: 'translateZ(0)'
    }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          // Assure que la vidéo ne déborde pas et garde sa transparence
          backgroundColor: 'transparent',
          border: 'none',
          outline: 'none'
        }}
      >
        <source src="/Videos/grelogo.webm" type="video/webm" />
        Votre navigateur ne supporte pas la vidéo HTML5.
      </video>
      
      {/* Indicateur discret pour encourager l'interaction */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#333',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        opacity: 0.8,
        textAlign: 'center',
        pointerEvents: 'none',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        Touchez l'écran pour continuer
      </div>
    </div>
  );
};

export default VideoIntro;
