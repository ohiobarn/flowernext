const OrderHeader = ({order, contentLock, showManagedAccount, setOrder}) => {
  
  const orderStatusList = ["Draft","Submitted","Modification Requested","Accepted","Pending","Ready","Delivered","Invoiced","Paid"]
  const deliveryOptions = ["Pickup","Delivery"]
  
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
    if (event.target.deliveryOption != null) {
      rec.deliveryOption = event.target.deliveryOption.value;
    }
    if (event.target.managedAccount != null) { 
      rec.managedAccount = event.target.managedAccount.value;
    }
    if (event.target.status != null) { 
      rec.status = event.target.status.value;
      // Update order and update state so orderStatusDesc is updated
      order.Status = event.target.status.value;
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
  };

  return ( 
    <div className="fpForm">
      <form onSubmit={updateOrder} >
        <input id="orderRecID" name="orderRecID" type="hidden" value={order.RecID} />

        <div style={{ opacity: contentLock ? ".45" : "1" }}>
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

          <div className="fpFromField">
            <label htmlFor="deliveryOption">Delivery Option</label>
            <select name="deliveryOption" id="deliveryOption" defaultValue={order["Delivery Option"]} disabled={contentLock}>
              {deliveryOptions.map( d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        { showManagedAccount &&
          <div className="fpFromField">
            <label htmlFor="managedAccount">Managed Account</label>
            <input id="managedAccount" name="managedAccount" type="text" defaultValue={order["Managed Account"]}  />
          </div>
        }
        { showManagedAccount &&
          <div className="fpFromField">
            <label htmlFor="status">Order Status</label>
            <select name="status" id="status" defaultValue={order.Status}>
              {orderStatusList.map( s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        }
        <div>
          <button className="fpBtn" type="submit" disabled={contentLock && !showManagedAccount} >
            Save Header
          </button>
        </div>
      </form>
    </div>
   );
}
 
export default OrderHeader;