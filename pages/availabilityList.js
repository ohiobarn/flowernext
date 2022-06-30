
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

//
// Uses airtable view: MFRC 2022/Forecast (MFRC)/Collective/MFRC Grid Public 
//
export default withPageAuthRequired(function AvailabilityList({ user }) {

  return (
    <div>
      <h2>Availability</h2>
      <p>
        Use the grid below to browse the current forecast. <b>Tip,</b> click the <b>...</b> icon to print or download a copy of the forecast. Also, click the <b>View larger version</b> link located in
        the bottom right section of the grid to view a larger grid.{" "}
      </p>
      <div>
        <iframe src="https://airtable.com/embed/shr2OXWY4yLoqCYKf?backgroundColor=cyan&viewControls=on" 
                frameBorder="0" 
                width="100%" 
                height="533">
        </iframe>
      </div>
    </div>
  );
});

