

function checkDiscountSavesMoreThenBundle(cartProducts, discountPercentage) {



    const bundledProduct = cartProducts.find(cp => {return cp.priceBeforeBundle!==undefined});


    if(!bundledProduct)return true;

    const priceBeforeBundle = bundledProduct.priceBeforeBundle;

    



    let discountPriceOff = 0;

    cartProducts.forEach(cp =>{

        const cpTotal = cp.priceBeforeBundle?cp.priceBeforeBundle*cp.quantity:cp.price * cp.quantity;

        
        discountPriceOff = discountPriceOff + cpTotal;
    });

    discountPriceOff = parseFloat((discountPriceOff*discountPercentage/100).toFixed(2));

    const bundlePriceOff = (priceBeforeBundle - bundledProduct.price)*bundledProduct.quantity;

    
    console.log('discountPriceOff, and bundlePriceOff', discountPriceOff, bundlePriceOff)


    if(discountPriceOff>=bundlePriceOff)return true;

    return false;
    
    




}

module.exports = checkDiscountSavesMoreThenBundle;