import { withPageAuthRequired } from "@auth0/nextjs-auth0";

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from AirTable
  const orders = await getOrders()

  // Pass orders to the page via props
  return { props: { orders } };
}

export default withPageAuthRequired(function Orders({ orders }) {
  return (
    <div>
      <h1>Orders</h1>
      {orders.map((order) => (
        <div key={order.RecID}>
          <a>
            <h3>OrderNo: {order.OrderNo}</h3>
          </a>
        </div>
      ))}
    </div>
  );
});

////////////////////////////////////////////////////////////////////////////
//          Get Orders
////////////////////////////////////////////////////////////////////////////
async function getOrders() {

  var account = "tonygilkerson@gmail.com"                   //DEVTODO get from user profile
  const apiKey = process.env.AIRTABLE_APIKEY
  console.log("apikey %s", apiKey)
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



