import {findPickupWindow, isDateFarEnoughInAdvance} from "../utils/OrderUtils.js"
import React, { useState} from "react";

const OrderHeader = ({order, contentLock, isAdmin, setOrder}) => {
  
  const orderStatusList = ["Draft","Submitted","Modification Requested","Accepted","Pending","Ready","Delivered","Invoiced","Paid"]
  const deliveryOptions = ["Pickup","Delivery"]
  const contentLockStyle = {
    opacity: contentLock ? ".65" : "1"
  }
  const [pickupWindow, setPickupWindow] = useState(findPickupWindow(order["Due Date"]));


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
    if (event.target.deliveryOption != null) {
      rec.deliveryOption = event.target.deliveryOption.value;
    }
    if (event.target.managedAccount != null) { 
      rec.managedAccount = event.target.managedAccount.value;
    }
    if (event.target.primaryGrower != null) { 
      rec.primaryGrower = event.target.primaryGrower.value;
    }
    if (event.target.growerSplit != null) { 
      rec.growerSplit = event.target.growerSplit.value;
    }
    if (event.target.status != null) { 
      rec.status = event.target.status.value;
      // Update order and update state so orderStatusDesc is updated
      order.Status = event.target.status.value;
    }
    if (event.target.dueDate != null) {
      rec.dueDate = event.target.dueDate.value;
      if (!isDateFarEnoughInAdvance(rec.dueDate)){
        alert("Due date must be at least 5 days from now")
        return
      }
      rec.pickupStart =  pickupWindow.start;
      rec.pickupEnd =  pickupWindow.end;

    }

    // Update page state
    var newOrder = {...order}
    setOrder(newOrder);

    // console.log("The following record will post to the order-update API");
    // console.log(rec);
    const res = await fetch("/api/order-update", {
      body: JSON.stringify(rec),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
    });
    
    const result = await res.json();

    if (result.length > 0) {
      alert("Saved.");
    } else {
      alert("There was a problem saving your order, please try again.");
    }

    window.location.href = "/orders";
  };

  function handleDueDateChange(event) {
    setPickupWindow(findPickupWindow(event.target.value));
  }

  return ( 
    <div className="fpForm">
      <form onSubmit={updateOrder} >
        <input id="orderRecID" name="orderRecID" type="hidden" value={order.RecID} />
        
        <div style={contentLockStyle}>
        
          <div className="fpFromField">
            <label htmlFor="clientJob">Enter a unique name to track your order</label>
            <input id="clientJob" name="clientJob" type="text" defaultValue={order["Client/Job"]} disabled={contentLock} required />
          </div>

          <div className="fpFromField">
            <label htmlFor="teamMember">Team Member</label>
            <input id="teamMember" name="teamMember" type="text" defaultValue={order["Team Member"]} disabled={contentLock} required />
          </div>
          
          <div className="fpFromField">
            <label htmlFor="deliveryOption">Delivery Option</label>
            <select name="deliveryOption" id="deliveryOption" defaultValue={order["Delivery Option"]} disabled={contentLock}>
              {deliveryOptions.map( d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="fpFromField fpDate">
            <label htmlFor="dueDate">Due Date</label>
            <span>
            <input id="dueDate" name="dueDate" type="date" defaultValue={order["Due Date"]} disabled={contentLock} onChange={handleDueDateChange} required />
            {order["Delivery Option"]}: {pickupWindow.start} - {pickupWindow.end}
            </span>
          </div>


        </div>

        { isAdmin &&
          <div className="fpFromField">
            <label htmlFor="managedAccount">Managed Account (admin)</label>
            <input id="managedAccount" name="managedAccount" type="text" defaultValue={order["Managed Account"]}  />
          </div>
        }
        { isAdmin &&
          <div className="fpFromField">
            <label htmlFor="status">Order Status (admin)</label>
            <select name="status" id="status" defaultValue={order.Status}>
              {orderStatusList.map( s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        }
        { isAdmin &&
          <div className="fpFromField">
            <label htmlFor="primaryGrower">Primary Grower (admin)</label>
            <input id="primaryGrower" name="primaryGrower" type="text" defaultValue={order["Primary Grower"]}  />
          </div>
        }
        { isAdmin &&
          <div className="fpFromField">
            <label htmlFor="growerSplit">Grower Split (admin)</label>
            <input id="growerSplit" name="growerSplit" type="text" defaultValue={order["Grower Split"]}  />
          </div>
        }
        { (!contentLock || isAdmin) &&
        <div>
          <button className="fpBtn" type="submit" >Save</button>
        </div>
        }
      </form>
    </div>
   );
}
 
export default OrderHeader;