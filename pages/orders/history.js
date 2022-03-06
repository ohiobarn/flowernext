import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import Link from "next/link"
import OrderList from "../../comps/OrderList";
import {getOrders} from "../../utils/OrderUtils.js"


////////////////////////////////////////////////////////////////////////////
// This gets called on every request
////////////////////////////////////////////////////////////////////////////
export const getServerSideProps = withPageAuthRequired({
  resizeTo: "/",
  async getServerSideProps( context ) {

    // Get user from cookie
    var res = {}; // Don't use actual res object, it cause spam in logs
    const { user } = getSession(context.req,res)

    // Fetch data from AirTable
    var orders = await getOrders(user.email)

    // Pass orders to the page via props
    return { props: {orders} };
  }
});


////////////////////////////////////////////////////////////////////////////
//          withPageAuthRequired
////////////////////////////////////////////////////////////////////////////
export default function Orders({ orders }) {
  return (
    <div>
      <h1>Order History</h1>

      <div className="fpPageNav fpNavAtTop">
        <Link href="/orders"><a className="fpBtn">Back</a></Link>
      </div>

      <OrderList orders={orders} showActiveOrders="no" /> 

    </div>
  );
};
