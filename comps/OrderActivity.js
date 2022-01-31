const  OrderActivity = ({order}) => {
  return (
    <div className="fpForm">
      <div className="fpFromField">
        <textarea id="activity" name="activity" rows="10" cols="30" defaultValue={order.Activity} readOnly></textarea>
      </div>
    </div>
  );
}
 
export default OrderActivity;