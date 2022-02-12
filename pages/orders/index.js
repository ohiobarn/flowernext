import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import React, { useState, useEffect} from "react";
import Link from "next/link"
import OrderList from "../../comps/OrderList";
import {createOrder, getOrders} from "../../utils/OrderUtils.js"
import {submitOrder} from "../../utils/OrderUtils.js"


////////////////////////////////////////////////////////////////////////////
// This gets called on every request
////////////////////////////////////////////////////////////////////////////
export async function getServerSideProps( context ) {

  // Get user from cookie
  var res = {}; // Don't use actual res object, it cause spam in logs
  const { user } = getSession(context.req,res)

  // Fetch data from AirTable
  var orders = await getOrders(user.email)
  var myProps = {};
  myProps.orders = orders


  // Pass orders to the page via props
  return { props: { myProps } };
}

////////////////////////////////////////////////////////////////////////////
//          withPageAuthRequired
////////////////////////////////////////////////////////////////////////////
export default withPageAuthRequired(function Orders({ myProps }) {

  const [orders, setOrders] = useState(myProps.orders)



  return (
    <div>
      <h3>Active Orders</h3>
      <p>Manage your active orders as they progress through several phases as indicated  by the <i>Order Status</i>. 
         See <Link href="https://ohiobarn.github.io/flowernext/#order/#order-status-summary"><a className="fpA" target="_blank">MRFC Doc</a></Link> for more detail.
      </p>

      <form className="fpPageNav fpNavAtTop">
        <button className="fpBtn" type="button" onClick={createOrder}>New Order</button>
      </form>

      <OrderList orders={orders} showActiveOrders="yes" submitOrder={submitOrder} /> 

    </div>
  );
});
