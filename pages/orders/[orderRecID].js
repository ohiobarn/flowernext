import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import Link from "next/link";
import Image from "next/image"
import React, { useState, useEffect, useRef} from "react";
import OrderActivity from "../../comps/OrderActivity";
import OrderSummary from "../../comps/OrderSummary";
import OrderItems from "../../comps/OrderItems";
import OrderHeader from "../../comps/OrderHeader";
import {getOrder} from "../../utils/OrderUtils.js"

export async function getServerSideProps(context) {
  // Get user from cookie
  var res = {}; // Don't use actual res object, it cause spam in logs
  const { user } = getSession(context.req, res);

  // Get RecID
  const orderRecID = context.query.orderRecID;

  // Fetch data from AirTable
  const order = await getOrder(user.email, orderRecID);

  var myProps = {}
  myProps.order = order;
  myProps.user = user;

  // console.log(myProps)

  // Pass order to the page via props
  return { props: { myProps } };
}

  
////////////////////////////////////////////////////////////////////////////
// Default
////////////////////////////////////////////////////////////////////////////
export default withPageAuthRequired(function Order({ myProps }) {
  // var order = myProps.order;
  var user = myProps.user;


  const [order, setOrder] = useState(myProps.order)
  const [showManagedAccount, setShowManagedAccount] = useState(false);
  const [contentLock, setContentLock] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderStatusDesc, setOrderStatusDesc] = useState("");
  const chatFrom =  useRef(null)

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {

    //
    // Order Total
    //
    var orderTotal = order.items.map(item => item.Extended).reduce((accum,curr) => accum+curr,0)
    setOrderTotal(orderTotal)


    //
    // Role
    //
    if (user["https://app.madriverfloralcollective.com/role"] === "Admin" ){
      setShowManagedAccount(true)
    } 
    else {
      setShowManagedAccount(false)
    }

    //
    // Order Status
    //
    switch (order.Status) {
      case "Draft":
        setContentLock(false);
        setOrderStatusDesc("Draft - Prepare your order and when ready click submit.");
        break;
      case "Submitted":
        setContentLock(true);
        setOrderStatusDesc("Submitted - Your order has been submitted for review. You can expect a response soon. In the mean time you will not be able to make changes to the order.");
        break;
      case "Modification Requested":
        setContentLock(false)
        setOrderStatusDesc("Modification Requested - Modifications to your order are required before it can be accepted. Please review the chat history for more detail.");
        break;
      case "Accepted":
        setContentLock(true);
        setOrderStatusDesc("Accepted - Your order has been accepted. No action is required. When the Due Date approaches the order status will change to Pending, letting you know we have started to fulfill your order. In the mean time you will not be able to make changes to the order.");
        break;
      case "Pending":
        setContentLock(true);
        setOrderStatusDesc("Pending - Order fulfillment is in progress, the order status will change when it is Ready for " + order["Delivery Option"]);
        break;
      case "Ready":
        setContentLock(true);
        setOrderStatusDesc("Ready - The order is ready for " + order["Delivery Option"]);
        break;
      case "Delivered":
        setContentLock(true);
        setOrderStatusDesc("Delivered");
        break;
      case "Invoiced":
        setContentLock(true);
        setOrderStatusDesc("Invoiced");
        break;
      case "Paid":
        setContentLock(true);
        setOrderStatusDesc("Paid");
        break;
      default:
        setContentLock(true);
        setOrderStatusDesc("Bad order status");
    }
  }, [order.Status, order.items, user]);



  
  /////////////////////////////////////////////////////////////////////////////////
  // Update OrderDetail Event handler
  /////////////////////////////////////////////////////////////////////////////////
  const updateOrderDetailOnBunchesChange = async (item, event) => {

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
  };

  
  /////////////////////////////////////////////////////////////////////////////////
  // Delete Order
  /////////////////////////////////////////////////////////////////////////////////
  const deleteOrder = async (event) => {
    var answer = confirm("\nWARNING!\nAre you sure you want to delete this order?");
    if (!answer) {
      // Dont delete
      return;
    }
    
    // Yes continue
    const rec = {
      orderRecIDs: [event.target.value],
    };
    
    console.log("The following record will post to the order-delete API");
    console.log(rec);
    
    const res = await fetch("/api/order-delete", {
      body: JSON.stringify(rec),
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });
    
    const result = await res.json();
    
    if (result.length > 0) {
      console.log("Order delete successful.");
    } else {
      alert("There was a problem deleting your order, please try again.");
    }
    
    window.location.href = "/orders";
  };
  
  /////////////////////////////////////////////////////////////////////////////////
  // Submit Order
  /////////////////////////////////////////////////////////////////////////////////
  const submitOrder = async (event) => {
    var answer = confirm("\nWARNING!\nAre you sure you want to submit this order?");
    if (!answer) {
      // Dont submit
      return;
    }
    
    //Yes continue
    const rec = {
      orderRecID: event.target.value,
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
  // return
  /////////////////////////////////////////////////////////////////////////////////
  return (
    <div>
      <h2 className="fpFormTitle">{order["Client/Job"]}{" "} ({order.OrderNo} - {order.Status})</h2>
      <p>{orderStatusDesc}</p>
        
      <form>
        <input id="orderRecID" name="orderRecID" type="hidden" value={order.RecID} />
        <div className="fpPageNavTop">
          <div>&nbsp;</div>
          <Link href="/orders"><a className="fpBtn">Done</a></Link>
          <button className="fpBtn" type="button" value={order.RecID} onClick={submitOrder} disabled={contentLock} style={{ opacity: contentLock ? ".45" : "1" }}>
            Submit Order
          </button>
          <button className="fpBtn" type="button" value={order.RecID} onClick={deleteOrder}>
            Delete Order
          </button>
        </div>
      </form>

      <h3>Header</h3>
      <OrderHeader order={order} contentLock={contentLock} showManagedAccount={showManagedAccount} setOrder={setOrder}/>
      
      <h3>Items</h3>
      <OrderItems order={order} contentLock={contentLock} updateOrderDetailOnBunchesChange={updateOrderDetailOnBunchesChange} />

      <h3>Order Summary</h3>
      <OrderSummary orderTotal={orderTotal} />

    </div>
  );
});


