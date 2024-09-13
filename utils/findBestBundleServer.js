
import products from '@/data/products.json'

function findBestBundleServer(cartProducts) {
    
    
    let cartProductsTemp = [...cartProducts];

    let bestBundleCpId;

    let bestBundleProductOrigPrice =0;
    
    let bestBundlePrice = 0;
    let bestBundlePercentage = 0;

    
  

    cartProductsTemp.forEach((cp) => {

        const product = products.find(p =>{return p.id == cp.id});

        if(!product.bundle) return;

      
        let offerIndex;
            
            
            product.bundle.forEach((pb, index) =>{ 

                if(cp.quantity>=pb.quantity)offerIndex = index;

            });

            if(offerIndex===undefined)return;

    

        const cartProductBundlePriceOff = parseFloat((product.price* cp.quantity * product.bundle[offerIndex].discountPercentage/100).toFixed(2));

        if(cartProductBundlePriceOff>bestBundlePrice){
            bestBundleCpId = cp.id;
            bestBundlePrice=cartProductBundlePriceOff;
            bestBundleProductOrigPrice= product.price;
            bestBundlePercentage = product.bundle[offerIndex].discountPercentage;
        }

    })


    
    

    if(bestBundlePrice == 0)return cartProductsTemp;

    


        
        cartProductsTemp = cartProductsTemp.map(cp => {
            if(cp.id === bestBundleCpId) cp.bundledPrice =  parseFloat((bestBundleProductOrigPrice * (100 - bestBundlePercentage)/100).toFixed(2));

            return cp;
        })
    
        


       
       
        return cartProductsTemp;
    



}

module.exports = findBestBundleServer;