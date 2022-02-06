
////////////////////////////////////////////////////////////////////////////
//          Get Orders
////////////////////////////////////////////////////////////////////////////
export async function getOrders(account) {

  // const account = account
  const apiKey = process.env.AIRTABLE_APIKEY
  console.log("[getOrders] Account [%s]", account)

  var Airtable = require("airtable")
  
  Airtable.configure({endpointUrl: "https://api.airtable.com",apiKey: apiKey,});

  var base = Airtable.base("apptDZu7d1mrDMIFp"); //MRFC
  const records = await base("Order").select({
    pageSize: 100, 
    view: "fp-grid", 
    sort: [{field: "Client/Job", direction: "asc"}],
    filterByFormula: `OR(Account = "${account}", {Managed Account} = "${account}")`,
  }).all();

  // Put resultes into an array
  var orders = []; 
  records.forEach(function (record) {
    var order = record.fields;
    orders.push(order);
  });

  return orders
}

////////////////////////////////////////////////////////////////////////////
//          Get Order
////////////////////////////////////////////////////////////////////////////
export async function getOrder(account, orderRecID) {
  const apiKey = process.env.AIRTABLE_APIKEY;
  console.log("[getOrder] Account [%s] RecordID [%s]", account, orderRecID);

  //
  // Get order header
  //
  var Airtable = require("airtable");
  Airtable.configure({ endpointUrl: "https://api.airtable.com", apiKey: apiKey });

  var base = Airtable.base("apptDZu7d1mrDMIFp"); //MRFC
  const records = await base("Order")
    .select({
      view: "fp-grid",
      filterByFormula: `AND( OR(Account = "${account}",{Managed Account} = "${account}"), RecID = "${orderRecID}" )`,
    })
    .all();

  // There should only be one order
  var order = records[0].fields;

  //
  // Get Order detail
  //
  const detailRecords = await base("OrderDetail")
    .select({
      view: "fp-grid",
      filterByFormula: `OrderRecID = "${orderRecID}"`,
    })
    .all();

  order.items = [];
  detailRecords.forEach((item) => {
    order.items.push(item.fields);
  });

  return order;
}


////////////////////////////////////////////////////////////////////////////
//          Create Order
////////////////////////////////////////////////////////////////////////////
export async function createOrder() {

  const res = await fetch(
    '/api/order-create',
    {
      body: JSON.stringify({"foo": "bar"}), //DEVTODO remove foo
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }
  )
  

  //DEVTODO - should I check for errors? how?
  const result = await res.json()

  if ( result.length > 0) {
    console.log("Created.")
  } else {
    alert("There was a problem creating your order, please try again...")
  }
  
  window.location.href = "/orders/"+ result[0].id;
}
