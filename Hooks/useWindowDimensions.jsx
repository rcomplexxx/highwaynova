import { useState, useEffect } from 'react';

export default function useWindowWidth() {

  const hasWindow = typeof window !== 'undefined';

  function getWindowWidth() {
    const width = hasWindow ? window.innerWidth : null;
    
    return width;
  }

  const [windowWidth, setWindowWidth] = useState(getWindowWidth());

  useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowWidth(getWindowWidth());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [hasWindow]);

  return windowWidth;
}