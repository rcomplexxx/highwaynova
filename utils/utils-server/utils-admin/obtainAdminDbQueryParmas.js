

//orderBy createdDate DESC je samo u slucaju new orders, da bi orderovao od prvog do poslednjeg.
//Za ostale slucajeve mi je bolje da ih gledam od najnovijih ka najstarijim da bih lakse nasao ako mi treba nesto
//Ovo je podlozno promenama.
const getDataTypeConfig = {
  "get_order_cash_info": {
    table: "orders",
    queryCondition: "approved = 1",
    selectVariables: "createdDate, total, supplyCost, tip, couponCode"
  },
  //Ovde approved
  "get_order_cash_info_only_fulfilled_orders": {
    table: "orders",
    queryCondition: "packageStatus != 0",
    selectVariables: "createdDate, total, supplyCost, tip, couponCode"
  },
  "get_unfulfilled_orders": {
    table: "orders JOIN customers ON orders.customer_id = customers.id",
    queryCondition: "approved = 1 AND packageStatus = 0 ORDER BY orders.createdDate DESC",
    selectVariables: "orders.*, customers.email"
  },
  "get_unapproved_orders": {
    table: "orders JOIN customers ON orders.customer_id = customers.id",
    queryCondition: "approved = 0 ORDER BY orders.createdDate DESC",
    selectVariables: "orders.*, customers.email"
  },
  "get_ordered_orders": {
    table: "orders JOIN customers ON orders.customer_id = customers.id",
    queryCondition: "packageStatus = 1 ORDER BY orders.createdDate DESC",
    selectVariables: "orders.*, customers.email"
  },
  "get_completed_orders": {
    table: "orders JOIN customers ON orders.customer_id = customers.id",
    queryCondition: "packageStatus = 2 ORDER BY orders.createdDate DESC",
    selectVariables: "orders.*, customers.email"
  },
  "get_canceled_orders": {
    table: "orders JOIN customers ON orders.customer_id = customers.id",
    queryCondition: "packageStatus = 3 ORDER BY orders.createdDate DESC",
    selectVariables: "orders.*, customers.email"
  },
  "get_returned_orders": {
    table: "orders JOIN customers ON orders.customer_id = customers.id",
    queryCondition: "packageStatus = 4 ORDER BY orders.createdDate DESC",
    selectVariables: "orders.*, customers.email"
  },
  "get_orders_by_email": {
    table: "orders JOIN customers ON orders.customer_id = customers.id",
    queryCondition: (data) => `email = '${data.email}' ORDER BY orders.createdDate DESC`,
    selectVariables: "orders.*, customers.email"
  },
  "get_order_by_orderId": {
    table: "orders JOIN customers ON orders.customer_id = customers.id",
    queryCondition: (data) => `orders.id = '${data.orderId}' ORDER BY orders.createdDate DESC`,
    selectVariables: "orders.*, customers.email"
  },
  "get_unanswered_messages": {
    table: "messages JOIN customers ON messages.customer_id = customers.id",
    queryCondition: "msgStatus = 0",
    selectVariables: "messages.*, customers.email, customers.totalOrderCount"
  },
  "get_answered_messages": {
    table: "messages JOIN customers ON messages.customer_id = customers.id",
    queryCondition: "msgStatus != 0",
    selectVariables: "messages.*, customers.email, customers.totalOrderCount"
  },
  "get_reviews": {
    table: "reviews",
    queryCondition: (data) => `product_id = ${data.product_id}`,
    selectVariables: "id, name, text, stars, imageNames, product_id"
  },
  "get_customers": {
    table: "customers",
    queryCondition: "subscribed = 1 ORDER BY id DESC",
    selectVariables: "*"
  },
  "get_customers_bh": {
    table: "customers",
    queryCondition: "subscribed = 0 ORDER BY id DESC",
    selectVariables: "*"
  },
  "get_email_templates": {
    table: "email_templates",
    queryCondition: "true",
    selectVariables: "*"
  },
  "get_emails": {
    table: "emails",
    queryCondition: "true",
    selectVariables: "*"
  },
  "get_email_sequences": {
    table: "email_sequences",
    queryCondition: "true",
    selectVariables: "*"
  },
  "get_email_campaigns": {
    table: "email_campaigns",
    queryCondition: "true",
    selectVariables: "*"
  },
  "get_product_returns": {
    table: "product_returns",
    queryCondition: "true",
    selectVariables: "*"
  },
  "get_product_description": {
    table: "products",
    queryCondition: (data) => `productId = ${data.productId}`,
    selectVariables: `*`
  }
};

const updateDataTypeConfig = {
  
  "update_orders": "orders",
  "update_unanswered_messages": "messages",
  "update_reviews": "reviews",
  "update_new_email_template": "email_templates",
  "update_email_data": "emails",
  "update_new_product_description": "products"

}


const insertDataTypeConfig = {
  
 'insert_new_return': 'product_returns',
 'insert_new_email': 'emails',
 'insert_new_sequence': 'email_sequences',
 'insert_new_campaign': 'email_campaigns',

}

const deleteDataTypeConfig = {
  
 'delete_email_sequence': 'email_sequences',
 'delete_email': 'emails',
 'delete_product_return': 'product_returns',

}

const wipeDataTypeConfig = {
  
  'wipe_orders': 'orders',
  'wipe_messages': 'messages',
  'wipe_product_returns': 'product_returns',
  'wipe_emails': 'emails',
  'wipe_email_sequences': 'email_sequences',
  'wipe_email_campaigns': 'email_campaigns',
  'wipe_customers': 'customers',
  'wipe_reviews' : 'reviews'

}




const obtainGetDbQueryParams = (dataType, data) => {
  const config = getDataTypeConfig[dataType];

  if (!config) {
    throw new Error(`Unsupported dataType: ${dataType}`);
  }

  const queryCondition = typeof config.queryCondition === 'function'
    ? config.queryCondition(data)
    : config.queryCondition;

  return {
    table: config.table,
    queryCondition,
    selectVariables: config.selectVariables
  };
};

const obtainDbQueryParams = (dataType)=>{

  

  let table;
  
  if(dataType.startsWith('update_')) table = updateDataTypeConfig[dataType];
  else if(dataType.startsWith('insert_')) table = insertDataTypeConfig[dataType];
  else if(dataType.startsWith('delete_')) table = deleteDataTypeConfig[dataType];
  else if(dataType.startsWith('wipe_')) table = wipeDataTypeConfig[dataType];



  return table;


}




  
module.exports = {obtainGetDbQueryParams, obtainDbQueryParams};

