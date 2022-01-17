import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"

// This gets called on every request
export async function getServerSideProps( context ) {

  // Get RecID
  const orderRecID = context.query.orderRecID
  
  // Fetch data from AirTable
  const varieties = await getVarieties()

  const myprops  = {
    order: { RecID: orderRecID },
    varieties: varieties
  }

  // Pass props to the page via props
  return { props: { myprops } };
}


export default withPageAuthRequired(function Varieties({ myprops }) {

  const [showMe, setShowMe] = useState(true);
  function toggleCard(){
    setShowMe(!showMe);
  }

  /////////////////////////////////////////////////////////////////////////////////
  // Add Variety to Order Event handler
  /////////////////////////////////////////////////////////////////////////////////
  const addVarietiesToOrder = async event => {
    event.preventDefault() // don't redirect the page

    //
    // Add checked varieties to the array
    //
    var rec = {
      varieties: []
    }
    for (var i=0; i < event.target.variety.length; i++) {
      if (event.target.variety[i].checked) {

        var skuKey = event.target.variety[i].value + ".SKU"
        var cropKey = event.target.variety[i].value + ".Crop"
        var varietyKey = event.target.variety[i].value + ".Variety"
        var colorKey = event.target.variety[i].value + ".Color"
        var ppbKey = event.target.variety[i].value + ".Price per Bunch"
        var spbKey = event.target.variety[i].value + ".Stems per Bunch"
        var orderRecIDKey = event.target.variety[i].value + ".OrderRecID"

        var variety = {
          ForecastRecID: event.target.variety[i].value,
          SKU: event.target[skuKey].value,
          Crop: event.target[cropKey].value,
          Variety: event.target[varietyKey].value,
          Color: event.target[colorKey].value,
          "Price per Bunch": event.target[ppbKey].value,
          "Stems per Bunch": event.target[spbKey].value,
          OrderRecID: event.target[orderRecIDKey].value,
        }
        
        rec.varieties.push(variety)

      }
    }

    
    //
    // You must select at least one for this action
    //
    if (rec.varieties.length == 0) {
      alert("Please select a variety")
      return
    }  

  
    const res = await fetch(
      '/api/order-detail-add',
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
      alert("Varieties added to order.")
    } else {
      alert("There was a problem saving your order, please try again...")
    }
    
    //Go back from where you came
    history.go(-1)
  }

  /////////////////////////////////////////////////////////////////////////////////
  // Filter Cards
  /////////////////////////////////////////////////////////////////////////////////
  const filterCards = async (event) => {

    var filterText = event.target.value.toUpperCase()
    var cards = document.getElementsByClassName("fpCard");
    
    if ( filterText.length > 0) {

      //
      // show/hide cards if their is a filter
      //
      for (var i = 0; i < cards.length; i++) {
        
        var cardTitle=cards[i].title.toUpperCase()

        if (cardTitle.includes(filterText)) {
          cards[i].style.display = "";
        } else {
          cards[i].style.display = "none";
        }
      }
    } else {
      //
      // if no filter show all cards
      //
      var cards = document.getElementsByClassName("fpCard"); 
      for (var i = 0; i < cards.length; i++) {
        cards[i].style.display = "";
      }
    }
    
  }

  return (
    <div>
      <form id="varietyForm" onSubmit={addVarietiesToOrder}>
        <input type="hidden" id="orderRecID" name="orderRecID" value={myprops.order.RecID} />
        <div className="fpPageNavTop">
            <button className="fpBtn" type="submit">Add Selected</button>
            <Link href={myprops.order.RecID}><a className="fpBtn">Done</a></Link>
            <input className="searchInput" type="text" id="varietyFilter"  onKeyUp={filterCards} placeholder="Search for names.."/>
        </div>
        <div className="fpFormList">
          <div className="expandCollapse">
            <span style={{display: showMe?"none":"block"}}>
              <Image  onClick={toggleCard} src="/expand-alt-solid.svg"   layout="fixed" alt="expand" width={20} height={20}/>
            </span>
            <span style={{display: showMe?"block":"none"}}>
              <Image  onClick={toggleCard} src="/compress-alt-solid.svg" layout="fixed" alt="compress" width={20} height={20}/>
            </span>
          </div>
          {myprops.varieties.map(variety => (
            
            <div className="fpCard" key={variety.RecID} 
                title={variety.SKU + "-" + variety.Crop + "-" + variety.Variety + "-" + variety.Color}>
              <span>
                <input type="checkbox" name="variety" value={variety.RecID} />
                <input type="hidden" name={variety.RecID+".SKU"} value={variety.SKU} />
                <input type="hidden" name={variety.RecID+".Crop"} value={variety.Crop} />
                <input type="hidden" name={variety.RecID+".Variety"} value={variety.Variety} />
                <input type="hidden" name={variety.RecID+".Color"} value={variety.Color} />
                <input type="hidden" name={variety.RecID+".Price per Bunch"} value={variety["Price per Bunch"]} />
                <input type="hidden" name={variety.RecID+".Stems per Bunch"} value={variety["Stems per Bunch"]} />
                <input type="hidden" name={variety.RecID+".OrderRecID"} value={myprops.order.RecID} />
              </span>
              <span style={{display: showMe?"block":"none"}}>
                <Image src={variety.Image[0].thumbnails.large.url} layout="intrinsic" width={200} height={200} alt="thmbnail"/>
              </span>
              <span style={{display: showMe?"block":"none"}}>
                <div>
                    <hr/>
                    <label htmlFor="sku">SKU</label>
                    <p id="sku">{variety.SKU}</p>
                  </div>                  
                  <div>
                    <hr/>
                    <label htmlFor="color">Color</label>
                    <p id="color">{variety.Color}</p>
                  </div>
                  <div>
                    <hr/>
                    <label htmlFor="cost">Cost</label>
                    <p id="cost">{variety["Price per Bunch"]}</p>
                  </div> 
                  <div>
                    <hr/>
                    <label htmlFor="cost">Forecast</label>
                    <p id="forecast">{variety["This week | Next week | Future"]}</p>
                  </div>                        
              </span>
              <span>
                <h2 className="fpFormTitle">{variety.Crop} - {variety.Variety}</h2>
              </span>
            </div>
            
          ))}
        </div>
        <div className="fpPageNavBottom">
          <button className="fpBtn" type="submit">Add Selected</button>
          <Link href={myprops.order.RecID}><a className="fpBtn">Done</a></Link>
        </div>
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