import Link from "next/link";
import Image from "next/image";
import { isContentLocked } from "../utils/OrderUtils";



const OrderItems = ({order, updateOrderDetailOnBunchesChange, deleteOrderItem, setOrder}) => {

  const contentLockStyle = {
    opacity: isContentLocked(order.Status) ? ".65" : "1"
  }
  
  console.log("xxxxxxxxx")
  console.log(order.items.length)

  return ( 
    <div className="fpForm">
      <div id="items">
      { order.items.length == 0 &&
        <div>
          <center><h2>No items found on this order</h2></center>
          <center>Click the <i>Add Items</i> button above</center>
        </div>
      }
      {order.items.map((item) => { 
        return (
          <form key={item.RecID} style={contentLockStyle}>
            <div className="fpCard fpCardTall">
              { 
                Array.isArray(item.Image) && item.Image.length && item.Image[0].thumbnails && item.Image[0].thumbnails.large && item.Image[0].thumbnails.large.url &&
                <Image src={item.Image[0].thumbnails.large.url} layout="intrinsic" width={200} height={200} alt="thmbnail"/> 
              }
              <div>
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
                      onChange={(event) => updateOrderDetailOnBunchesChange(order,item,setOrder,event)} 
                      disabled={isContentLocked(order.Status) }
                    /> at ${item["Price per Bunch"]}/bn
                  </p>
                </div>
                <div>
                  <hr />
                  <label htmlFor="extended">Extended</label>
                  <p id="extended">${item["Extended"]}</p>
                </div>
              </div>
              <div>
                <h4>
                  {item.Crop} - {item.Variety}
                </h4>
              </div>
              { !isContentLocked(order.Status) && 
              <div>
                <button className="fpBtn" type="button" value={order.RecID} onClick={ () => deleteOrderItem(order.RecID,item.RecID)}>
                  Delete Item
                </button>
              </div>
              }
            </div>
    
          </form>
        );
      })}
      </div>
    </div>
   );
}
 
export default OrderItems;