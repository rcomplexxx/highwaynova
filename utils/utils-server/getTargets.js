

 async function getTargets(campaignTargets, targetEvenReservedCustomers, dbConnection){
  


  

  
    const targetConditions = async()=>{
  
      let myTargets;
   
    if(campaignTargets==='cold_traffic'){
      myTargets = (await dbConnection.query(`SELECT email FROM customers WHERE subscribed = ? AND totalOrderCount <= 1`,[1]))?.map(row => row.email);
  
    }
      else if(campaignTargets==='warm_traffic'){
        myTargets = (await dbConnection.query(`SELECT email FROM customers WHERE subscribed = ? AND totalOrderCount = 2`,[1]))?.map(row => row.email);
  
      }
        else if(campaignTargets==='hot_traffic') {
          myTargets = (await dbConnection.query(`SELECT email FROM customers WHERE subscribed = ? AND totalOrderCount >= 3 AND totalOrderCount <5`,[1]))?.map(row => row.email);
  
        } 
        else if(campaignTargets==='loyal_traffic'){
  
          myTargets = (await dbConnection.query(`SELECT email FROM customers WHERE subscribed = ? AND totalOrderCount >= 5`,[1]))?.map(row => row.email);
  
        }
  
        else  if(campaignTargets==='all'){
          myTargets =  (await dbConnection.query(`SELECT email FROM customers WHERE subscribed = ?`,[1]))?.map(row => row.email);
        }
        else if(campaignTargets==='bh_customers'){
       
          myTargets = (await dbConnection.query(`SELECT email FROM customers WHERE subscribed = ?`,[0]))?.map(row => row.email);
        }
        else{
            console.log('tpack',campaignTargets)
          myTargets = JSON.parse(campaignTargets);
        }
  
        return myTargets
  
      }






  
      let targets = await targetConditions();





  
  
  
        if(!targetEvenReservedCustomers) {
         let reservedTargets =  (await dbConnection.query(`SELECT targetCustomers FROM email_campaigns WHERE finished = 0 AND reserveTargetedCustomers = 1`))?.map(row => row.targetCustomers);
        
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