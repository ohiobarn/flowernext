import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import React, { useState, useEffect, useRef} from "react";
import Link from "next/link"
import OrderItems from "../../../comps/OrderItems.js"
import {getOrder,setStateFromStatus, updateOrderDetailOnBunchesChange, isContentLocked} from "../../../utils/OrderUtils.js"


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

export default withPageAuthRequired(function Chat({ myProps }) {

  const [order, setOrder] = useState(myProps.order);
  const [orderStatusDesc, setOrderStatusDesc] = useState("");

  // DEVTODO is this needed?
  // Similar to componentDidMount and componentDidUpdate:
  // useEffect(() => {

    
  //   setStateFromStatus(order, setContentLock, setOrderStatusDesc)


  // }, [order.Status, order.items]);

  var orderTotal = order.items.map(item => item.Extended).reduce((accum,curr) => accum+curr,0)
  
  return (
    <div>
      <Link href={'/orders/' + order.RecID} key={order.RecID}>
        <a><h3 className="fpFormTitle">{order["Client/Job"]} </h3></a>
      </Link>
      <p>Order#: {order.OrderNo} ・ {order.Status} ・ {order["Team Member"]} ・ {order["Due Date"]} ・ {order["Delivery Option"]}</p>
      <p>Total: ${orderTotal}</p>

      <div className="fpPageNav fpNavAtTop">
        <Link href="/orders"><a className="fpBtn">Back</a></Link>
        <Link href={"/orders/varieties?orderRecID=" + order.RecID} ><a className="fpBtn"  style={{display: isContentLocked(order.Status) ?'none':'true'}}>Add Items</a></Link>
      </div>

      <OrderItems order={order} updateOrderDetailOnBunchesChange={updateOrderDetailOnBunchesChange} />
      
      <div className="fpPageNav fpNavAtBottom">
        <Link href="/orders"><a className="fpBtn">Back</a></Link>
        <Link href={"/orders/varieties?orderRecID=" + order.RecID} ><a className="fpBtn"  style={{display: isContentLocked(order.Status) ?'none':'true'}}>Add Items</a></Link>
      </div>
    </div>
  );

});