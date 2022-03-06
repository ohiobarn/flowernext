const OrderSummary = ({orderTotal}) => {

  let dollarUS = Intl.NumberFormat("en-US", {style: "currency", currency: "USD"});

  return ( 
    <div className="fpForm">
      <div className="fpFromField">
        <p>Order total: {dollarUS.format(orderTotal)}</p>
      </div>
    </div>
   );
}
 
export default OrderSummary;