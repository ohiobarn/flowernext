import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import Link from "next/link"

// This gets called on every request
export async function getServerSideProps( context ) {

  // Get user from cookie
  var res = {}; // Don't use actual res object, it cause spam in logs
  const { user } = getSession(context.req,res)

  // Fetch data from AirTable
  var orders = await getOrders(user.email)

  // Pass orders to the page via props
  return { props: { orders } };
}

export default withPageAuthRequired(function Orders({ orders }) {

  //
  // Create Order Event handler
  //
  const createOrder = async event => {
    event.preventDefault() // don't redirect the page

    const res = await fetch(
      '/api/order-create',
      {
        body: JSON.stringify({"foo": "bar"}),
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

  return (
    <div>
      <h1>Orders</h1>

      <form className="fpPageNavTop" onSubmit={createOrder}>
        <span><button className="fpBtn" type="submit">New Order</button></span>
        <span><Link href="/orders/history"><a className="fpBtn">Past Orders</a></Link></span>
      </form>
 
      {orders.map(order => (
        <div key={order.RecID} className="fpOrderList">
          <Link href={'/orders/' + order.RecID} key={order.RecID}>
            <a className="fpSingle"><h3 className="fpFormTitle">{order["Client/Job"]} <span>Order#: {order.OrderNo} - {order.Status}</span></h3></a>
          </Link>
          <span>
          <Link href={'/orders/chat/' + order.RecID} key={order.RecID}><a className="fpSingle">Chat</a></Link>
          <Link href={'/orders/activity/' + order.RecID} key={order.RecID}><a className="fpSingle">Activity</a></Link>
          </span>
        </div>
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
    filterByFormula: `OR(Account = "${account}", {Managed Account} = "${account}")`,
  }).all();

  // Put resultes into an array
  var orders = []; 
  records.forEach(function (record) {
    var order = record.fields;
    orders.push(order);
  });

  return orders
}



