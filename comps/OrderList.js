import Link from "next/link"
import {submitOrder, isContentLocked,getOrderStatusDesc,isOrderActive,findPickupWindow,getOrderSummary} from "../utils/OrderUtils.js"


const OrderList = ({orders, showActiveOrders, submitOrder, contentLock}) => {

  var orderList = orders.filter( order => !isOrderActive(order));
  if (showActiveOrders === "yes"){
    orderList = orders.filter( order => isOrderActive(order) );
  }

  return ( 
    <div>
      {orderList.map(order => (
        <div key={order.RecID} className="fpOrderList">
          <div>
            <Link href={'/orders/' + order.RecID} key={"orderStatusLink"}>
              <a className="fpSingle">
                <h3>{order["Client/Job"]}</h3>
                <br/>{getOrderSummary(order).what}
                <br/>{getOrderSummary(order).who}
                <br/>{getOrderSummary(order).when}
              </a>
            </Link>
            <div className="fpSingleNoHover" >
              <p>{getOrderStatusDesc(order)}</p>
            </div>
          </div>

          <div>
            <Link href={'/orders/items/' + order.RecID} key={"orderItemsLink"}><a className="fpSingle">Items</a></Link>
            <Link href={'/orders/chat/' + order.RecID} key={"orderChatLink"}><a className="fpSingle">Chat</a></Link>
            <Link href={'/orders/activity/' + order.RecID} key={"orderActivityLink"}><a className="fpSingle">Activity</a></Link>
            { !isContentLocked(order.Status) && <a className="fpBtn" onClick={ () => submitOrder(order) }>Submit Draft</a> }
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderList;