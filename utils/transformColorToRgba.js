


const transformColorToRgb = (bgColor, opacity)=>{

    if(bgColor.includes('hsl')){

      const hslValues = bgColor.match(/\d+/g);
      let h = hslValues[0] / 360;
      let s = hslValues[1] / 100;
      let l = hslValues[2] / 100;
  
      let r, g, b;
  
      if (s === 0) {
          r = g = b = l; // achromatic
      } else {
          const hue2rgb = (p, q, t) => {
              if (t < 0) t += 1;
              if (t > 1) t -= 1;
              if (t < 1/6) return p + (q - p) * 6 * t;
              if (t < 1/2) return q;
              if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
              return p;
          };
  
          let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          let p = 2 * l - q;
          r = hue2rgb(p, q, h + 1/3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1/3);
      }
  
      r = Math.round(r * 255);
      g = Math.round(g * 255);
      b = Math.round(b * 255);
  
      if(opacity!==undefined && opacity!==1) return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      return `rgb(${r}, ${g}, ${b})`;

      

    }
    else if(bgColor.includes('#')){

      let r = 0, g = 0, b = 0;
      if (bgColor.length === 4) {
          r = parseInt(bgColor[1] + bgColor[1], 16);
          g = parseInt(bgColor[2] + bgColor[2], 16);
          b = parseInt(bgColor[3] + bgColor[3], 16);
      } else if (bgColor.length === 7) {
          r = parseInt(bgColor[1] + bgColor[2], 16);
          g = parseInt(bgColor[3] + bgColor[4], 16);
          b = parseInt(bgColor[5] + bgColor[6], 16);
      }
      if(opacity!==undefined && opacity!==1) return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      return `rgb(${r}, ${g}, ${b})`;

    }

    else if(bgColor.includes('rgba'))return bgColor;

    else if(bgColor.includes('rgb')){

        const rgbValues = bgColor.match(/\d+/g);
        const r = rgbValues[0];
        const g = rgbValues[1];
        const b = rgbValues[2];
    
        // Convert to rgba by adding the opacity
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    
        
    }

    
   }


   module.exports = {
    transformColorToRgb
  };