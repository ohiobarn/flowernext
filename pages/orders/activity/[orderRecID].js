import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import React, { useState} from "react";
import Link from "next/link"
import OrderActivity from "../../../comps/OrderActivity.js"
import {getOrder,getOrderStatusDesc,getOrderSummary} from "../../../utils/OrderUtils.js"


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

export default function Chat({ myProps }) {

  const [order, setOrder] = useState(myProps.order);

  return (
    <div>
      <div className="fpHeader">
        <p><small>Due: {order["Due Date"]}</small></p>
        <h2>{order["Client/Job"]}</h2>
        <br />
        <p>{getOrderStatusDesc(order).status} ・ {getOrderSummary(order).what} ・ {getOrderSummary(order).window} ・ {getOrderSummary(order).items} ・ {getOrderSummary(order).total}</p>
      </div>
      <OrderActivity order={order} setOrder={setOrder} />
    </div>
  );

};