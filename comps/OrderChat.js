import React, {useRef} from "react";
import Link from "next/link";

const OrderChat = ({order, setOrder, isAdmin}) => {
  
  const chatFrom =  useRef(null)

  /////////////////////////////////////////////////////////////////////////////////
  // Send Notes
  /////////////////////////////////////////////////////////////////////////////////
  const sendNotes = async (event) => {

    const form = chatFrom.current

    if (form.textMsg.value.length === 0) {
      //Nothing to do just return
      return;      
    }

    let account = ""
    if(isAdmin){
      account = order.Account
    } else {
      account = order["Managed Account"]
    }
    
    var notes = form.notes.value + "\n" + account + ": " + form.textMsg.value
    form.textMsg.value = ""
    
    // Yes continue
    const rec = {
      orderRecID: event.target.value,
      notes: notes
    };
    
    const res = await fetch("/api/order-update", {
      body: JSON.stringify(rec),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
    });
    
    const result = await res.json();
    
    if (result.length > 0) {
      console.log("Send notes successful.");
      console.log("Your text has been sent to MRFC");
    } else {
      console.log("There was a problem sending your text, please try again.");
    }
    
    // Update state
    order.Notes =  notes

    // Update page state
    var newOrder = {...order}
    setOrder(newOrder);
    
  };

  return ( 
    <div className="fpForm">
      <p>Send MRFC special instructions, questions or comments you may have about this order</p>
      <div className="fpPageNav fpNavAtTop">
        <Link href="/orders"><a className="fpBtn">Back</a></Link>
      </div>
      <form ref={chatFrom}>
      
        <input id="orderAccount" name="orderAccount" type="hidden" value={order.Account} />

        <div className="fpFromField">
          <label htmlFor="notes">Chat History</label>
          <textarea id="notes" name="notes" rows="15" cols="80" value={order.Notes} readOnly></textarea>
        </div>

        <div className="fpTextMsgCard">
          <input id="textMsg" name="textMsg" type="text" /> 
          <button className="fpBtn" type="button" value={order.RecID} onClick={(event) => sendNotes(event)}>Send</button>
        </div>
      
      </form>
    </div>
   );
}
 
export default OrderChat;