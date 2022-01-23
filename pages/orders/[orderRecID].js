import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import Link from "next/link";
import Image from "next/image"
import React, { useState, useEffect} from "react";


export async function getServerSideProps(context) {
  // Get user from cookie
  var res = {}; // Don't use actual res object, it cause spam in logs
  const { user } = getSession(context.req, res);

  // Get RecID
  const orderRecID = context.query.orderRecID;

  // Fetch data from AirTable
  const order = await getOrder(user.email, orderRecID);

  // console.log(order)

  // Pass order to the page via props
  return { props: { order } };
}

export default withPageAuthRequired(function Order({ order }) {
  const [contentLock, setContentLock] = useState(false);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    switch (order.Status) {
      case "Draft":
        setContentLock(false);
        break;
      case "Submitted":
        setContentLock(true);
        break;
      case "Modification Requested":
        setContentLock(false);
        break;
      case "Accepted":
        setContentLock(true);
        break;
      case "Pending":
        setContentLock(true);
        break;
      case "Ready":
        setContentLock(true);
        break;
      case "Delivered":
        setContentLock(true);
        break;
      case "Invoiced":
        setContentLock(true);
        break;
      case "Paid":
        setContentLock(true);
        break;
      default:
        setContentLock(true);
    }
  }, [order.Status]);

  // compute the order total
  order = computeOrderTotal(order)

  /////////////////////////////////////////////////////////////////////////////////
  // Update Order Event handler
  /////////////////////////////////////////////////////////////////////////////////
  const updateOrder = async (event) => {
    event.preventDefault(); // don't redirect the page

    const rec = {
      orderRecID: event.target.orderRecID.value,
    };
    //
    // Add fields
    //
    if (event.target.clientJob != null) {
      rec.clientJob = event.target.clientJob.value;
    }
    if (event.target.teamMember != null) {
      rec.teamMember = event.target.teamMember.value;
    }
    if (event.target.dueDate != null) {
      rec.dueDate = event.target.dueDate.value;
    }


    console.log("The following record will post to the order-update API");
    console.log(rec);
    const res = await fetch("/api/order-update", {
      body: JSON.stringify(rec),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
    });

    //DEVTODO - should I check for errors? how?
    const result = await res.json();

    if (result.length > 0) {
      alert("Saved.");
    } else {
      alert("There was a problem saving your order, please try again...");
    }
  };

  /////////////////////////////////////////////////////////////////////////////////
  // Update OrderDetail Event handler
  /////////////////////////////////////////////////////////////////////////////////
  const updateOrderDetailOnBunchesChange = async (event) => {
    const rec = {
      orderDetailRecID: event.target.form.orderDetailRecID.value,
      bunches: event.target.value,
    };

    // Update extended
    var bunches = Number(event.target.value);
    var pricePerBunch = Number(event.target.form.pricePerBunch.value);
    var extended = bunches * pricePerBunch;
    event.target.form.extended.value = extended;

    // Update order total 
    var extendedPricesColl = document.getElementsByName("extended")
    var extendedPricesArr = Array.prototype.slice.call( extendedPricesColl, 0 );
    var total = extendedPricesArr.map(p => Number(p.value)).reduce((accum,curr) => accum+curr)
    var orderTotal = document.getElementById("orderTotal");
    orderTotal.value = total


    // console.log("The following record will post to the order-detail-update API")
    // console.log(rec)
    const res = await fetch("/api/order-detail-update", {
      body: JSON.stringify(rec),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
    });

    //DEVTODO - should I check for errors? how?
    const result = await res.json();

    if (result.length > 0) {
      console.log("OrderDetail update successful, updateOrderDetailOnBunchesChange.");
    } else {
      alert("There was a problem saving your items, please try again...");
    }
  };

  /////////////////////////////////////////////////////////////////////////////////
  // Delete Order
  /////////////////////////////////////////////////////////////////////////////////
  const deleteOrder = async (event) => {
    var answer = confirm("\nWARNING!\nAre you sure you want to delete this order?");
    if (!answer) {
      // Dont delete
      return;
    }

    // Yes continue
    const rec = {
      orderRecIDs: [event.target.value],
    };

    console.log("The following record will post to the order-delete API");
    console.log(rec);

    const res = await fetch("/api/order-delete", {
      body: JSON.stringify(rec),
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });

    //DEVTODO - should I check for errors? how?
    const result = await res.json();

    if (result.length > 0) {
      console.log("Order delete successful.");
    } else {
      alert("There was a problem deleting your order, please try again...");
    }

    window.location.href = "/orders";
  };

  /////////////////////////////////////////////////////////////////////////////////
  // Submit Order
  /////////////////////////////////////////////////////////////////////////////////
  const submitOrder = async (event) => {
    var answer = confirm("\nWARNING!\nAre you sure you want to submit this order?");
    if (!answer) {
      // Dont submit
      return;
    }

    //Yes continue
    const rec = {
      orderRecID: event.target.value,
      status: "Submitted",
    };

    // console.log("The following record will post to the order-update API")
    // console.log(rec)

    const res = await fetch("/api/order-update", {
      body: JSON.stringify(rec),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
    });

    //DEVTODO - should I check for errors? how?
    const result = await res.json();

    if (result.length > 0) {
      console.log("Order submit successful.");
    } else {
      alert("There was a problem submitting your order, please try again...");
    }

    window.location.href = "/orders";
  };

  /////////////////////////////////////////////////////////////////////////////////
  // Send Notes
  /////////////////////////////////////////////////////////////////////////////////
  const sendNotes = async (event) => {
    
    if (!event.target.form.textMsg.value) {
      alert("Text is empty. Please enter a text message.");
      return;      
    }

    var answer = confirm("\nWARNING!\nAre you sure you want to send a text to MRFC?");
    if (!answer) {
      // Dont submit
      return;
    }

    var notes=event.target.form.notes.value + "\n" +  event.target.form.orderAccount.value + ": " + event.target.form.textMsg.value

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

    //DEVTODO - should I check for errors? how?
    const result = await res.json();

    if (result.length > 0) {
      console.log("Send notes successful.");
      alert("Your notes have been sent to MRFC");
    } else {
      alert("There was a problem sending your notes, please try again...");
    }

    window.location.href = "/orders";
  };

  /////////////////////////////////////////////////////////////////////////////////
  // return
  /////////////////////////////////////////////////////////////////////////////////
  return (
    <div>
      <h2 className="fpFormTitle">{order["Client/Job"]}{" "}</h2>
      <p>
        <i>Order#: {order.OrderNo} ({order.Status})</i> -&nbsp;
        {(() => {
          switch (order.Status) {
            case "Draft":
              return "Prepare your order and when ready click submit.";
            case "Submitted":
              return "Your order has been submitted for review. you can expect a response soon. In the mean time you will not be able to make changes to the order.";
            case "Modification Requested":
              return "Modifications to your order are required before it can be accepted. Please review the chat history for more detail."
            default:
              return "TODO";
          }
        })()}
      </p>
      
      <form>
        <input id="orderRecID" name="orderRecID" type="hidden" value={order.RecID} />
        <div className="fpPageNavTop">
          <Link href="/orders"><a className="fpBtn">Done</a></Link>
          <button className="fpBtn" type="button" value={order.RecID} onClick={submitOrder} disabled={contentLock} style={{ opacity: contentLock ? ".45" : "1" }}>
            Submit Order
          </button>
          <button className="fpBtn" type="button" value={order.RecID} onClick={deleteOrder}>
            Delete Order
          </button>
        </div>
      </form>

      {/* 
      
          Order Header
      
      */}
      <h3>Header</h3>
      <div className="fpForm">
        <form onSubmit={updateOrder} style={{ opacity: contentLock ? ".45" : "1" }}>
          <input id="orderRecID" name="orderRecID" type="hidden" value={order.RecID} />

          <div className="fpFromField">
            <label htmlFor="clientJob">Client/Job</label>
            <input id="clientJob" name="clientJob" type="text" defaultValue={order["Client/Job"]} disabled={contentLock} required />
          </div>

          <div className="fpFromField">
            <label htmlFor="teamMember">Team Member</label>
            <input id="teamMember" name="teamMember" type="text" defaultValue={order["Team Member"]} disabled={contentLock} required />
          </div>

          <div className="fpFromField fpDate">
            <label htmlFor="dueDate">Due Date</label>
            <input id="dueDate" name="dueDate" type="date" defaultValue={order["Due Date"]} disabled={contentLock} required />
          </div>

          <div className="fpPageNavBottom">
            <button className="fpBtn" type="submit" disabled={contentLock} >
              Save Header
            </button>
          </div>
        </form>
      </div>
    
      {/* 
      
          Chat
      
      */}
      <h3>Chat</h3>
      <div className="fpForm">
        <form>
          <input id="orderAccount" name="orderAccount" type="hidden" value={order.Account} />
          <div>
            <div className="fpFromField">
              <label htmlFor="notes">Chat History</label>
              <textarea id="notes" name="notes" rows="15" cols="80" defaultValue={order.Notes} readOnly></textarea>
            </div>
            <div className="fpTextMsgCard">
              <input id="textMsg" name="textMsg" type="text" 
                placeholder="Send MRFC special instructions, questions or comments you may have about this order" /> 
              <button className="fpBtn" type="button" value={order.RecID} onClick={sendNotes}>Send</button>
            </div>
          </div>
        </form>
      </div>

      {/* 
      
          Items
      
      */}

      <h3>Items</h3>

      <div className="fpForm">
        <div className="fpBar" style={{display: contentLock?'none':'true'}} >
          <Link href={"varieties?orderRecID=" + order.RecID} >Add Items</Link>
        </div>

        <div id="items">
        {order.items.map((item) => { 
          return (
            <form key={item.RecID} style={{ opacity: contentLock ? ".45" : "1" }}>
              <div className="fpCard">
                {/* 
                  Hidden order detail from fields
                */}
                <input name="orderDetailRecID" type="hidden" defaultValue={item.RecID} />
                <input name="pricePerBunch" type="hidden" defaultValue={item["Price per Bunch"]} />
                <Image src={item.Image[0].thumbnails.large.url} layout="intrinsic" width={200} height={200} alt="thmbnail"/>
                <span>
                  <div>
                    <hr />
                    <label htmlFor="sku">SKU</label>
                    <p id="sku">{item.SKU}</p>
                  </div>
                  <div>
                    <hr />
                    <label htmlFor="color">Color</label>
                    <p id="color">{item.Color}</p>
                  </div>
                  <div>
                    <hr />
                    <label htmlFor="bunches">Bunches</label>
                    <p><input id="bunches" name="bunches" type="number" defaultValue={item.Bunches} min="0" max="99" onChange={updateOrderDetailOnBunchesChange} disabled={contentLock}/> at ${item["Price per Bunch"]}/bn</p>
                  </div>
                  <div>
                    <hr />
                    <label htmlFor="extended">Extended</label>
                    <p>$<input className="fpInputReadOnly" id="extended" name="extended" type="number" defaultValue={item["Extended"]} min="0" max="999" readOnly /></p>
                  </div>
                </span>
                <span>
                  <h4>
                    {item.Crop} - {item.Variety}
                  </h4>
                </span>
              </div>
            </form>
          );
        })}
        </div>

        <div className="fpBar" style={{display: contentLock?'none':'true'}}>
          <Link href={"varieties?orderRecID=" + order.RecID}>Add Items</Link>
        </div>
      </div>

      {/* 
      
         Order Summary
      
      */}
      <h3>Order Summary</h3>
      <div className="fpForm">
        <div className="fpFromField">
          {/* <p>Order total: $<span id="orderTotal">{order.total}</span></p> */}
          <p>Order total: $<input className="fpInputReadOnly" id="orderTotal" name="orderTotal" type="number" defaultValue={order.total} min="0" max="999" readOnly /></p>
        </div>
      </div>

      {/* 
      
         Activity
      
      */}
      <h3>Activity</h3>
      <div className="fpForm">
        <div className="fpFromField">
          <textarea id="activity" name="activity" rows="10" cols="30" defaultValue={order.Activity} readOnly></textarea>
        </div>
      </div>
    </div>
  );
});

