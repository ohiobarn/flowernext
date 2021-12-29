import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import Image from "next/image"
import styles from "../../styles/Order.module.css"

export async function getServerSideProps( context ){

  // Get user from cookie
  var res = {}; // Don't use actual res object, it cause spam in logs
  const { user } = getSession(context.req,res)
 
  // Get RecID
  const recid = context.query.recid

  // Fetch data from AirTable
  const order = await getOrder(user.email,recid)
  
  // console.log(order)

  // Pass order to the page via props
  return { props: { order } };
}

export default withPageAuthRequired(function Order({ order }) {

  //
  // Update Order Event handler
  //
  const updateOrder = async event => {
    event.preventDefault() // don't redirect the page

    const rec = {
      recid: event.target.recid.value,
      clientJob: event.target.clientJob.value,
      teamMember: event.target.teamMember.value,
      dueDate: event.target.dueDate.value,
      notes: event.target.notes.value
    }

    // console.log("The following record will post to the order-update API")
    // console.log(rec)

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

    if ( result.length > 0) {
      alert("Saved.")
    } else {
      alert("There was a problem saving your order, please try again...")
    }
    
  }

  //
  // Update OrderDetail Event handler
  //
  const updateOrderDetail = async event => {
    console.log("update order detail todo")
  }

  return (
    <div>
      <h2 className={styles.orderTitle}>{ order["Client/Job"] } <span>Order#: {order.OrderNo} - {order.Status}</span></h2>

      {/* 
      
          Order Header
      
      */}      
      <form className={styles.orderForm} onSubmit={updateOrder}>
        <h3>Header</h3>
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
          <textarea id="notes" name="notes" rows="5" cols="60" defaultValue={order.Notes}></textarea>
        </div>
        
        <button className="btn" type="submit">Save Header</button>
      </form>
      <br></br>

      {/* 
      
          Order Detail
      
      */}
      <form className={styles.orderForm} onSubmit={updateOrderDetail}>
        <h3>Items</h3>

        {order.items.map(item => { return (
          <div className={styles.card} key={item.RecID}>
            <span>
              <img src={item.Image[0].thumbnails.large.url} width="200" hight="200"/>
              <h4>{item.Crop} - {item.Variety}</h4>
            </span>
            <span>
              <div>
                <hr/>
                <label htmlFor="sku">SKU</label>
                <p id="sku">{item.SKU}</p>
              </div>                  
              <div>
                <hr/>
                <label htmlFor="color">Color</label>
                <p id="color">{item.Color}</p>
              </div>
              <div>
                <hr/>
                <label htmlFor="cost">Cost</label>
                <p id="cost">{item.Bunches} bn at {item["Price per Bunch"]}/bn = $<strong>{item["Extended"]}</strong></p>
              </div>
            </span>
            
          </div>
        )})}

    
      </form>

      {/* 
      
          Order Activity
      
      */}
      <div className={styles.orderForm}>
        <h3>Activity</h3>
        <div className={styles.field}>
          <textarea id="activity" name="activity" rows="10" cols="30" defaultValue={order.Activity} readOnly></textarea>
        </div>
      </div>

    </div>
  );
});

////////////////////////////////////////////////////////////////////////////
//          Get Order
////////////////////////////////////////////////////////////////////////////
async function getOrder(account,recid) {

  const apiKey = process.env.AIRTABLE_APIKEY
  console.log("[getOrder] Account [%s] RecordID [%s]", account,recid)

  //
  // Get order header
  //
  var Airtable = require("airtable")
  Airtable.configure({endpointUrl: "https://api.airtable.com",apiKey: apiKey,});

  var base = Airtable.base("apptDZu7d1mrDMIFp"); //MRFC
  const records = await base("Order").select({
    view: "fp-grid",
    filterByFormula: `AND( Account = "${account}", RecID = "${recid}" )`,
  }).all();

  // There should only be one order
  var order = records[0].fields

  //
  // Get Order detail
  //
  const detailRecords = await base("OrderDetail").select({
    view: "fp-grid",
    filterByFormula: `OrderRecID = "${recid}"`,
  }).all(); 

  order.items = []; 
  detailRecords.forEach(item => {
    order.items.push(item.fields)
  })

  return order
}