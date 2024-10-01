
import products from '@/data/products.json'

function findBestBundleServer(cartProducts) {
    // Aggregate cart products by id using a helper object
   
    const shrinkedCartProductsTemp = [];

    cartProducts.forEach(cp => {
        
        const existingProduct = shrinkedCartProductsTemp.find(scp => scp.id === cp.id);
    
        if (existingProduct) {
            
            existingProduct.quantity += cp.quantity;
        } else {
            
            shrinkedCartProductsTemp.push({ ...cp });
        }
    });

    let bestBundle = {
        id: null,
        price: 0,
        originalPrice: 0,
        percentage: 0
    };

    shrinkedCartProductsTemp.forEach(cp => {
        const product = products.find(p => p.id === cp.id);
        if (!product || !product.bundle) return;

        let bestOffer = product.bundle.reduce((best, current) => {
            return (cp.quantity >= current.quantity && current.discountPercentage > (best.discountPercentage || 0))
                ? current
                : best;
        }, {});

        if (bestOffer.discountPercentage) {
            const priceOff = parseFloat((product.price * cp.quantity * bestOffer.discountPercentage / 100).toFixed(2));

            if (priceOff > bestBundle.priceOff) {
                bestBundle = {
                    id: cp.id,
                    priceOff: discountPrice,
                    originalPrice: product.price,
                    percentage: bestOffer.discountPercentage
                };
            }
        }
    });

    if (bestBundle.priceOff !== 0) {
        cartProducts = cartProducts.map(cp => {
            if (cp.id === bestBundle.id) {
                cp.bundledPrice = parseFloat((bestBundle.originalPrice * (100 - bestBundle.percentage) / 100).toFixed(2));
            }
            return cp;
        });
    }

    return cartProducts;
}

module.exports = findBestBundleServer;