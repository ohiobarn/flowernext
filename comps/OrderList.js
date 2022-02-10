import Link from "next/link"
import {submitOrder, isContentLocked,getOrderStatusDesc,isOrderActive} from "../utils/OrderUtils.js"


const OrderList = ({orders, showActiveOrders, submitOrder, contentLock}) => {

  var orderList = orders.filter( order => !isOrderActive(order));
  if (showActiveOrders === "yes"){
    orderList = orders.filter( order => isOrderActive(order) );
  }

  return ( 
    <div>
      {orderList.map(order => (
        <div key={order.RecID} className="fpOrderList">
          
          <Link href={'/orders/' + order.RecID} key={"orderStatusLink"}>
            <a className="fpSingle"><h3 className="fpFormTitle">{order["Client/Job"]} <span>Order#: {order.OrderNo} - {order.Status}:<br/>{getOrderStatusDesc(order)}</span></h3></a>
          </Link>

          <span>
            <Link href={'/orders/items/' + order.RecID} key={"orderItemsLink"}><a className="fpSingle">Items</a></Link>
            <Link href={'/orders/chat/' + order.RecID} key={"orderChatLink"}><a className="fpSingle">Chat</a></Link>
            <Link href={'/orders/activity/' + order.RecID} key={"orderActivityLink"}><a className="fpSingle">Activity</a></Link>
            { !isContentLocked(order.Status) && <a className="fpBtn" onClick={ () => submitOrder(order) }>Submit Order</a> }
          </span>
        </div>
      ))}
    </div>
  );
}

export default OrderList;