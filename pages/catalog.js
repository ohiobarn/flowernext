import Link from "next/link";

const Catalog = () => {
  return (
    <div>
      <p>
        Use the grid below to browse the our catalog. <b>Tip,</b> click the <b>...</b> icon to print or download a copy. 
        Also, click the <b>View larger version</b> link located in
        the bottom right section of the grid to view a larger grid.
      </p>
      <p>Check the <Link href="/availabilityList"><a className="fpA">Availability Page</a></Link> to see if your item is currently offered.</p>
      <div>
        <iframe src="https://airtable.com/embed/shrSovazR20A9djwC?backgroundColor=yellow&viewControls=on" 
                frameBorder="0" 
                onmousewheel="" 
                width="100%" 
                height="800">
        </iframe>
      </div>
    </div>
  );
};

export default Catalog;
