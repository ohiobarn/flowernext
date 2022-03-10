import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react';

export default withPageAuthRequired(function Landing({ user }) {

  useEffect( () => {
    setTimeout(function() {
      window.location.replace('/orders');
    }, 1);
  });

  return (
    <div  className="fpSplash">
      <Image src="/splash-clear-bg.png"  layout="intrinsic" alt="splash" width={406} height={173} />
      {/* <p className="text">Welcome to MRFC!</p> */}
    </div>
  );
});