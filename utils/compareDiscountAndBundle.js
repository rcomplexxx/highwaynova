

function checkDiscountSavesMoreThenBundle(cartProducts, discountPercentage) {



    const bundledProduct = cartProducts.find(cp => cp.priceBeforeBundle !== undefined);

    if (!bundledProduct) return true;
    
    const priceBeforeBundle = bundledProduct.priceBeforeBundle;
    
    const discountPriceOff = parseFloat(
      (
        cartProducts.reduce((total, cp) => {
          const cpTotal = (cp.priceBeforeBundle || cp.price) * cp.quantity;
          return total + cpTotal;
        }, 0) * discountPercentage / 100
      ).toFixed(2)
    );
    
    const bundlePriceOff = (priceBeforeBundle - bundledProduct.price) * bundledProduct.quantity;

    
    console.log('discountPriceOff, and bundlePriceOff', discountPriceOff, bundlePriceOff)


    if(discountPriceOff>=bundlePriceOff)return true;

    return false;
    
    




}

module.exports = checkDiscountSavesMoreThenBundle;