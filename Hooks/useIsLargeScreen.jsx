import { useState, useEffect } from 'react';

export default function useIsLargeScreen() {

  const hasWindow = typeof window !== 'undefined';

  function getWindowDimensions() {
    const isLargeScreen = hasWindow ? window.innerWidth>980 : false;
    
    return isLargeScreen;
  }

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [hasWindow]);

  return windowDimensions;
}