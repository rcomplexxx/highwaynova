import fs from 'fs';



function makeNewDescription(descriptionText, productId) {



    




const filename = process.cwd()+ '/data/products.json';

console.log('program is utilizing file correctly.')

fs.readFile(filename, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return false;
  }

  // Step 2: Parse the JSON data into a JavaScript object
  const jsonArray = JSON.parse(data);
  
  
  
  
  
  

  console.log('json array', jsonArray);
  
  

  // Step 3: Modify the desired field
  
  
  const ObjWithProductIdExists = jsonArray.findIndex(obj =>{return obj.id==productId});
  
  if(ObjWithProductIdExists === -1){
	  
	  
	  const newProduct= {
    id: productId,
    name: `Product ${productId}`,
    description: descriptionText,
    images: ["image1.jpg","image2.jpg"],
    thumbnails: [ 0, 1 ],
    price: 998.99,
    stickerPrice: 999.99,
    fbt: [  {
        "id": 0,
        "variantIndex": 0
      },
      {
        "id": 1,
        "variantIndex": 0
      } ],
    raiting: 4.7,
    reviewNumber: 32,
	variants: [
      {
        "name": "White",
        "image": "variant_1_image.jpg",
        "variantProductImageIndex": 0
      },
      {
        "name": "Black",
        "image": "variant_2_image.jpg",
        "variantProductImageIndex": 1
      }
    ]
  }
	  
	  jsonArray.push(newProduct);
  
  }
  
  else{
  
  
 jsonArray.forEach(obj => {
	 
	   
	 if(obj.id == productId)
    obj["description"] = descriptionText; 
  });
  





}
  
  
  
  
  
  

// Step 4: Stringify the modified object back to JSON
const updatedJson = JSON.stringify(jsonArray, null, 2);

// Step 5: Write the updated JSON back to the file
fs.writeFile(filename, updatedJson, 'utf8', err => {
  if (err) {
    console.error('Error writing to the file:', err);
    return false;
  } else {
    console.log('JSON file has been updated successfully.');
    return true;
  }
});


});
return true;
}


    module.exports =  makeNewDescription;