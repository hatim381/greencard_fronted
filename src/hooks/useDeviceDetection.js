import { useState, useEffect } from 'react';

const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent;
      
      // Détection mobile
      const isMobileDevice = /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isMobileWidth = width <= 768;
      
      // Détection tablet
      const isTabletDevice = /iPad|Android.*Tablet|Kindle/i.test(userAgent);
      const isTabletWidth = width > 768 && width <= 1024;
      
      setIsMobile(isMobileDevice || isMobileWidth);
      setIsTablet((isTabletDevice || isTabletWidth) && !isMobileDevice);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
};

export default useDeviceDetection;
