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
                <small>{order["Due Date"]}</small>
                <h2>{order["Client/Job"]}</h2>
                <p>{ getOrderStatusDesc(order).status}</p>
                {getOrderSummary(order).what} ・ {getOrderSummary(order).window}
                <i>{getOrderStatusDesc(order).desc}</i>
              </a>
            </Link>
            <hr></hr>
          </div>
          <div className="fpActions">
            <Link href={'/orders/items/' + order.RecID} key={"orderItemsLink"}><a className="fpBtn">Edit Items</a></Link>
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