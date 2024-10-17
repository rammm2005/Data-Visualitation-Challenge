import { NextPageContext } from 'next';
import Link from 'next/link';

type ErrorProps = {
    statusCode?: number;
};

const ErrorPage = ({ statusCode }: ErrorProps) => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>{statusCode ? `Error ${statusCode}` : 'An error occurred'}</h1>
            <p>
                {statusCode === 404
                    ? 'Oops! The page you are looking for cannot be found.'
                    : 'Something went wrong on our end.'}
            </p>
            <Link href="/">
                <a style={{ color: '#0070f3', textDecoration: 'underline' }}>
                    Go back to the homepage
                </a>
            </Link>
        </div>
    );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
    const statusCode = res?.statusCode || err?.statusCode || 404;
    return { statusCode };
};

export default ErrorPage;
