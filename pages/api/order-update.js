import { getSession } from "@auth0/nextjs-auth0";

export default function handler(req, res) {

  // Get user from cookie
  const { user } = getSession(req,res)
  
  // Update Order from form data
  const result = updateOrder(user.email,req.body)

  result.then(value => {
    console.log("OrderDetail update successful") // Success!
    res.status(200).json(value) 
  }, reason => {
    console.log("OrderDetail update NOT successful") // Error!
    console.error(reason); // Error!
    res.status(500).json(reason)
  });

  return
}


////////////////////////////////////////////////////////////////////////////
//          Update Orders
////////////////////////////////////////////////////////////////////////////
async function updateOrder(account,data) {
  
  const apiKey = process.env.AIRTABLE_APIKEY
  console.log("Update order, account [%s] record id [%s]", account,data.orderRecID )

  // Build record from form data
  const rec = 
  [
    {
      "id": data.orderRecID,
      "fields": {}
    }
  ]

  // 
  // Add fields
  //
  if (data.status != null)         { rec[0].fields.Status = data.status }
  if (data.clientJob != null)      { rec[0].fields["Client/Job"] = data.clientJob }
  if (data.teamMember != null)     { rec[0].fields["Team Member"] = data.teamMember }
  if (data.dueDate != null)        { rec[0].fields["Due Date"] = data.dueDate }
  if (data.notes != null)          { rec[0].fields.Notes = data.notes }
  if (data.managedAccount != null) { rec[0].fields["Managed Account"] = data.managedAccount}

  console.log("The following record will be used to update the order.")
  console.log(rec)

  var Airtable = require("airtable")
  Airtable.configure({endpointUrl: "https://api.airtable.com",apiKey: apiKey,});
  var base = Airtable.base("apptDZu7d1mrDMIFp"); //MRFC
  const result  = await base("Order").update(rec);

  //Return a promise
  return result
}
