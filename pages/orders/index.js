import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import styles from "../../styles/Orders.module.css"
import Link from "next/link"

// This gets called on every request
export async function getServerSideProps( context ) {

  // Get user from cookie
  var res = {}; // Don't use actual res object, it cause spam in logs
  const { user } = getSession(context.req,res)

  // Fetch data from AirTable
  const orders = await getOrders(user.email)

  // Pass orders to the page via props
  return { props: { orders } };
}

export default withPageAuthRequired(function Orders({ orders }) {
  return (
    <div>
      <h1>Orders</h1>
      {orders.map(order => (
        <Link href={'/orders/' + order.RecID} key={order.RecID}>
          <a className={styles.single}>
            {/* <h3>{order["Client/Job"]}  #{order.OrderNo} - {order.Status}</h3> */}
            <h2 className={styles.orderTitle}>{ order["Client/Job"] } <span>Order#: {order.OrderNo} - {order.Status}</span></h2>
          </a>
        </Link>
      ))}
    </div>
  );
});

////////////////////////////////////////////////////////////////////////////
//          Get Orders
////////////////////////////////////////////////////////////////////////////
async function getOrders(account) {

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
    filterByFormula: `Account = "${account}"`,
  }).all();

  // Put resultes into an array
  var orders = []; 
  records.forEach(function (record) {
    var order = record.fields;
    orders.push(order);
  });

  return orders
}



