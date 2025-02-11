import { useState, useEffect } from 'react';

export default function useIsLargeScreen() {

  const hasWindow = typeof window !== 'undefined';

  function getWindowDimensions() {
    const isLargeScreen = hasWindow ? window.innerWidth>980 : false;
    
    return isLargeScreen;
  }

  const [isLargeScreen, setIsLargeScreen] = useState(undefined);

  useEffect(() => {

    console.log('hello! From large sc check')
    if (!hasWindow) return;

    function handleResize() {
      setIsLargeScreen(getWindowDimensions());
    }

    // Run once to set initial value
    handleResize();

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    




  }, []);

  return isLargeScreen;
}