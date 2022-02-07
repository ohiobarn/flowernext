import Link from "next/link";
import Image from "next/image"

const Navbar = () => {
  return (
    <nav>
      <div className="fpLogo">
        <Link href="/landing">
          <a><Image src="/logo-clear-bg.png" alt="" width={50} height={50} /></a>
        </Link>&nbsp;&nbsp;
        <h1>Mad River Floral Collective</h1>
      </div>
      <Link href="/catalog">Catalog</Link>
      <Link href="/availabilityList">Availability</Link>
      <Link href="/orders">Orders</Link>
      <Link href="/profile">Profile</Link>
      <Link href="https://ohiobarn.github.io/flowernext/#order/"><a target="_blank">Help</a></Link>
      
    </nav>
  );
};

export default Navbar;
