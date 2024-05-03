import React, { useEffect, useRef } from 'react';
import Masonry from 'masonry-layout';
import styles from './masonrylayout.module.css'

const MasonryLayout = ({ children }) => {
  const masonryRef = useRef(null);

  useEffect(() => {
    // Initialize Masonry
    const masonry = new Masonry(masonryRef.current, {
      // Options here, e.g., columnWidth, itemSelector, etc.
      columnWidth: '.grid-sizer',
      itemSelector: '.grid-item',
      // Other options as needed
    });

    // Update layout when children change
    masonry.layout();

    // Clean up
    return () => {
      masonry.destroy();
    };
  }, [children]);

  return (
    <div ref={masonryRef} className={styles.grid}>
      {/* Render children */}
      {children}
    </div>
  );
};

export default MasonryLayout;