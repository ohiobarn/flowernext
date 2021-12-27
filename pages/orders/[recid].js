import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";


export async function getServerSideProps( context ){

  // Get user from cookie
  var res = {}; // Don't use actual res object, it cause spam in logs
  const { user } = getSession(context.req,res)

  // Get Page Id
  const recid = context.query.recid
  console.log("recid: %s", recid)

  // console.log(context)
  console.log("Account: %s", user.email)
  // const { order } = context

  // Fetch data from AirTable
  // DEVTODO - create airtable query see /index.js for example
  // const order = await getOrder(recid)
  
  return {
    props: { foo: 1 }
  }
}

export default withPageAuthRequired(function OrderDetail({ order }) {
  return (
    <div>
      <h1>Orders Detail - { order } </h1>
    </div>
  );
});