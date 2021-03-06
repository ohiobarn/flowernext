import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import React, { useState, useEffect, useRef} from "react";
import Link from "next/link"
import OrderItems from "../../../comps/OrderItems.js"
import {getOrder,setStateFromStatus, isContentLocked,getOrderSummary,updateOrderDetailOnBunchesChange,getOrderStatusDesc} from "../../../utils/OrderUtils.js"

/////////////////////////////////////////////////////////////////////////////////
//    getServerSideProps
/////////////////////////////////////////////////////////////////////////////////
export const getServerSideProps = withPageAuthRequired({
  resizeTo: "/",
  async getServerSideProps( context ) {
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
});

/////////////////////////////////////////////////////////////////////////////////
// Delete Order Item
/////////////////////////////////////////////////////////////////////////////////
// DEVTODO consider moving to utils
const deleteOrderItem = async (pOrderRecID, pOrderItemRecID) => {
  var answer = confirm("\nWARNING!\nAre you sure you want to delete this item?");
  if (!answer) {
    // Dont delete
    return;
  }
  
  // Yes continue
  const rec = {
    orderItemRecIDs: [pOrderItemRecID],
  };
  
  // console.log("The following record will post to the order-delete API");
  // console.log(rec);
  
  const res = await fetch("/api/order-detail-delete", {
    body: JSON.stringify(rec),
    headers: {
      "Content-Type": "application/json",
    },
    method: "DELETE",
  });
  
  const result = await res.json();
  
  if (result.length > 0) {
    console.log("Item delete successful.");
  } else {
    alert("There was a problem deleting your item, please try again.");
  }
  
  window.location.href = "/orders/items/" + pOrderRecID;
};


/////////////////////////////////////////////////////////////////////////////////
//       withPageAuthRequired
/////////////////////////////////////////////////////////////////////////////////
export default function Chat({ myProps }) {

  const [order, setOrder] = useState(myProps.order);

  // DEVTODO is this needed?
  // Similar to componentDidMount and componentDidUpdate:
  // useEffect(() => {
  // }, [order.Status, order.items]);

  return (
    <div>
      <h2>Manage Items</h2>
      <p>Add items to your order, then adjust the <b>Bunches</b> on each.</p>
      <div className="fpHeader">
        <p><small>Due: {order["Due Date"]}</small></p>
        <h2>{order["Client/Job"]}</h2>
        <br />
        <p>{getOrderStatusDesc(order).status} ??? {getOrderSummary(order).what} ??? {getOrderSummary(order).window} ??? {getOrderSummary(order).items} ??? {getOrderSummary(order).total}</p>
      </div>
      

      <div className="fpPageNav fpNavAtTop">
        <Link href="/orders"><a className="fpBtn">Done</a></Link>
        <Link href={"/orders/varieties?orderRecID=" + order.RecID} ><a className="fpBtn"  style={{display: isContentLocked(order.Status) ?'none':'true'}}>Add Items</a></Link>
      </div>

      <OrderItems order={order} updateOrderDetailOnBunchesChange={updateOrderDetailOnBunchesChange} deleteOrderItem={deleteOrderItem} setOrder={setOrder}/>
      
      { order.items.length > 1 &&
      <div className="fpPageNav fpNavAtBottom">
        <Link href="/orders"><a className="fpBtn">Done</a></Link>
        <Link href={"/orders/varieties?orderRecID=" + order.RecID} ><a className="fpBtn"  style={{display: isContentLocked(order.Status) ?'none':'true'}}>Add Items</a></Link>
      </div>
      }
    </div>
  );

};