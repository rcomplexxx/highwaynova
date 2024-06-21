

function getTargets(campaignTargets, targetEvenReservedCustomers, db){
  






  
    const targetConditions = (targetPack)=>{
  
      let myTargets;
   
    if(targetPack==='cold_traffic'){
      myTargets = db.prepare(`SELECT email FROM customers WHERE subscribed = ? AND totalOrderCount <= 1`).all(1)?.map(row => row.email);;
  
    }
      else if(targetPack==='warm_traffic'){
        myTargets = db.prepare(`SELECT email FROM customers WHERE subscribed = ? AND totalOrderCount = 2`).all(1)?.map(row => row.email);;
  
      }
        else if(targetPack==='hot_traffic') {
          myTargets = db.prepare(`SELECT email FROM customers WHERE subscribed = ? AND totalOrderCount >= 3 AND totalOrderCount <5`).all(1)?.map(row => row.email);;
  
        } 
        else if(targetPack==='loyal_traffic'){
  
          myTargets = db.prepare(`SELECT email FROM customers WHERE subscribed = ? AND totalOrderCount >= 5`).all(1)?.map(row => row.email);;
  
        }
  
        else  if(targetPack==='all'){
          myTargets = db.prepare(`SELECT email FROM customers WHERE subscribed = ?`).all(1)?.map(row => row.email);;
        }
        else if(targetPack==='bh_customers'){
       
          myTargets = db.prepare(`SELECT email FROM customers WHERE subscribed = ?`).all(0)?.map(row => row.email);
        }
        else{
            console.log('tpack',targetPack)
          myTargets = JSON.parse(targetPack);
        }
  
        return myTargets
  
      }






  
      let targets = targetConditions(campaignTargets);





      
  
  
  
        if(!targetEvenReservedCustomers) {
         let reservedTargets = db.prepare(`SELECT targetCustomers FROM email_campaigns WHERE finished = 0 AND reserveTargetedCustomers = 1`).all().map(row => row.targetCustomers);
        
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