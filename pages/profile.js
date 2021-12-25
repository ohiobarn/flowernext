import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Image from 'next/image'

export default withPageAuthRequired(function Profile({ user }) {

  return (

      <div>
        <Image src={user.picture} alt={user.name} width={200} height={200}/>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>

  );
});