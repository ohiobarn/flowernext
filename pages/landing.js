import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Image from 'next/image'
import Link from 'next/link'

export default withPageAuthRequired(function Profile({ user }) {

  return (
    <div  className="splash">
      <Image src="/splash-clear-bg.png" alt="" width={406} height={173} />
      {/* <p className="text">Welcome to MRFC!</p> */}
      <Link href="/orders"><a className="btn">Get Started</a></Link>
    </div>
  );
});