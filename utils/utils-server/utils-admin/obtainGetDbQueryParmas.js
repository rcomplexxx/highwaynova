const obtainGetDbQueryParams = (dataType) => {






    let table;
    let queryCondition;
    let selectVariables;


    

  if(dataType === "get_order_cash_info"){

    table = "orders";
    queryCondition=`approved = 1`;
    selectVariables = "createdDate, total, supplyCost, tip, couponCode";
  } 
  //Ovde approved
  else if(dataType === "get_order_cash_info_only_fulfilled_orders"){
    table = "orders";
    queryCondition=`packageStatus != 0`;
    selectVariables = "createdDate, total, supplyCost, tip, couponCode";
    
  } 

  else if (dataType === "get_unfulfilled_orders"){
    table = `orders JOIN customers ON orders.customer_id = customers.id`;
    queryCondition= `approved = 1 AND packageStatus = 0 ORDER BY orders.createdDate DESC`;
    selectVariables = `orders.*, customers.email`;
  }
  
  else if (dataType === "get_unapproved_orders"){
    table =  `orders JOIN customers ON orders.customer_id = customers.id`;
    queryCondition=  `approved = 0 ORDER BY orders.createdDate DESC`;
    selectVariables = `orders.*, customers.email`;
  }
  

  else if (dataType === "get_ordered_orders"){
    table =  `orders JOIN customers ON orders.customer_id = customers.id`;
    queryCondition=   `packageStatus = 1 ORDER BY orders.createdDate DESC`;
    selectVariables = `orders.*, customers.email`;
  }
  


  else if (dataType === "get_completed_orders"){
    table =  `orders JOIN customers ON orders.customer_id = customers.id`
    queryCondition=   `packageStatus = 2 ORDER BY orders.createdDate DESC`;
    selectVariables = `orders.*, customers.email`;
  }
  

  else if (dataType === "get_canceled_orders"){
    table =  `orders JOIN customers ON orders.customer_id = customers.id`
    queryCondition=  `packageStatus = 3 ORDER BY orders.createdDate DESC`;
    selectVariables = `orders.*, customers.email`;
  }
  


  else if (dataType === "get_returned_orders"){
    table = `orders JOIN customers ON orders.customer_id = customers.id`
    queryCondition=  `packageStatus = 4 ORDER BY orders.createdDate DESC`;
    selectVariables = `orders.*, customers.email`;
  }
  

  

  else if(dataType === "get_orders_by_email"){
    table = `orders JOIN customers ON orders.customer_id = customers.id`
    queryCondition=  `email = '${data.email}'`;
    selectVariables = `orders.*, customers.email`;
  }
  
  
  
  else if(dataType ==="get_order_by_orderId"){

    table = `orders JOIN customers ON orders.customer_id = customers.id`
    queryCondition=  `orders.id = '${data.orderId}'`;
    selectVariables = `orders.*, customers.email`;

  }
  
  else if (dataType === "get_unanswered_messages"){
    
    table = "messages JOIN customers ON messages.customer_id = customers.id"
    queryCondition=  `msgStatus = 0`;
    selectVariables = `messages.*, customers.email, customers.totalOrderCount`;

  }
  
  else if (dataType === "get_answered_messages"){

    table =  "messages JOIN customers ON messages.customer_id = customers.id"
    queryCondition= `msgStatus != 0`;
    selectVariables = `messages.*, customers.email, customers.totalOrderCount`;

  }
  
  else if (dataType === "get_reviews"){

    table = "reviews"
    queryCondition= `product_id = ${data.product_id}`;
    selectVariables = `id, name, text, stars, imageNames, product_id`;

  }
  
  
 
  else if (dataType === "get_customers"){

    table = "customers"
    queryCondition= 'subscribed = 1';
    selectVariables = `*`;

  }
  
  else if(dataType === "get_customers_bh"){

    table = "customers"
    queryCondition= 'subscribed = 0';
    selectVariables = `*`;

  }
  
  else if(dataType === "get_email_templates"){

    table = "email_templates"
    queryCondition= 'true';
    selectVariables = `*`;

    
  }
    else if (dataType === "get_emails"){
      table = "emails"
      queryCondition= 'true';
      selectVariables = `*`;
    }
    
    else if (dataType === "get_email_sequences"){
      table = "email_sequences"
      queryCondition= 'true';
      selectVariables = `*`;
    }
    
    else if (dataType === "get_email_campaigns"){
      table = "email_campaigns"
      queryCondition= 'true';
      selectVariables = `*`;
    }
    

    else if(dataType === "get_product_description"){

    

    }
    
  else if(dataType === "get_product_returns"){

      table = "product_returns"
      queryCondition= `true`;
      selectVariables = `*`;

  }
  
  return {table, queryCondition, selectVariables};





  };


  
module.exports = obtainGetDbQueryParams;

