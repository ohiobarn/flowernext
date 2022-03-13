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
export function getOrderSummary(order){
  

  let account = order.Account;
  if (order["Managed Account"]) {
    account = order["Managed Account"];
  }

  const summary = {}
  summary.what = `Order#: ${order.OrderNo}`;

  if (order["Team Member"]) {
    summary.who = `${order["Team Member"]}<${account}>`;
  } else {
    summary.who = "";
  }
  
  if (order["Due Date"]) {
    summary.due = `Due: ${order["Due Date"]}`;
    summary.window = `${order["Delivery Option"]} (${order["Pickup Start"]} ・ ${order["Pickup End"]})`;
  } else {
    summary.due = "";
    summary.window = "";
  }

  
  if (order.items) {

    let dollarUS = Intl.NumberFormat("en-US", {style: "currency", currency: "USD"});
    let orderTotal = order.items.map(item => item.Extended).reduce((accum,curr) => accum+curr,0);
    summary.total = `Total ${dollarUS.format(orderTotal)}`;

    let itemCount = order.items.length;
    summary.items = `${itemCount} items`

  } else {

    summary.total = "";
    summary.items = "";
  }


  return summary

}
////////////////////////////////////////////////////////////////////////////
//         getPickupWindow
////////////////////////////////////////////////////////////////////////////
export function getPickupWindow(dateString, deliveryOption){
  
  // Examples:
  // When dueDate is before Wednesday:
  //  dueDate: Tue Feb 15 2022
  //  puStart: Wed Feb 09 2022
  //  puEnd:   Thu Feb 10 2022
  //
  // When dueDate is Wednesday:
  //  dueDate: Wed Feb 16 2022
  //  puStart: Wed Feb 16 2022
  //  puEnd:   Thu Feb 17 2022 

  let puDesc = "";
  const puWindow = {};
  puWindow.desc = puDesc;

  // If no dateString then return empty window
  if (!dateString || dateString === ""){
    return puWindow;
  }

  // Default deliveryOption to pickup if it does not exist
  if ( !deliveryOption || deliveryOption === "") {
    deliveryOption = "Pickup"
  }

  // dateString must be a string in this format YYYY-MM-DD
  // EST time is assumed
  var dueDate
  if (typeof dateString === "string") {
    dueDate = new Date(dateString + "T12:01:00-05:00"); // Use mid day
  } else {
    console.log("Bad date " + dateString)
    throw 'dateString must be a string in this format YYYY-MM-DD!';
  }
  

  // WARN - puStart is created with dueDate and puEnd is created with puStart! 
  //        if you dont do this then only works when the date that you are adding
  //        days to happens to have the current year and month.
  //        see: https://stackoverflow.com/questions/563406/how-to-add-days-to-date
  

  // Find the last Wednesday 
  // If dueDate is a Wednesday then that is the start date
  const puStart = new Date(dueDate); 
  puStart.setDate(dueDate.getDate() - ((dueDate.getDay() + 4) % 7));
  // console.log("[finPickupWindow] [puStart] ((dueDate.getDay() + 4) % 7): " + ((dueDate.getDay() + 4) % 7))

  // Pickup window of Wed thru Thru is just one day apart
  const puEnd = new Date(puStart);   //Pickup End
  puEnd.setDate(puStart.getDate() + 1);

  // Return a window start and end date as strings in EST timezone
  puWindow.start = puStart.toLocaleDateString('en-US', {timeZone: 'America/New_York'});
  puWindow.end = puEnd.toLocaleDateString('en-US', {timeZone: 'America/New_York'});
  puWindow.due = dueDate.toLocaleDateString('en-US', {timeZone: 'America/New_York'});

  let isInWindow = false
  if ( dueDate >= puStart && dueDate <= puEnd){
    isInWindow = true;
  } 

  //
  // Format pickup window desc
  //
  puDesc = `Pickup: (${puWindow.start} - ${puWindow.end})`;
  if (deliveryOption === "Delivery") {
    if (isInWindow) {
      puDesc = `Delivery on: ${puWindow.due}`;
    } else {
      puDesc = `Delivery: (${puWindow.start} - ${puWindow.end})`;
    }
  }
  puWindow.desc = puDesc;

  // console.log("[finPickupWindow] dateString: " + dateString)
  // console.log("[finPickupWindow] dueDate: " + dueDate)
  // console.log("[finPickupWindow] puStart: " + puStart)
  // console.log("[finPickupWindow] puEnd: " + puEnd)
  // console.log(puWindow)

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

  let Airtable = require("airtable")
  
  Airtable.configure({endpointUrl: "https://api.airtable.com",apiKey: apiKey,});

  let base = Airtable.base("apptDZu7d1mrDMIFp"); //MRFC
  const records = await base("Order").select({
    pageSize: 100, 
    view: "fp-grid", 
    sort: [{field: "Due Date", direction: "asc"}],
    filterByFormula: `OR(Account = "${account}", {Managed Account} = "${account}")`,
  }).all();

  // Get order detail
  let orders = []; 
  for (let i = 0; i < records.length; i++){
    let order = records[i].fields;
    order = await getOrderDetailByRecId(order);
    orders.push(order);
  }

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
  let Airtable = require("airtable");
  Airtable.configure({ endpointUrl: "https://api.airtable.com", apiKey: apiKey });

  let base = Airtable.base("apptDZu7d1mrDMIFp"); //MRFC
  const records = await base("Order")
    .select({
      view: "fp-grid",
      filterByFormula: `AND( OR(Account = "${account}",{Managed Account} = "${account}"), RecID = "${orderRecID}" )`,
    })
    .all();

  // There should only be one order
  let order = records[0].fields;

  // Get order detail
  order = await getOrderDetailByRecId(order);

  return order;
}

