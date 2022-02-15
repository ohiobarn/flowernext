import { getSession } from "@auth0/nextjs-auth0";

export default function handler(req, res) {

  // Get user from cookie
  const { user } = getSession(req,res)
  
  // Update Order from form data
  const result = createOrder(user.email,req.body)

  result.then(value => {
    console.log("Create order successful") // Success!
    res.status(200).json(value) 
  }, reason => {
    console.log("Create order NOT successful") // Error!
    console.error(reason); // Error!
    res.status(500).json(reason)
  });

  return
}


////////////////////////////////////////////////////////////////////////////
//          Create Order
////////////////////////////////////////////////////////////////////////////
async function createOrder(account,data) {
  
  const apiKey = process.env.AIRTABLE_APIKEY
  console.log("Update order, account [%s]", account)

  // Build record from form data
  const rec = [
      {
        "fields": { 
          "Account": account,
          "Status": "Draft"
        }
      }
    ]
  
  console.log("[createOrder] Create with:")
  console.log(rec)

  var Airtable = require("airtable")
  Airtable.configure({endpointUrl: "https://api.airtable.com",apiKey: apiKey,});
  var base = Airtable.base("apptDZu7d1mrDMIFp"); //MRFC
  const result  = await base("Order").create(rec);

  //Return a promise
  return result
}
