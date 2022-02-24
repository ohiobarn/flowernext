import Link from "next/link"
import {submitOrder, isContentLocked,getOrderStatusDesc,isOrderActive,getPickupWindowDesc,getOrderSummary} from "../utils/OrderUtils.js"


const OrderList = ({orders, showActiveOrders, isAdmin}) => {

  var orderList = orders.filter( order => !isOrderActive(order));
  if (showActiveOrders === "yes"){
    orderList = orders.filter( order => isOrderActive(order) );
  }


  return ( 
    <div>
      {orderList.map(order => (
        <div key={order.RecID} className="fpOrderList">
          <div className="fpHeader">
            <Link href={'/orders/' + order.RecID} key={"orderStatusLink"}>
              <a className="fpSingle">
                <p><small>Due: {order["Due Date"]}</small></p>
                {isAdmin && "Florist: " + order["Managed Account"]}
                <h2>{order["Client/Job"]}</h2>
                <br />
                <p>{getOrderStatusDesc(order).status} ・ {getOrderSummary(order).what} ・ {getOrderSummary(order).window} ・ {getOrderSummary(order).items} ・ {getOrderSummary(order).total}</p>
                <p>{getOrderStatusDesc(order).desc}</p>
                
              </a>
            </Link>
            <hr></hr>
          </div>
          <div className="fpActions">
            { !isContentLocked(order.Status) && <Link href={'/orders/items/' + order.RecID} key={"orderItemsLink"}><a className="fpBtn">Edit Items</a></Link>}
            <Link href={'/orders/chat/' + order.RecID} key={"orderChatLink"}><a className="fpBtn">Chat with MRFC</a></Link>
            <Link href={'/orders/activity/' + order.RecID} key={"orderActivityLink"}><a className="fpBtn">View Activity Log</a></Link>
            { !isContentLocked(order.Status) && <a className="fpBtn" onClick={ () => submitOrder(order) }>Submit Draft</a> }
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderList;