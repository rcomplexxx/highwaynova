
import products from '@/data/products.json'

function findBundleDiscount(orderCardItems) {
    
   
    let fullItems = orderCardItems.map(item => {
        const product = products.find(p => p.id === item.id) || {}; // Find the product
        return {  ...item, price: product.price, bundle: product.bundle }; // Merge the found product with the item
      });




    const shrinkedfullItems = fullItems.reduce((acc, fullItem) => {
        const existing = acc.find(scp => scp.id == fullItem.id);
        existing?  existing.quantity+=fullItem.quantity : acc.push({ ...fullItem });
        return acc;
      }, []);

    let bestBundle = {
        id: null,
        bundleItemDiscount: 0,
        bundleLabel: ''
    };


    


    shrinkedfullItems.forEach(fullItem => {
        
        
        if (!fullItem?.bundle) return;

        const offerIndex = fullItem.bundle.findLastIndex(b => fullItem.quantity >= b.quantity);

        

        
        
    if (offerIndex===-1) return;

    
    const offer = fullItem.bundle[offerIndex];

    
    
    const discountPercentage = offer.discountPercentage;

    console.log('disc', discountPercentage)
        
            const bundleItemDiscount = parseFloat((fullItem.price * fullItem.quantity * discountPercentage / 100).toFixed(2));

            if (bundleItemDiscount > bestBundle.bundleItemDiscount) {

                
                bestBundle = {
                    id: fullItem.id,
                    bundleItemDiscount: bundleItemDiscount,
                    discountPercentage: discountPercentage,
                    bundleLabel: `${offer.quantity}${offer.quantity===fullItem.bundle?.at(-1) || offer.quantity +1 < fullItem.bundle[offerIndex+1]?'+':''}`
                };

            }
      
    });


    

    if(!bestBundle.bundleItemDiscount)return undefined;

    return {label: `BUNDLE (p.id:${bestBundle.id}, q:${bestBundle.bundleLabel})`, bundleDiscount: bestBundle.discountPercentage}

 
    
}

module.exports = findBundleDiscount;