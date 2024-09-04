
import products from '@/data/products.json'

function findBestBundle(cartProducts) {
    
    
    let cartProductsTemp = [...cartProducts];

    let bestBundleCpId;
    let bundleQuantity;
    let bestBundlePrice = 0;
    let bestBundlePercentage = 0;

    const shrinkedCartProductsTemp = [];

     cartProductsTemp.forEach(cp =>{

        const foundshrinkedCpIndex = shrinkedCartProductsTemp.findIndex(scp =>{return scp.id===cp.id});

        

        if (foundshrinkedCpIndex!==-1){
            
            shrinkedCartProductsTemp[foundshrinkedCpIndex].quantity = shrinkedCartProductsTemp[foundshrinkedCpIndex].quantity + cp.quantity;

        }

        else{
            shrinkedCartProductsTemp.push({...cp});
        }

      
    })
  

    shrinkedCartProductsTemp.forEach((cp) => {

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
            bundleQuantity=product.bundle[offerIndex].quantity;
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
            delete newCpt.bundleQuantity;

        }

        return newCpt;

    });

    
  console.log('here is cartProductsTemp rn', cartProductsTemp)

    if(bestBundlePrice == 0)return cartProductsTemp;

    


    

    cartProductsTemp = cartProductsTemp.map(cp => {
        if(cp.id === bestBundleCpId) 
            {
                cp.priceBeforeBundle = cp.price;
                cp.bundleQuantity = bundleQuantity;
              cp.stickerPrice = cp.price;
                cp.price =  parseFloat((cp.price * (100 - bestBundlePercentage)/100).toFixed(2));
                
            }

            return cp
    })

       
       
        return cartProductsTemp;
    



}

module.exports = findBestBundle;