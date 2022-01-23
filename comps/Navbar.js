import Link from "next/link";
import Image from "next/image"

const Navbar = () => {
  return (
    <nav>
      <Link href="/landing">
        <a className="fpLogo"><Image src="/logo-clear-bg.png" alt="" width={50} height={50} /></a>
      </Link>
      <Link  href="/availabilityList">Availability</Link>
      <Link href="/orders"><a>Orders</a></Link>
      <Link href="/profile"><a>Profile</a></Link>
      <Link href="/help"><a>Help</a></Link>
      
    </nav>
  );
};

export default Navbar;
