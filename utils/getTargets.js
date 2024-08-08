

 async function getTargets(campaignTargets, targetEvenReservedCustomers, dbConnection){
  






  
    const targetConditions = async(targetPack)=>{
  
      let myTargets;
   
    if(targetPack==='cold_traffic'){
      myTargets = await dbConnection.query(`SELECT email FROM customers WHERE subscribed = ? AND totalOrderCount <= 1`,[1])?.map(row => row.email);
  
    }
      else if(targetPack==='warm_traffic'){
        myTargets = await dbConnection.query(`SELECT email FROM customers WHERE subscribed = ? AND totalOrderCount = 2`,[1])?.map(row => row.email);
  
      }
        else if(targetPack==='hot_traffic') {
          myTargets = await dbConnection.query(`SELECT email FROM customers WHERE subscribed = ? AND totalOrderCount >= 3 AND totalOrderCount <5`,[1])?.map(row => row.email);
  
        } 
        else if(targetPack==='loyal_traffic'){
  
          myTargets = await dbConnection.query(`SELECT email FROM customers WHERE subscribed = ? AND totalOrderCount >= 5`,[1])?.map(row => row.email);
  
        }
  
        else  if(targetPack==='all'){
          myTargets =  await dbConnection.query(`SELECT email FROM customers WHERE subscribed = ?`,[1])?.map(row => row.email);
        }
        else if(targetPack==='bh_customers'){
       
          myTargets = await dbConnection.query(`SELECT email FROM customers WHERE subscribed = ?`,[0])?.map(row => row.email);
        }
        else{
            console.log('tpack',targetPack)
          myTargets = JSON.parse(targetPack);
        }
  
        return myTargets
  
      }






  
      let targets = await targetConditions(campaignTargets);





      
  
  
  
        if(!targetEvenReservedCustomers) {
         let reservedTargets =  await dbConnection.query(`SELECT targetCustomers FROM email_campaigns WHERE finished = 0 AND reserveTargetedCustomers = 1`).map(row => row.targetCustomers);
        
         reservedTargets = [...new Set(reservedTargets)];
         let reservedTargetsFinal = [];
  
         reservedTargets.forEach(reservedTarget=>{
  
          reservedTargetsFinal= reservedTargetsFinal.concat(targetConditions(reservedTarget))
         })
  
         reservedTargetsFinal = [...new Set(reservedTargetsFinal)];
  
         targets = targets.filter(target => {return !reservedTargetsFinal.find(reservedTarget => reservedTarget===target) });
  
         console.log('reserved targets', reservedTargetsFinal);
  
  
        }
          
     
        
  
        return targets;
   }

   export default getTargets;