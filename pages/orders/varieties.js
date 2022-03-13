import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import {getVarieties} from "../../utils/OrderUtils.js"

// This gets called on every request
export const getServerSideProps = withPageAuthRequired({
  resizeTo: "/",
  async getServerSideProps( context ) {

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
});


export default function Varieties({ myprops }) {

  //
  // Create a variety map from the arry given in props
  ///
  let varieties = new Map();
  myprops.varieties.forEach(function (variety) {
    varieties.set(variety.RecID,variety)
  });

  const [showMe, setShowMe] = useState(false);
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
    for (let i=0; i < event.target.variety.length; i++) {
      if (event.target.variety[i].checked) {
        //
        // get variety record from Map by RecID
        //
        let varietyRecord = varieties.get(event.target.variety[i].value)

        let variety = {
          //ForecastRecID: event.target.variety[i].value,
          SKU: varietyRecord.SKU,
          Crop: varietyRecord.Crop,
          Variety: varietyRecord.Variety,
          Color: varietyRecord.Color,
          "Price per Bunch": varietyRecord["Price per Bunch"],
          "Stems per Bunch": varietyRecord["Stems per Bunch"],
          Image: varietyRecord.Image,
          OrderRecID: event.target.orderRecID.value,
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
      // alert("Varieties added to order.")
      console.log("Item added to order")
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

  //DEVTODO - make this a component
  return (
    <div>
      <form id="varietyForm" onSubmit={addVarietiesToOrder}>
        <input type="hidden" id="orderRecID" name="orderRecID" value={myprops.order.RecID} />
        <div className="fpPageNav fpNavAtTop">
          <div>&nbsp;</div>
          <Link href={'/orders/items/' + myprops.order.RecID}><a className="fpBtn">Back</a></Link>
          <button className="fpBtn" type="submit">Add Selected</button>
          <input className="searchInput" type="text" id="varietyFilter"  onKeyUp={filterCards} placeholder="Search for names.."/>
        </div>
        <div className="fpFormList">
          <div className="expandCollapse">
            <span style={{display: showMe?"none":"block"}}>
              <Image  onClick={toggleCard} src="/expand-alt-solid.svg"   layout="fixed" alt="expand" width={20} height={20} />
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
                <h3 className="fpFormTitle">{variety.Crop} - {variety.Variety}</h3>
              </span>
            </div>
            
          ))}
        </div>
        <div className="fpPageNav fpPageNavBottom">
          <Link href={'/orders/items/' + myprops.order.RecID}><a className="fpBtn">Back</a></Link>
          <button className="fpBtn" type="submit">Add Selected</button>
        </div>
      </form>
    </div>
  );
};

