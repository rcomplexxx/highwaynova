

function checkDiscountSavesMoreThenBundle(cartProducts, discountPercentage) {



    const bundledProduct = cartProducts.find(cp => cp.priceBeforeBundle !== undefined);

    if (!bundledProduct) return true;
    
    let bundlePriceOff = 0;
    
    const discountPriceOff = parseFloat(
      (
        cartProducts.reduce((total, cp) => {
          bundlePriceOff+= cp.price* cp.quantity;
          const cpTotal = (cp.priceBeforeBundle || cp.price) * cp.quantity;
          return total + cpTotal;
        }, 0) * (100 - discountPercentage) / 100
      ).toFixed(2)
    );
    

    
    console.log('discountPriceOff, and bundlePriceOff', discountPriceOff, bundlePriceOff)


    if(discountPriceOff<=bundlePriceOff)return true;

    return false;
    
    




}

module.exports = checkDiscountSavesMoreThenBundle;