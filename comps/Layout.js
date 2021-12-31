import Head from "next/head"
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <>
    <Head>
      <title>MRFC</title>
    </Head> 
    <div className="fpContent">
      <Navbar />
      { children }
    </div>
    </>
  );
}
 
export default Layout
