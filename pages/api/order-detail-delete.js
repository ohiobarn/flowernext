import { getSession } from "@auth0/nextjs-auth0";

export default function handler(req, res) {

  // Get user from cookie
  const { user } = getSession(req,res)
  
  // Update Order from form data
  const result = deleteOrderItem(user.email,req.body)

  result.then(value => {
    console.log("Item deleted successful") // Success!
    res.status(200).json(value) 
  }, reason => {
    console.log("Item deleted NOT successful") // Error!
    console.error(reason); // Error!
    res.status(500).json(reason)
  });

  return
}


////////////////////////////////////////////////////////////////////////////
//          Delete Orders
////////////////////////////////////////////////////////////////////////////
async function deleteOrderItem(account,data) {
  
  const apiKey = process.env.AIRTABLE_APIKEY
  console.log(data)
  console.log("Delete item for account [%s] record ids:", account )
  console.log(data.orderItemRecIDs)

  var Airtable = require("airtable")
  Airtable.configure({endpointUrl: "https://api.airtable.com",apiKey: apiKey,});
  var base = Airtable.base("apptDZu7d1mrDMIFp"); //MRFC
  const result  = await base("OrderDetail").destroy(data.orderItemRecIDs);

  //Return a promise
  return result
}
