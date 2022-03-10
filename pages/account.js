import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import React, { useState, useEffect} from "react";
import Link from "next/link";
import Image from "next/image";

/////////////////////////////////////////////////////////////////////////////////
// getServerSideProps
/////////////////////////////////////////////////////////////////////////////////
export const getServerSideProps = withPageAuthRequired({
  resizeTo: "/",
  async getServerSideProps( context ) {
    // Get user from cookie
    let res = {}; // Don't use actual res object, it cause spam in logs
    const { user } = getSession(context.req, res);

    let myProps = {}
    myProps.user = user;

    // Pass order to the page via props
    return { props: { myProps } };
  }
});

////////////////////////////////////////////////////////////////////////////
// Default
////////////////////////////////////////////////////////////////////////////
export default function Admin({ myProps }) {
  // var order = myProps.order;
  let user = myProps.user;

  const [isAdmin, setIsAdmin] = useState(false);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {

    // Role
    if (user["https://app.madriverfloralcollective.com/role"] === "Admin" ){
      setIsAdmin(true)
    } 
    else {
      setIsAdmin(false)
    }

  }, [user]);

  /////////////////////////////////////////////////////////////////////////////////
  // return
  /////////////////////////////////////////////////////////////////////////////////
  return (

    <div>
      <Image src={user.picture} alt={user.name} width={200} height={200}/>
      <div className="fpBasicPage">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <p>Role: {user["https://app.madriverfloralcollective.com/role"]}</p>

        <hr></hr>
        <div>
          <p><Link href="/orders/history"><a className='fpA'>Order History</a></Link></p>
          { isAdmin && 
            <>
            <p><Link href="https://airtable.com/shrtDX6ufhKlBEOEK"><a className='fpA'>New Variety Form</a></Link></p>
            <p><Link href="https://airtable.com/shrsQV51NX4AvA1XV"><a className='fpA'>Order Report</a></Link></p>
            </>
          }
          <hr></hr>
          <p><Link href="/api/auth/logout?federated"><a className='fpA'>Logout</a></Link></p>
        </div>
      </div>
    </div>
  );

}