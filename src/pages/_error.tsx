import { NextPageContext } from 'next';

type errorMessage = { statusCode: number };
function Error({ statusCode }: errorMessage) {
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : 'An error occurred on client'}
    </p>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ? res.statusCode : err?.statusCode || 404;
  return { statusCode };
};

export default Error;
