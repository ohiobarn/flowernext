import Link from "next/link";

const  OrderActivity = ({order}) => {
  return (
    <div>
      <div className="fpPageNav fpNavAtTop">
        <Link href="/orders"><a className="fpBtn">Done</a></Link>
      </div>
    
      <div className="fpForm">
        <div className="fpFromField">
          <textarea id="activity" name="activity" rows="25" cols="80" defaultValue={order.Activity} readOnly></textarea>
        </div>
      </div>
    </div>
  );
}
 
export default OrderActivity;