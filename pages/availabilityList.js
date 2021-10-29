const AvailabilityList = () => {
  return (
    <div>
      <p>
        Use the grid below to browse the current forecast. <b>Tip,</b> click the <b>...</b> icon to print or download a copy of the forecast. Also, click the <b>View larger version</b> link located in
        the bottom right section of the grid to view a larger grid.{" "}
      </p>
      <div>
        <iframe src="https://airtable.com/embed/shr2OXWY4yLoqCYKf?backgroundColor=cyan&viewControls=on" frameBorder="0" onmousewheel="" width="100%" height="800"></iframe>
      </div>
    </div>
  );
};

export default AvailabilityList;
