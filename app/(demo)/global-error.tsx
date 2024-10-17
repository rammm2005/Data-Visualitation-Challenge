import Link from 'next/link';

const Custom500 = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>500 - Server Error</h1>
            <p>Something went wrong on our end.</p>
            <Link href="/">
                <a style={{ color: '#0070f3', textDecoration: 'underline' }}>
                    Go back to the homepage
                </a>
            </Link>
        </div>
    );
};

export default Custom500;
