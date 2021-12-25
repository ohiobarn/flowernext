import Link from "next/link";

const Navbar = () => {
  return (
    <nav>
      <div className="logo">
        <h1>Navbar</h1>
      </div>
      <div><Link href="/"><a>Home</a></Link></div>
      <div><Link href="/availabilityList">
        <a>Availability List</a>
      </Link></div>
      <div><Link href="/orders">
        <a>Orders</a>
      </Link></div>
      <div><Link href="/help">
        <a>Help</a>
      </Link></div>
    </nav>
  );
};

export default Navbar;
