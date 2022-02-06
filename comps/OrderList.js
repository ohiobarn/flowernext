import Link from "next/link"

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

const OrderList = ({orders, showActiveOrders}) => {

  var orderList = orders.filter( order => !isOrderActive(order));
  if (showActiveOrders === "yes"){
    orderList = orders.filter( order => isOrderActive(order) );
  }


  return ( 
    <div>
      {orderList.map(order => (
        <div key={order.RecID} className="fpOrderList">
          <Link href={'/orders/' + order.RecID} key={"orderStatusLink"}>
            <a className="fpSingle"><h3 className="fpFormTitle">{order["Client/Job"]} <span>Order#: {order.OrderNo} - {order.Status}</span></h3></a>
          </Link>
          <span>
          <Link href={'/orders/chat/' + order.RecID} key={"orderChatLink"}><a className="fpSingle">Chat</a></Link>
          <Link href={'/orders/activity/' + order.RecID} key={"orderActivityLink"}><a className="fpSingle">Activity</a></Link>
          </span>
        </div>
      ))}
    </div>
  );
}

export default OrderList;