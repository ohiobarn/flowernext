import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Image from 'next/image'
import Link from 'next/link'

export default withPageAuthRequired(function Profile({ user }) {

  return (
    <div  className={styles.splash}>
      <Image src="/splash-clear-bg.png" alt="" width={406} height={173} />
      <p className={styles.text}>Welcome to MRFC. Press the button below to start working with orders or use the menu at the top from any page.</p>
      <Link href='/orders'><a className="btn">Get Started</a></Link>
    </div>
  );
});