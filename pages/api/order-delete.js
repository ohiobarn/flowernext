import { getSession } from "@auth0/nextjs-auth0";

export default function handler(req, res) {

  // Get user from cookie
  const { user } = getSession(req,res)
  
  // Update Order from form data
  const result = deleteOrder(user.email,req.body)

  result.then(value => {
    console.log("Order deleted successful") // Success!
    res.status(200).json(value) 
  }, reason => {
    console.log("Order deleted NOT successful") // Error!
    console.error(reason); // Error!
    res.status(500).json(reason)
  });

  return
}


////////////////////////////////////////////////////////////////////////////
//          Delete Orders
////////////////////////////////////////////////////////////////////////////
async function deleteOrder(account,data) {
  
  const apiKey = process.env.AIRTABLE_APIKEY
  console.log(data)
  console.log("Delete order for account [%s] record ids:", account )
  console.log(data.orderRecIDs)

  var Airtable = require("airtable")
  Airtable.configure({endpointUrl: "https://api.airtable.com",apiKey: apiKey,});
  var base = Airtable.base("apptDZu7d1mrDMIFp"); //MRFC
  const result  = await base("Order").destroy(data.orderRecIDs);

  //Return a promise
  return result
}
