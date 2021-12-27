import { getSession } from "@auth0/nextjs-auth0";

export default function handler(req, res) {

  // Get user from cookie
  const { user } = getSession(req,res)
  
  // Update Order from form data
  const result = updateOrder(user.email,req.body)

  result.then(
    function(result){ res.status(200).json(result)},
    function(error) { res.status(500).json(error) }
  )

}


////////////////////////////////////////////////////////////////////////////
//          Get Orders
////////////////////////////////////////////////////////////////////////////
async function updateOrder(account,data) {
  
  const apiKey = process.env.AIRTABLE_APIKEY
  console.log("Update order, account [%s] record id [%s]", account,data.recid )

  // Build record from form data
  const rec = 
  [
    {
      "id": data.recid,
      "fields": {
        "Notes": data.notes
      }
    }
  ]

  // console.log(rec)

  var Airtable = require("airtable")
  Airtable.configure({endpointUrl: "https://api.airtable.com",apiKey: apiKey,});
  var base = Airtable.base("apptDZu7d1mrDMIFp"); //MRFC
  const result  = await base("Order").update(rec);

  //Return a promise
  return result
}
