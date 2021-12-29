import Link from "next/link"
import Image from "next/image";

export default function Home() {
  return (
    <div className="splash">
      <Image src="/splash-clear-bg.png" alt="" width={406} height={173} />
      <Link href='/landing'><a className="btn">Login</a></Link>
    </div>
  );
}
