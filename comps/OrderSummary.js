const OrderSummary = ({orderTotal}) => {
  return ( 
    <div className="fpForm">
      <div className="fpFromField">
        <p>Order total: ${orderTotal}</p>
      </div>
    </div>
   );
}
 
export default OrderSummary;