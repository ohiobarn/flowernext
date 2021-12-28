import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import styles from "../../styles/Order.module.css"

export async function getServerSideProps( context ){

  // Get user from cookie
  var res = {}; // Don't use actual res object, it cause spam in logs
  const { user } = getSession(context.req,res)
 
  // Get RecID
  const recid = context.query.recid

  // Fetch data from AirTable
  const order = await getOrder(user.email,recid)
  
  console.log(order)

  // Pass order to the page via props
  return { props: { order } };
}

export default withPageAuthRequired(function Order({ order }) {

  const updateOrder = async event => {
    event.preventDefault() // don't redirect the page

    const rec = {
      recid: event.target.recid.value,
      clientJob: event.target.clientJob.value,
      teamMember: event.target.teamMember.value,
      dueDate: event.target.dueDate.value,
      notes: event.target.notes.value
    }

    console.log("The following record will post to the order-update API")
    console.log(rec)

    const res = await fetch(
      '/api/order-update',
      {
        body: JSON.stringify(rec),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }
    )
    
    //DEVTODO - should I check for errors? how?
    const result = await res.json()
    console.log(result.length)
    if ( result.length > 0) {
      alert("Saved.")
    } else {
      alert("There was a problem saving your order, please try again...")
    }
    
  }

  return (
    <div>
      <h2 className={styles.title}>{ order["Client/Job"] } <span>Order#: {order.OrderNo} - {order.Status}</span></h2>
      <form className={styles.orderForm} onSubmit={updateOrder}>
        <input id="recid" name="recid" type="hidden" value={order.RecID} />

        <div className={styles.field}>
          <label htmlFor="clientJob">Client/Job</label>
          <input id="clientJob" name="clientJob" type="text" defaultValue={order["Client/Job"]} required/>
        </div>

        <div className={styles.field}>
          <label htmlFor="teamMember">Team Member</label>
          <input id="teamMember" name="teamMember" type="text" defaultValue={order["Team Member"]} required />
        </div>

        <div className={`${styles.field} ${styles.date}`}>
          <label htmlFor="dueDate">Due Date</label>
          <input id="dueDate" name="dueDate" type="date" defaultValue={order["Due Date"]} required />
        </div>

        <div className={styles.field}>
          <label htmlFor="notes">Notes</label>
          {/* <input id="notes" name="notes" type="text" defaultValue={order.Notes} /> */}
          <textarea id="notes" name="notes" rows="5" cols="30" defaultValue={order.Notes}></textarea>
        </div>
        
        <button className={styles.btn} type="submit">Update</button>
      </form>
    </div>
  );
});

////////////////////////////////////////////////////////////////////////////
//          Get Order
////////////////////////////////////////////////////////////////////////////
async function getOrder(account,recid) {

  const apiKey = process.env.AIRTABLE_APIKEY
  console.log("[getOrder] Account [%s] RecordID [%s]", account,recid)

  var Airtable = require("airtable")
  Airtable.configure({endpointUrl: "https://api.airtable.com",apiKey: apiKey,});

  var base = Airtable.base("apptDZu7d1mrDMIFp"); //MRFC
  const records = await base("Order").select({
    pageSize: 100, 
    view: "fp-grid",
    filterByFormula: `AND( Account = "${account}", RecID = "${recid}" )`,
  }).all();

  // Put resultes into an array
  var orders = []; 
  records.forEach(function (record) {
    var order = record.fields;
    orders.push(order);
  });

  // There should only be one order
  const order = orders[0]

  return order
}