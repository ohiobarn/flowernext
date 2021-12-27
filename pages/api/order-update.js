import { getSession } from "@auth0/nextjs-auth0";

export default function handler(req, res) {

  // Get user from cookie
  const { user } = getSession(req,res)
  
  // Update Order from form data
  const result = updateOrder(user.email,req.body)

  result.then(
    function(result){
      console.log("Order update successful")
      console.log(result) 
      res.status(200).json(result)
    },
    function(error) { 
      res.status(500).json(error) 
    }
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
        "Client/Job": data.clientJob,
        "Team Member": data.teamMember,
        "Due Date": data.dueDate,
        "Notes": data.notes
      }
    }
  ]

  console.log("The following record will be used to update the order.")
  console.log(rec)

  var Airtable = require("airtable")
  Airtable.configure({endpointUrl: "https://api.airtable.com",apiKey: apiKey,});
  var base = Airtable.base("apptDZu7d1mrDMIFp"); //MRFC
  const result  = await base("Order").update(rec);

  //Return a promise
  return result
}
