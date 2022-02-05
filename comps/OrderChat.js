import React, {useRef} from "react";
import Link from "next/link";

const OrderChat = ({order, setOrder}) => {
  
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
    
    var notes = form.notes.value + "\n" + form.orderAccount.value + ": " + form.textMsg.value
    
    // Yes continue
    const rec = {
      orderRecID: event.target.value,
      notes: notes
    };

    console.log("The following record will post to the order-update API")
    console.log(rec)
    
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
      alert("Your notes have been sent to MRFC");
    } else {
      alert("There was a problem sending your notes, please try again.");
    }
    
    // Update state
    order.Notes =  notes
    setOrder(order)

    // DEVTODO - This work but i dont under stand why yet 
    setOrder(order => ({
      ...order,
      ["Notes"]: notes
    }));
    

  };

  return ( 
    <div className="fpForm">
      <p>Send MRFC special instructions, questions or comments you may have about this order</p>
      <div className="fpPageNav fpNavAtTop">
        <Link href="/orders"><a className="fpBtn">Done</a></Link>
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