////////////////////////////////////////////////////////////////////////////
//          Get Order Detail by RecID
////////////////////////////////////////////////////////////////////////////
async function getOrderDetailByRecId(order) {

  let Airtable = require("airtable");
  let base = Airtable.base("apptDZu7d1mrDMIFp"); //MRFC
  const detailRecords = await base("OrderDetail")
  .select({
    view: "fp-grid",
    filterByFormula: `OrderRecID = "${order.RecID}"`,
  }).all();

  order.items = [];
  detailRecords.forEach((item) => {
    order.items.push(item.fields);
  });

  return order
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

    let statusObj = {};

    switch (order.Status) {
      case "Draft":
        statusObj.status = "📝 Draft";
        statusObj.desc = "Edit items and when ready click submit";
        break;
      case "Submitted":
        statusObj.status = "🎉 Submitted";
        statusObj.desc = "MRFC will review your order and respond soon";
        break;
      case "Modification Requested":
        statusObj.status = "⚠️ Modification Requested";
        statusObj.desc = "Changes to your order are required, see chat for more detail";
        break;
      case "Accepted":
        statusObj.status = "👍🏻 Accepted";
        statusObj.desc = "No action is required. MFRC will fulfill your order when the Due Date approaches";
        break;
      case "Pending":
        statusObj.status = "⌛️ Pending";
        statusObj.desc = "Order fulfillment is in progress, the order status will change when it is Ready for " + order["Delivery Option"];
        break;
      case "Ready":
        statusObj.status = "💐 Ready";
        statusObj.desc = "Your order is ready for " + order["Delivery Option"];
        break;
      case "Delivered":
        statusObj.status = "🚐 Delivered";
        statusObj.desc = "Delivered";
        break;
      case "Invoiced":
        statusObj.status = "📬 Invoiced";
        statusObj.desc = "Payment due";
        break;
      case "Paid":
        statusObj.status = "✅ Paid";
        statusObj.desc = "Thanks";
        break;
      default:
        statusObj.status = "✗ Bad";
        statusObj.desc = "Bad order status";
    }

    return statusObj

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
  export async function updateOrderDetailOnBunchesChange(order,item, setOrder,event) {

    const rec = {
      orderDetailRecID: item.RecID,
      bunches: event.target.value,
    };

    // Update extended
    let bunches = Number(event.target.value);
    let pricePerBunch = Number(item["Price per Bunch"]);
    let extended = bunches * pricePerBunch;
    
    // event.target.form.extended.value = extended;  DEVTODO need to useState

    // Update order with extended
    let index = order.items.findIndex( o => o.RecID === item.RecID)
    order.items[index].Extended = extended

    // Update page state
    let newOrder = {...order}
    setOrder(newOrder);
    
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

/////////////////////////////////////////////////////////////////////////////////
// Send Notes
/////////////////////////////////////////////////////////////////////////////////
export async function sendNotes(order,chatFrom,setOrder,isAdmin) {

  const form = chatFrom.current

  if (form.textMsg.value.length === 0) {
    //Nothing to do just return
    return;      
  }

  let account = ""
  if(isAdmin){
    account = order.Account
  } else {
    account = order["Managed Account"]
  }
  
  var notes = form.notes.value + "\n" + account + ": " + form.textMsg.value
  form.textMsg.value = ""
  
  // Yes continue
  const rec = {
    orderRecID: order.RecID,
    notes: notes
  };
  
  const res = await fetch("/api/order-update", {
    body: JSON.stringify(rec),
    headers: {
      "Content-Type": "application/json",
    },
    method: "PATCH",
  });
  
  const result = await res.json();
  
  if (result.length > 0) {
    console.log("Send notes successful.");
    console.log("Your text has been sent to MRFC");
  } else {
    console.log("There was a problem sending your text, please try again.");
  }
  
  // Update state
  order.Notes =  notes

  // Update page state
  var newOrder = {...order}
  setOrder(newOrder);
  
};

////////////////////////////////////////////////////////////////////////////
//          Get varieties
////////////////////////////////////////////////////////////////////////////
export async function getVarieties() {

  const apiKey = process.env.AIRTABLE_APIKEY
  let Airtable = require("airtable")
  
  Airtable.configure({endpointUrl: "https://api.airtable.com",apiKey: apiKey,});

  let base = Airtable.base("apptDZu7d1mrDMIFp"); //MRFC
  const records = await base("Forecast (MRFC)").select({
    pageSize: 100, 
    view: "fp-grid", 
    sort: [{field: "Crop"},{field: "Variety"}],
  }).all();

  // Put resultes into an array
  let varieties = []; 
  records.forEach(function (record) {
    let variety = record.fields;
    varieties.push(variety);
  });


  return varieties
}