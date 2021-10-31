import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default withPageAuthRequired(function Help({ user }) {
  return (
    <div>
      <iframe src="https://ohiobarn.github.io/flowerpower" frameBorder="0" onmousewheel="" width="100%" height="800"></iframe>
    </div>
  );
});
