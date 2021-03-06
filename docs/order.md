# Orders

An order is an electronic record in the MFRC app used to manage all order activities from early planning to fulfillment/payment. It is a single point of contact between the MRFC and florist for all communication on a given order. All information; status, delivery dates, correspondence, etc. are managed on the original order using various fields on the order. The goal is to keep everything you need in one place and avoid the need to manage disparate emails, text and pieces of paper.

What's on an order:

* **Client/Job** - The florists' client or job that this order is for, e.g. The Johnson Wedding.  It is use as a convent way to refer to this order in the app.

* **Team Member** - The name of the florists' contact for this order.

* **Order Notes** - Each order has a notes section use by both MRFC and florists to finalize details.  Order notes are intended to replace out-of-band communication such aa texts and emails.

* **Order activity** - Each order has an activity log with a record of all changes made to the order. The activity log is managed automatically by the system and is viewable on the order at anytime. It contains the date and description of any order modification.

* **Delivery Date** - The date when the order is to be delivered or picked-up. The florist must select an available delivery date from the MRFC's delivery schedule.

* **Delivery Option** - Indicates weather the order is to be delivered or picked-up.

* **Delivery Location** - The location where the order is to be delivered or picked-up. If the delivery option was taken the florist must supply a delivery location. If the pick-up option was taken the MFRC will supply a pick-up location.

* **Delivery Notes** - Optional notes that may be necessary to clarify delivery details.

* **Order Items** - A list of varieties for this order. The florist select varieties from the MRFC availability list and indicates the number of bunches requested.

* **Order Status** - Indicates the current status of the order and is key for managing the lifecycle of the order.  See the order status sections below for more detail.

## Order Status Summary

Below are the status a florist will see in the app.

``` mermaid
flowchart TD;


draft(Draft) --> 
submit("Submitted") --> 
accepted(Accepted) --> 
pending(Pending) --> 
ready(Ready) -->
delivered(Delivered) -->
invoiced(Invoiced) -->
paid(Paid)

submit --> modsreq(Modifications Requested) --> submit
```

* **Draft** - When a florist creates a new order its initial status is draft. The draft order is a planning tool for the florist, creating the order early in their planning phase and making edits over time as plans solidify with their clients. At some point the draft is complete or mostly complete, some details may be missing or the florist may have questions for the MRFC. At this time the florist should submit the order to the MRFC for review by clicking the submit button on the order.

* **Submitted** - When a florist submits an order the MRFC will receive a notification. The MRFC will review the order and if all is well, marks the order as accepted. If the order can not be accepted as-is the MRFC will request that the order be modified by adding notes to the order specifying the detail of the modifications being requested, then marks the order as modifications requested. *Note*: the app will not allow an order to be submitted unless it is complete. For example, the florist must select an available delivery date from the MRFC's delivery schedule.

* **Modifications Requested** - When an order is marked as "Modifications Requested" the florist receives a notification.  As a result the florist will edit the order and when ready submits the order again. This cycle continues until the order is accepted.

* **Accepted** - When an order is accepted the florists will receive a notification.   The accepted orders are "highlighted" in the app for the florist to see. At this time no action is required, both parties are waiting for the approaching delivery date.

* **Pending** - Each Monday the system automatically looks for accepted orders with a delivery date that is due in that week and marks them as pending. The pending orders will show more prominently in the app for the florist to see. It lets the florist know that the MRFC will soon begin their pick-n-pack process. 

* **Ready** - Once all items for an order have been harvested and prepared the MRFC will mark the order as ready, indicating that the order is ready to be picked up or delivered according to the delivery date specified on the order.

* **Delivered** - Once the order has been  picked up/delivered the MRFC will mark the order as delivered.

* **Invoiced** - Once a day the system will look for delivered orders and automaticly create and invoice. The order will be marked as invoiced and remain in the active orders list in the app to remind the florist that payment is due.

* **Paid** - Once payment is received the MFRC will mark the order as paid.  Paid orders are not shown in the active orders list but instead can be view from the "past orders" section of the app, in view only mode.
