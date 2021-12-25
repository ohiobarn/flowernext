import Link from "next/link";

const Navbar = () => {
  return (
    <nav>
      <div className="logo">
        <h1>Navbar</h1>
      </div>
      <Link href="/"><a>Home</a></Link>
      <Link href="/availabilityList"><a>Availability</a></Link>
      <Link href="/orders"><a>Orders</a></Link>
      <Link href="/profile"><a>Profile</a></Link>
      <Link href="/help"><a>Help</a></Link>
      
    </nav>
  );
};

export default Navbar;
