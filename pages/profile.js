import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Image from 'next/image'
import Link from 'next/link'

export default withPageAuthRequired(function Profile({ user }) {

  console.log(user);

  return (

      <div>
        <Image src={user.picture} alt={user.name} width={200} height={200}/>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <p>Role: {user["https://app.madriverfloralcollective.com/role"]}</p>
        <Link href="/api/auth/logout"><a className='fpA'>Logout</a></Link>
      </div>

  );
});