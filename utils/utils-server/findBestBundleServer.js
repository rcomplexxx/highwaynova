
import products from '@/data/products.json'

function findBestBundleServer(cartProducts) {
    // Aggregate cart products by id using a helper object
   

    


    const shrinkedCartProductsTemp = cartProducts.reduce((acc, cp) => {
        const existing = acc.find(scp => scp.id == cp.id);
        existing?  existing.quantity+=cp.quantity : acc.push({ ...cp });
        return acc;
      }, []);

    let bestBundle = {
        id: null,
        price: 0,
        priceOff: 0,
        originalPrice: 0,
        percentage: 0
    };

    shrinkedCartProductsTemp.forEach(cp => {
        const product = products.find(p => p.id === cp.id);
        if (!product?.bundle) return;

        let offer = product.bundle.findLast(b => cp.quantity >= b.quantity);


        
    if (!offer) return;

    
    
    const discount = offer.discountPercentage;

        
            const priceOff = parseFloat((product.price * cp.quantity * discount / 100).toFixed(2));

            if (priceOff > bestBundle.priceOff) {

                
                bestBundle = {
                    id: product.id,
                    priceOff: priceOff,
                    originalPrice: product.price,
                    percentage: discount
                };

            }
      
    });

    

    if (bestBundle.priceOff !== 0) {

        cartProducts = cartProducts.map(cp => {
            if (cp.id === bestBundle.id)  cp.bundledPrice = parseFloat((bestBundle.originalPrice * (100 - bestBundle.percentage) / 100).toFixed(2));

            return cp;
        });
    }

    return cartProducts;
}

module.exports = findBestBundleServer;