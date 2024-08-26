
import products from '@/data/products.json'

function findBestBundleServer(cartProducts) {
    
    
    let cartProductsTemp = [...cartProducts];

    let bestBundleCpIndex;

    let bestBundleProductOrigPrice =0;
    
    let bestBundlePrice = 0;
    let bestBundlePercentage = 0;


  

    cartProductsTemp.forEach((cp, index) => {

        const product = products.find(p =>{return p.id == cp.id});

        if(!product.bundle) return;

      
        let offerIndex;
            
            
            product.bundle.forEach((pb, index) =>{ 

                if(cp.quantity>=pb.quantity)offerIndex = index;

            });

            if(offerIndex===undefined)return;

    

        const cartProductBundlePriceOff = parseFloat((product.price* cp.quantity * product.bundle[offerIndex].discountPercentage/100).toFixed(2));

        if(cartProductBundlePriceOff>bestBundlePrice){
            bestBundleCpIndex = index;
            bestBundlePrice=cartProductBundlePriceOff;
            bestBundlePercentage = product.bundle[offerIndex].discountPercentage;
            bestBundleProductOrigPrice= product.price;
        }

    })


    
    

    if(bestBundlePrice === 0)return cartProductsTemp;

    


        

    
    
        cartProductsTemp[bestBundleCpIndex].bundledPrice = parseFloat((bestBundleProductOrigPrice * (100 - bestBundlePercentage)/100).toFixed(2));


       
       
        return cartProductsTemp;
    



}

module.exports = findBestBundleServer;