import Link from "next/link";
import Image from "next/image"

const Navbar = () => {
  return (
    <nav>
      <div className="logo">
        <Link href="/">
          <a><Image src="/logo-clear-bg.png" alt="" width={50} height={50} /></a>
        </Link>
      </div>
      <Link href="/availabilityList"><a>Availability</a></Link>
      <Link href="/orders"><a>Orders</a></Link>
      <Link href="/profile"><a>Profile</a></Link>
      <Link href="/help"><a>Help</a></Link>
      
    </nav>
  );
};

export default Navbar;
