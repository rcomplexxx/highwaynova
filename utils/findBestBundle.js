
import products from '@/data/products.json'

function findBestBundle(cartProducts) {
    
    
    let cartProductsTemp = [...cartProducts];

    let bestBundleCpIndex;
    
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
        }

    })



    cartProductsTemp = cartProductsTemp.map(cpt => {

        const newCpt = {...cpt};

        if(cpt.priceBeforeBundle){

            const productTemp = products.find(p=>{return p.id === newCpt.id});

            newCpt.price = productTemp.price;
            newCpt.stickerPrice = productTemp.stickerPrice;
            
            
            delete newCpt.priceBeforeBundle;


        }

        return newCpt;

    });

    

    if(bestBundlePrice === 0)return cartProductsTemp;

    


        

    

        cartProductsTemp[bestBundleCpIndex].priceBeforeBundle = cartProductsTemp[bestBundleCpIndex].price;
        cartProductsTemp[bestBundleCpIndex].stickerPrice = cartProductsTemp[bestBundleCpIndex].price;
        cartProductsTemp[bestBundleCpIndex].price = parseFloat((cartProductsTemp[bestBundleCpIndex].price * (100 - bestBundlePercentage)/100).toFixed(2));


       
       
        return cartProductsTemp;
    



}

module.exports = findBestBundle;