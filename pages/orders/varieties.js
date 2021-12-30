import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import styles from "../../styles/Order.module.css"
import Link from "next/link"

// This gets called on every request
export async function getServerSideProps( context ) {

  // Fetch data from AirTable
  const varieties = await getVarieties()

   // Pass orders to the page via props
  return { props: { varieties } };
}


export default withPageAuthRequired(function Varieties({ varieties }) {
  //
  // Add Variety to Order Event handler
  //
  const addVarietiesToOrder = async event => {
    event.preventDefault() // don't redirect the page

    //DEVTODO - change this section

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


  return (
    <div>
      <h1>Varieties</h1>
      <form className={styles.orderForm} onSubmit={addVarietiesToOrder}>
        {varieties.map(variety => (
          <div className={styles.card} key={variety.SKU}>
            {/* <img src={variety.Image[0].thumbnails.large.url} width="200" hight="200"/> */}
            <h2 className={styles.orderTitle}>{variety.Crop} - {variety.Variety}</h2>
            <p className={styles.orderSubTitle}>{variety.SKU}</p>
              <div className={styles.field}>
                <label htmlFor="test">test</label>
                <input id="test" name="test" type="text" defaultValue="test" required/>
              </div>
          </div>
        ))}
      </form>
    </div>
  );
});

////////////////////////////////////////////////////////////////////////////
//          Get varieties
////////////////////////////////////////////////////////////////////////////
async function getVarieties() {

  const apiKey = process.env.AIRTABLE_APIKEY
  var Airtable = require("airtable")
  
  Airtable.configure({endpointUrl: "https://api.airtable.com",apiKey: apiKey,});

  var base = Airtable.base("apptDZu7d1mrDMIFp"); //MRFC
  const records = await base("Forecast (MRFC)").select({
    pageSize: 100, 
    view: "fp-grid", 
    sort: [{field: "Crop"},{field: "Variety"}],
  }).all();

  // Put resultes into an array
  var varieties = []; 
  records.forEach(function (record) {
    var variety = record.fields;
    varieties.push(variety);
  });

  return varieties
}