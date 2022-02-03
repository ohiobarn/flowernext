const  OrderActivity = ({order}) => {
  return (
    <div className="fpForm">
      <div className="fpFromField">
        <textarea id="activity" name="activity" rows="25" cols="80" defaultValue={order.Activity} readOnly></textarea>
      </div>
    </div>
  );
}
 
export default OrderActivity;