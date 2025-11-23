import { useState, useEffect } from 'react';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];

      const isMobileDevice = mobileKeywords.some((keyword) => userAgent.includes(keyword));

      // Also check screen width for responsive design
      const isSmallScreen = window.innerWidth <= 768;

      setIsMobile(isMobileDevice || isSmallScreen);
    };

    // Check on mount
    checkIsMobile();

    // Add resize listener for responsive updates
    const handleResize = () => {
      checkIsMobile();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;
