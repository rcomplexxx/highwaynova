

const products = require('@/data/products.json');

function findBestBundle(cartProducts) {
  let cartProductsTemp = [...cartProducts];
  let bestBundle = { id: null, quantity: 0, label: '', priceOff: 0, discountPercentage: 0 };

  
  const shrinkedCartProductsTemp = cartProductsTemp.reduce((acc, cp) => {
    const existing = acc.find(scp => scp.id === cp.id);
    existing?  existing.quantity++ : acc.push({ ...cp });
    return acc;
  }, []);



  
 



  shrinkedCartProductsTemp.forEach(cp => {
    const product = products.find(p => p.id === cp.id);
    if (!product?.bundle) return;

    let offerIndex = -1;
    for (let i = product.bundle.length - 1; i >= 0; i--) {
      if (cp.quantity >= product.bundle[i].quantity) {
        offerIndex = i;
        break; 
      }
    }

    if (offerIndex === -1) return;

    const discount = product.bundle[offerIndex].discountPercentage;
    const priceOff = parseFloat((product.price * cp.quantity * discount / 100).toFixed(2));

    

    if (priceOff > bestBundle.priceOff) {
      bestBundle = {
        id: cp.id,
        quantity: product.bundle[offerIndex].quantity,
        label: `${product.bundle[offerIndex].quantity}${(product.bundle.length - 1 === offerIndex || product.bundle[offerIndex + 1]?.quantity - product.bundle[offerIndex].quantity > 1) ? '+' : ''}`,
        priceOff,
        discountPercentage: discount
      };
    }
  });

  cartProductsTemp = cartProductsTemp.map(cpt => {
    const newCpt = { ...cpt };

    if (newCpt.priceBeforeBundle) {
      const productTemp = products.find(p => p.id === newCpt.id);
      newCpt.price = productTemp.price;
      newCpt.stickerPrice = productTemp.stickerPrice;
      delete newCpt.stickerPriceBeforeBundle;
      delete newCpt.priceBeforeBundle;
      delete newCpt.bundleQuantity;
      delete newCpt.bundleLabel;
    }

    if (newCpt.id === bestBundle.id) {
      newCpt.stickerPriceBeforeBundle = newCpt.stickerPrice;
      newCpt.priceBeforeBundle = newCpt.price;
      newCpt.bundleQuantity = bestBundle.quantity;
      newCpt.bundleLabel = bestBundle.label;
      newCpt.stickerPrice = newCpt.price;
      newCpt.price = parseFloat((newCpt.price * (100 - bestBundle.discountPercentage) / 100).toFixed(2));
    }

    return newCpt;
  });

  return bestBundle.priceOff === 0 ? cartProductsTemp : cartProductsTemp;
}

module.exports = findBestBundle;