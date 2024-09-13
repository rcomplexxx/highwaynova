
function checkDiscountSavesMoreThenBundle(cartProducts, discountPercentage) {
  const bundledProduct = cartProducts.some(cp => cp.priceBeforeBundle !== undefined);
  if (!bundledProduct) return true;

  let bundlePriceOff = 0;
  const discountPriceOff = cartProducts.reduce((total, cp) => {
    bundlePriceOff += cp.price * cp.quantity;
    const cpTotal = (cp.priceBeforeBundle || cp.price) * cp.quantity;
    return total + cpTotal;
  }, 0) * ((100 - discountPercentage) / 100);

  return discountPriceOff <= bundlePriceOff;
}

module.exports = checkDiscountSavesMoreThenBundle;