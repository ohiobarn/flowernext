import Link from "next/link";

const Catalog = () => {
  return (
    <div>
      <h2>Catalog</h2>
      <p>
        Use the grid below to browse the our catalog. <b>Tip,</b> click the <b>...</b> icon to print or download a copy. Check the <Link href="/availabilityList"><a className="fpA">Availability Page</a></Link> to see if your item is currently offered.</p>
      <div>
        {/* Uses airtable view: crop-planner 2022/Variety/Flower Power App/MFRC Catalog */}
        <iframe src="https://airtable.com/embed/shrSovazR20A9djwC?backgroundColor=yellow&viewControls=on" 
                frameBorder="0" 
                width="100%" 
                height="533">
        </iframe>
        <p>Too small? Click the "<b>View larger version</b>" link located in
        the bottom right section of the grid </p>
      </div>
    </div>
  );
};

export default Catalog;
