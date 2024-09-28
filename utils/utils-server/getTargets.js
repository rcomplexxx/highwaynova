

 async function getTargets(campaignTargets, targetEvenReservedCustomers, dbConnection){
  


  

  
    const targetConditions = async()=>{
  
      let myTargets;
   
    if(campaignTargets==='cold_traffic'){
      myTargets = (await dbConnection.query(`SELECT email FROM customers WHERE subscribed = 1 AND totalOrderCount <= 1`))?.map(row => row.email);
  
    }
      else if(campaignTargets==='warm_traffic'){
        myTargets = (await dbConnection.query(`SELECT email FROM customers WHERE subscribed = 1 AND totalOrderCount = 2`))?.map(row => row.email);
  
      }
        else if(campaignTargets==='hot_traffic') {
          myTargets = (await dbConnection.query(`SELECT email FROM customers WHERE subscribed = 1 AND totalOrderCount >= 3 AND totalOrderCount <5`))?.map(row => row.email);
  
        } 
        else if(campaignTargets==='loyal_traffic'){
  
          myTargets = (await dbConnection.query(`SELECT email FROM customers WHERE subscribed = 1 AND totalOrderCount >= 5`))?.map(row => row.email);
  
        }
  
        else  if(campaignTargets==='all'){
          myTargets =  (await dbConnection.query(`SELECT email FROM customers WHERE subscribed = 1`))?.map(row => row.email);
        }
        else if(campaignTargets==='bh_customers'){
       
          myTargets = (await dbConnection.query(`SELECT email FROM customers WHERE subscribed = 0`))?.map(row => row.email);
        }
        else{
            console.log('tpack',campaignTargets)
          myTargets = JSON.parse(campaignTargets);
        }
  
        return myTargets
  
      }






  
      let targets = await targetConditions();





  
  
  
        if(!targetEvenReservedCustomers) {

          //Filtrira targete od emailova koji su vec rezervisani za drugu kampanju. Naravno, samo ako je targetEvenReservedCustomers false.(trenutno je to slucaj samo sa flow-ovima(thank you, welcome))
          //Takodje pokuplja samo targete gde je finished = 0, sto znaci da kad se kampanja zavrsi, vise ne moze da koci ostale kampanje da targetuju.

          const reservedTargetsList = new Set(
            (await dbConnection.query(`
              SELECT targetCustomers 
              FROM email_campaigns 
              WHERE finished = 0 AND reserveTargetedCustomers = 1
            `)).flatMap(row => JSON.parse(row.targetCustomers))  // Flatten the arrays
          );
   
         
         
          console.log('targets, reserved targets', reservedTargetsList);

          targets = targets.filter(target => !reservedTargetsList.has(target));
  
        }
          
     
        
  
        return targets;
   }

   export default getTargets;