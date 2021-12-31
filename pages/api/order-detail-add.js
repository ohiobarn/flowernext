import { getSession } from "@auth0/nextjs-auth0";

export default function handler(req, res) {

  // Get user from cookie
  const { user } = getSession(req,res)
  
  // Update Order from form data
  const result = addOrderDetail(user.email,req.body)

  result.then( (err, records) => {
    if (err){
      console.log(err);
      res.status(500).json(err)
    } else {
      console.log("OrderDetail create successful")
      console.log(records) 
      res.status(200).json(records)      
    }
  })

}


////////////////////////////////////////////////////////////////////////////
//          Update Orders
////////////////////////////////////////////////////////////////////////////
async function addOrderDetail(account,data) {
  
  const apiKey = process.env.AIRTABLE_APIKEY
  console.log("OrderDetail create, account [%s] varieties:", account )
  console.log(data.varieties)
  console.log(data.varieties.length)

  // Build record from form data
  var rec = []
  for (var i=0; i < data.varieties.length; i++) {

    console.log("build...")
    console.log(data.varieties[i].SKU)
    var variety = {
      "fields": {
        "SKU": data.varieties[i].SKU,
        "Account": account,
        "Bunches": 0,
        "Extended": 0,
        "Crop": data.varieties[i].Crop,
        "Variety": data.varieties[i].Variety,
        "Color": data.varieties[i].Color,
        "Price per Bunch": Number(data.varieties[i]["Price per Bunch"]),
        "Stems per Bunch": Number(data.varieties[i]["Stems per Bunch"]),
        "OrderRecID": [data.varieties[i].OrderRecID],
        "Forecast (MRFC)": [data.varieties[i].ForecastRecID]
      }  
    }
    console.log("push...")
    rec.push(variety)
  }

  console.log("The following record will be used to update the order.")
  console.log(rec)

  var Airtable = require("airtable")
  Airtable.configure({endpointUrl: "https://api.airtable.com",apiKey: apiKey,});
  var base = Airtable.base("apptDZu7d1mrDMIFp"); //MRFC
  const result  = await base("OrderDetail").create(rec);

  //Return a promise
  return result
}
