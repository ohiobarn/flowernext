import Link from "next/link";
import Image from "next/image";
import { isContentLocked } from "../utils/OrderUtils";

const OrderItems = ({order, updateOrderDetailOnBunchesChange}) => {

  return ( 
    <div className="fpForm">
      <div className="fpPageNav fpNavAtTop">
        <Link href="/orders"><a className="fpBtn">Back</a></Link>
        <Link href={"/orders/varieties?orderRecID=" + order.RecID} ><a className="fpBtn"  style={{display: isContentLocked(order.Status) ?'none':'true'}}>Add Items</a></Link>
      </div>

      <div id="items">
      {order.items.map((item) => { 
        return (
          <form key={item.RecID} style={{ opacity: isContentLocked(order.Status) ? ".45" : "1" }}>
            <div className="fpCard">
              <Image src={item.Image[0].thumbnails.large.url} layout="intrinsic" width={200} height={200} alt="thmbnail"/>
              <span>
                <div>
                  <hr />
                  <label htmlFor="sku">SKU</label>
                  <p id="sku">{item.SKU}</p>
                </div>
                <div>
                  <hr />
                  <label htmlFor="color">Color</label>
                  <p id="color">{item.Color}</p>
                </div>
                <div>
                  <hr />
                  <label htmlFor="bunches">Bunches</label>
                  <p>
                    <input id="bunches" name="bunches" type="number" defaultValue={item.Bunches} min="0" max="99" 
                      onChange={(event) => updateOrderDetailOnBunchesChange(item,event)} 
                      disabled={isContentLocked(order.Status) }
                    /> at ${item["Price per Bunch"]}/bn
                  </p>
                </div>
                <div>
                  <hr />
                  <label htmlFor="extended">Extended</label>
                  <p id="extended">${item["Extended"]}</p>
                </div>
              </span>
              <span>
                <h4>
                  {item.Crop} - {item.Variety}
                </h4>
              </span>
            </div>
          </form>
        );
      })}
      </div>

      <div className="fpPageNav fpNavAtBottom">
        <Link href="/orders"><a className="fpBtn">Back</a></Link>
        <Link href={"/orders/varieties?orderRecID=" + order.RecID} ><a className="fpBtn"  style={{display: isContentLocked(order.Status) ?'none':'true'}}>Add Items</a></Link>
      </div>

    </div>
   );
}
 
export default OrderItems;