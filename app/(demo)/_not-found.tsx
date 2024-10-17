import Link from 'next/link';

const Custom404 = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>404 - Page Not Found</h1>
            <p>Oops! The page you are looking for does not exist.</p>
            <Link href="/">
                <a style={{ color: '#0070f3', textDecoration: 'underline' }}>
                    Go back to the homepage
                </a>
            </Link>
        </div>
    );
};

export default Custom404;
