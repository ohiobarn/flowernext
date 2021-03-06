import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const NotFound = () => {
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      router.push('/')
    },3000)
  })

  return (
    <div className="fpNot-found">
      <h1>Oooops...</h1>
      <h2>That page cannot be found.</h2>
      <p>You will be taken bake to the <Link href='/'><a>Homepage</a></Link> in a few seconds...</p> 
    </div>
    );
}
 
export default NotFound;