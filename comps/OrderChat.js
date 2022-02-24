import React, {useRef} from "react";
import Link from "next/link";
import {sendNotes} from "../utils/OrderUtils.js"

const OrderChat = ({order, setOrder, isAdmin}) => {
  
  const chatFrom =  useRef(null)

  return ( 
    <div className="fpForm">
      <p>Send MRFC special instructions, questions or comments you may have about this order</p>

      <div className="fpPageNav fpNavAtTop">
        <Link href="/orders"><a className="fpBtn">Back</a></Link>
      </div>

      <form ref={chatFrom}>

        <div className="fpFromField">
          <label htmlFor="notes">Chat History</label>
          <textarea id="notes" name="notes" rows="15" cols="80" value={order.Notes} readOnly></textarea>
        </div>

        <div className="fpTextMsgCard">
          <input id="textMsg" name="textMsg" type="text" /> 
          <button className="fpBtn" type="button" value={order.RecID} 
                  onClick={() => sendNotes(order,chatFrom,setOrder,isAdmin)}>Send
          </button>
        </div>
      
      </form>

    </div>
   );
}
 
export default OrderChat;