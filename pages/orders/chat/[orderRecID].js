import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import React, { useState} from "react";
import Link from "next/link"
import OrderChat from "../../../comps/OrderChat.js"
import {getOrder} from "../../../utils/OrderUtils.js"


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
  let user = myProps.user;
  let isAdmin = false;

  const [order, setOrder] = useState(myProps.order);
  

    //
    // Role
    //
    if (user["https://app.madriverfloralcollective.com/role"] === "Admin" ){
      isAdmin = true;
    } 
    else {
      isAdmin = false;
    }

  return (
    <div>
      <Link href={'/orders/' + order.RecID} key={order.RecID}>
        <a><h3 className="fpFormTitle">{order["Client/Job"]} <span>Order#: {order.OrderNo} - {order.Status}</span></h3></a>
      </Link>
      <OrderChat order={order} setOrder={setOrder} isAdmin={isAdmin}/>
    </div>
  );

});