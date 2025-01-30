

 async function getTargets(campaignTargets, targetEvenReservedCustomers, dbConnection){
  


  

  
  const targetConditions = async () => {
    const conditionsMap = {
      cold_traffic: "subscribed = 1 AND totalOrderCount <= 1",
      warm_traffic: "subscribed = 1 AND totalOrderCount = 2",
      hot_traffic: "subscribed = 1 AND totalOrderCount >= 3 AND totalOrderCount < 5",
      loyal_traffic: "subscribed = 1 AND totalOrderCount >= 5",
      all: "subscribed = 1",
      bh_customers: "subscribed = 0",
    };
  
    if (conditionsMap[campaignTargets]) {
      const condition = conditionsMap[campaignTargets]; 
      return (await dbConnection.query(`SELECT email FROM customers WHERE emailBounceCount < 4 AND ${condition}`))?.map(row => row.email);
    } else {
      console.log("tpack", campaignTargets);
      return JSON.parse(campaignTargets);
    }
  };






  
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