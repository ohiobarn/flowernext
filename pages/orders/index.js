import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default withPageAuthRequired(function Orders({ user }) {
  return (
    <div>
      <h1>Orders</h1>
    </div>
  );
});
