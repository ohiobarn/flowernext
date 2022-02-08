import Link from "next/link"
import {submitOrder, isContentLocked} from "../utils/OrderUtils.js"

////////////////////////////////////////////////////////////////////////////
//          isOrderActive
////////////////////////////////////////////////////////////////////////////
function isOrderActive(order) {
  
  var isActive = true
  if ( order.Status === "Invoiced" || order.Status === "Paid" ){
    isActive = false
  }
  return isActive
}

const OrderList = ({orders, showActiveOrders, submitOrder, contentLock}) => {

  var orderList = orders.filter( order => !isOrderActive(order));
  if (showActiveOrders === "yes"){
    orderList = orders.filter( order => isOrderActive(order) );
  }

  return ( 
    <div>
      {orderList.map(order => (
        <div key={order.RecID} className="fpOrderList">
          <span>
            <Link href={'/orders/' + order.RecID} key={"orderStatusLink"}>
              <a className="fpSingle"><h3 className="fpFormTitle">{order["Client/Job"]} <span>Order#: {order.OrderNo} - {order.Status}</span></h3></a>
            </Link>
            {
              !isContentLocked(order.Status) && 
              <a className="fpSingle" onClick={ () => submitOrder(order) }>Submit Order</a>
            }
          </span>

          <span>
            <Link href={'/orders/items/' + order.RecID} key={"orderItemsLink"}><a className="fpSingle">Items</a></Link>
            <Link href={'/orders/chat/' + order.RecID} key={"orderChatLink"}><a className="fpSingle">Chat</a></Link>
            <Link href={'/orders/activity/' + order.RecID} key={"orderActivityLink"}><a className="fpSingle">Activity</a></Link>
          </span>
        </div>
      ))}
    </div>
  );
}

export default OrderList;