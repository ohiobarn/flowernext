import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import Link from "next/link";
import OrderHeader from "../../comps/OrderHeader.js"
import OrderSummary from "../../comps/OrderSummary.js"
import React, { useState, useEffect, useRef} from "react";
import {getOrder,setStateFromStatus, isContentLocked,getOrderSummary,getOrderStatusDesc} from "../../utils/OrderUtils.js"

/////////////////////////////////////////////////////////////////////////////////
// getServerSideProps
/////////////////////////////////////////////////////////////////////////////////
export const getServerSideProps = withPageAuthRequired({
  resizeTo: "/",
  async getServerSideProps( context ) {
    // Get user from cookie
    let res = {}; // Don't use actual res object, it cause spam in logs
    const { user } = getSession(context.req, res);

    // Get RecID
    const orderRecID = context.query.orderRecID;

    // Fetch data from AirTable
    const order = await getOrder(user.email, orderRecID);

    let myProps = {}
    myProps.order = order;
    myProps.user = user;

    // console.log(myProps)

    // Pass order to the page via props
    return { props: { myProps } };
  }
});


/////////////////////////////////////////////////////////////////////////////////
// Delete Order
/////////////////////////////////////////////////////////////////////////////////
const deleteOrder = async (pOrder) => {
  var answer = confirm("\nWARNING!\nAre you sure you want to delete this order?");
  if (!answer) {
    // Dont delete
    return;
  }
  
  // Yes continue
  const rec = {
    orderRecIDs: [pOrder.RecID],
  };
  
  // console.log("The following record will post to the order-delete API");
  // console.log(rec);
  
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


////////////////////////////////////////////////////////////////////////////
// Default
////////////////////////////////////////////////////////////////////////////
export default function Order({ myProps }) {
  // var order = myProps.order;
  let user = myProps.user;


  const [order, setOrder] = useState(myProps.order)
  const [isAdmin, setIsAdmin] = useState(false);
  const [contentLock, setContentLock] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {

    //
    // Order Total
    //
    let orderTotal = order.items.map(item => item.Extended).reduce((accum,curr) => accum+curr,0)
    setOrderTotal(orderTotal)


    //
    // Role
    //
    if (user["https://app.madriverfloralcollective.com/role"] === "Admin" ){
      setIsAdmin(true)
    } 
    else {
      setIsAdmin(false)
    }

    //
    // Update state
    //
    setContentLock(isContentLocked(order.Status))

  }, [order.Status, order.items, user]);


  
  /////////////////////////////////////////////////////////////////////////////////
  // return
  /////////////////////////////////////////////////////////////////////////////////
  return (
    <div>

      <form>
        <div className="fpPageNav fpNavAtTop">
          <Link href="/orders"><a className="fpBtn">Back</a></Link>
          {!contentLock && <button className="fpBtn" type="button" value={order.RecID} onClick={ () => deleteOrder(order)}>Delete Order</button>}
        </div>
      </form>

      <h3>Order Information</h3>
      <OrderHeader order={order} contentLock={contentLock} isAdmin={isAdmin} setOrder={setOrder}/>
      
      <h3>Order Summary</h3>
      <OrderSummary orderTotal={orderTotal} />
      
      <form>
        <div className="fpPageNav fpNavAtBottom">
          <Link href="/orders"><a className="fpBtn">Back</a></Link>
          {!contentLock && <button className="fpBtn" type="button" value={order.RecID} onClick={ () => deleteOrder(order)}>Delete Order</button>}
        </div>
      </form>


    </div>
  );
};


