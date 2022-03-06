import Link from "next/link"
import Image from "next/image";

export default function Home() {

  let pjson = require('../package.json');

  return (
    <div className="fpSplash">
      <Image src="/splash-clear-bg.png" layout="intrinsic" alt="splash" width={406} height={173} />
      <Link href='/landing'><a className="fpBtn" name="login">Login</a></Link>
      <p className="fpVersion"><small>version {pjson.version}</small></p>
    </div>
  );
}
