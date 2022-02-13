////////////////////////////////////////////////////////////////////////////
//         Tips
////////////////////////////////////////////////////////////////////////////
// export function orderStatusTip() {
//   // To use this add 'title={orderStatusTip()}' to some object
//   return "todo."
// }

////////////////////////////////////////////////////////////////////////////
//         getPickupWindow
////////////////////////////////////////////////////////////////////////////
export function findPickupWindow(date){
  // Examples:
  // dueDate is before Wednesday
  //  dueDate: Tue Feb 15 2022
  //  puStart: Wed Feb 09 2022
  //  puEnd:   Thu Feb 10 2022
  //
  // dueDate is Wednesday;
  //  dueDate: Wed Feb 16 2022
  //  puStart: Wed Feb 16 2022
  //  puEnd:   Thu Feb 17 2022 

  const dueDate = new Date(date);
  const puStart = new Date(); //Pickup Start
  const puEnd = new Date();   //Pickup End

  // Find the last Wednesday 
  // If dueDate is a Wednesday then that is the start date
  puStart.setDate(dueDate.getDate() - ((dueDate.getDay() + 4) % 7));

  // Pickup window of Wed thru Thru is just one day apart
  puEnd.setDate(puStart.getDate() + 1);

  // Return a window start and end date as strings in this timezone
  const puWindow = {};
  puWindow.start = puStart.toLocaleDateString('en-US', {timeZone: 'America/New_York'});
  puWindow.end = puEnd.toLocaleDateString('en-US', {timeZone: 'America/New_York'});

  return puWindow

}

////////////////////////////////////////////////////////////////////////////
//         isDateFarEnoughInAdvance
////////////////////////////////////////////////////////////////////////////
export function isDateFarEnoughInAdvance(date){

  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const dueDate = new Date(date);
  const today = new Date();
  const earliest = new Date();

  earliest.setDate(today.getDate() + 4);

  const diffDays = Math.round((dueDate - earliest) / oneDay);


  if (diffDays < 0) {
    return false
  } else {
    return true
  }
}

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

////////////////////////////////////////////////////////////////////////////
//          Create Order
////////////////////////////////////////////////////////////////////////////
export function getOrderStatusDesc(order) {

    switch (order.Status) {
      case "Draft":
        return "Prepare your order and when ready click submit";
      case "Submitted":
        return "MRFC will review your order and respond soon";
      case "Modification Requested":
        return "Changes to your order are required, see chat for more detail";
      case "Accepted":
        return "No action is required. MFRC will fulfill your order when the Due Date approaches";
      case "Pending":
        return "Order fulfillment is in progress, the order status will change when it is Ready for " + order["Delivery Option"];
      case "Ready":
        return "Yoru order is ready for " + order["Delivery Option"];
      case "Delivered":
        return "Delivered";
      case "Invoiced":
        return "Payment due";
      case "Paid":
        return "Thanks";
      default:
        return "Bad order status";
    }

}

////////////////////////////////////////////////////////////////////////////
//          Create Order
////////////////////////////////////////////////////////////////////////////
export function isContentLocked(orderStatus) {

  switch (orderStatus) {
    case "Draft":
      return false
    case "Submitted":
      return true;
    case "Modification Requested":
      return false
    case "Accepted":
      return true;
    case "Pending":
      return true;
    case "Ready":
      return true;
    case "Delivered":
      return true;
    case "Invoiced":
      return true;
    case "Paid":
      return true;
    default:
      return true;
  }

}
////////////////////////////////////////////////////////////////////////////
//          isOrderActive
////////////////////////////////////////////////////////////////////////////
export function isOrderActive(order) {
  
  var isActive = true
  if ( order.Status === "Paid" ){
    isActive = false
  }
  return isActive
}
////////////////////////////////////////////////////////////////////////////
//          Update OrderDetail
////////////////////////////////////////////////////////////////////////////
export async function updateOrderDetailOnBunchesChange(item, event) {

  const rec = {
    orderDetailRecID: item.RecID,
    bunches: event.target.value,
  };

  // Update extended
  var bunches = Number(event.target.value);
  var pricePerBunch = Number(item["Price per Bunch"]);
  var extended = bunches * pricePerBunch;
  
  // event.target.form.extended.value = extended;  DEVTODO need to useState

  // Update order with extended
  var index = order.items.findIndex( o => o.RecID === item.RecID)
  order.items[index].Extended = extended
  setOrder(order)

  // Update order total
  var total = order.items.map(o => Number(o.Extended)).reduce((accum,curr) => accum+curr)
  setOrderTotal(total)
  
  
  // console.log("The following record will post to the order-detail-update API")
  // console.log(rec)
  const res = await fetch("/api/order-detail-update", {
    body: JSON.stringify(rec),
    headers: {
      "Content-Type": "application/json",
    },
    method: "PATCH",
  });
  
  const result = await res.json();
  
  if (result.length > 0) {
    console.log("OrderDetail update successful, updateOrderDetailOnBunchesChange.");
  } else {
    alert("There was a problem saving your items, please try again.");
  }

}

/////////////////////////////////////////////////////////////////////////////////
// Submit Order
/////////////////////////////////////////////////////////////////////////////////
export async function submitOrder(order) {
  var answer = confirm("\nWARNING!\nAre you sure you want to submit this order?");
  if (!answer) {
    // Dont submit
    return;
  }

  //Yes continue
  const rec = {
    orderRecID: order.RecID,
    status: "Submitted",
  };
  
  // console.log("The following record will post to the order-update API")
  // console.log(rec)
  
  const res = await fetch("/api/order-update", {
    body: JSON.stringify(rec),
    headers: {
      "Content-Type": "application/json",
    },
    method: "PATCH",
  });

  const result = await res.json();

  if (result.length > 0) {
    console.log("Order submit successful.");
  } else {
    alert("There was a problem submitting your order, please try again.");
  }
  
  window.location.href = "/orders";
};