////////////////////////////////////////////////////////////////////////////
//          Get Order
////////////////////////////////////////////////////////////////////////////
async function getOrder(account, orderRecID) {
  const apiKey = process.env.AIRTABLE_APIKEY;
  console.log("[getOrder] Account [%s] RecordID [%s]", account, orderRecID);

  //
  // Get order header
  //
  var Airtable = require("airtable");
  Airtable.configure({ endpointUrl: "https://api.airtable.com", apiKey: apiKey });

  var base = Airtable.base("apptDZu7d1mrDMIFp"); //MRFC
  const records = await base("Order")
    .select({
      view: "fp-grid",
      filterByFormula: `AND( Account = "${account}", RecID = "${orderRecID}" )`,
    })
    .all();

  // There should only be one order
  var order = records[0].fields;

  //
  // Get Order detail
  //
  const detailRecords = await base("OrderDetail")
    .select({
      view: "fp-grid",
      filterByFormula: `OrderRecID = "${orderRecID}"`,
    })
    .all();

  order.items = [];
  detailRecords.forEach((item) => {
    order.items.push(item.fields);
  });

  return order;
}

////////////////////////////////////////////////////////////////////////////
//          Compute order total
////////////////////////////////////////////////////////////////////////////
function computeOrderTotal(order){

  var orderTotal = order.items.map(item => item.Extended).reduce((accum,curr) => accum+curr)
  order.total = orderTotal
  return order

}