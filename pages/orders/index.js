import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";

// This gets called on every request
export async function getServerSideProps({ req }) {

  // Get user from cookie
  var res = {}; // Don't use actual res object, it cause spam in logs
  const { user } = getSession(req,res);

  // Fetch data from AirTable
  const orders = await getOrders(user.email)

  // Pass orders to the page via props
  return { props: { orders } };
}

export default withPageAuthRequired(function Orders({ orders }) {
  return (
    <div>
      <h1>Orders</h1>
      {orders.map((order) => (
        <div key={order.RecID}>
          <a>OrderNo: {order.OrderNo}</a>
          <p>{order.Status}</p>
        </div>
      ))}
    </div>
  );
});

////////////////////////////////////////////////////////////////////////////
//          Get Orders
////////////////////////////////////////////////////////////////////////////
async function getOrders(userEmail) {

  var account = userEmail
  const apiKey = process.env.AIRTABLE_APIKEY
  console.log("apikey [%s] account [%s]", apiKey, account)

  var Airtable = require("airtable")
  
  Airtable.configure({endpointUrl: "https://api.airtable.com",apiKey: apiKey,});

  var base = Airtable.base("apptDZu7d1mrDMIFp"); //MRFC
  const records = await base("Order").select({pageSize: 25, view: "fp-grid", filterByFormula: 'Account = "' + account + '"',}).all();

  // Put resultes into an array
  var orders = []; 
  records.forEach(function (record) {
    var order = record.fields;
    orders.push(order);
  });

  return orders
}



