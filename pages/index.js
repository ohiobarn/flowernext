import Link from "next/link"
import Image from "next/image";

export default function Home() {

  var pjson = require('../package.json');
  console.log("Flower Power v%s", pjson.version);

  return (
    <div className="splash">
      <Image src="/splash-clear-bg.png" alt="" width={406} height={173} />
      <Link href='/landing'><a className="btn">Login</a></Link>
      <p className="version"><small>Flower Power v{pjson.version}</small></p>
    </div>
  );
}
