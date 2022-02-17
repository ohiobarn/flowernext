import { getSession } from "@auth0/nextjs-auth0";

export default function handler(req, res) {

  // Get user from cookie
  const { user } = getSession(req,res)
  
  // Update Order from form data
  const result = updateOrderDetail(user.email,req.body)
 
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
//          Update OrderDetail
////////////////////////////////////////////////////////////////////////////
async function updateOrderDetail(account,data) {
  const apiKey = process.env.AIRTABLE_APIKEY
  console.log("Update OrderDetail, account [%s] record id [%s]", account, data.orderDetailRecID )

  // Build record from form data
  const rec = 
  [
    {
      "id": data.orderDetailRecID,
      "fields": {
        "Bunches": Number(data.bunches)
      }
    }
  ]

  // console.log("The following record will be used to update the order detail.")
  // console.log(rec)

  var Airtable = require("airtable")
  Airtable.configure({endpointUrl: "https://api.airtable.com",apiKey: apiKey,});
  var base = Airtable.base("apptDZu7d1mrDMIFp"); //MRFC
  const result = await base("OrderDetail").update(rec);

  //Return a promise
  return result
}
