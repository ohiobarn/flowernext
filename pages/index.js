import Link from "next/link"
import Image from "next/image";

export default function Home() {

  var pjson = require('../package.json');
  console.log("Flower Power v%s", pjson.version);

  return (
    <div className="fpSplash">
      <Image src="/splash-clear-bg.png" layout="intrinsic" alt="splash" width={406} height={173} />
      <Link href='/landing'><a className="fpBtn">Login</a></Link>
      <p className="fpVersion"><small>Flower Power v{pjson.version}</small></p>
    </div>
  );
}
