const farmhash = require('farmhash');

const hashData = (stringToHash) => {

    const saltedString = stringToHash + process.env.HASH_SALT;
 

    const hashValue = farmhash.hash32(saltedString);

    
    return hashValue.toString(16);

};


module.exports =  hashData;



