import Link from "next/link";
import { Bird } from 'lucide-react';

const Custom404 = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-gray-800 dark:text-gray-200">
            <Bird className="h-16 w-16 mb-4 animate-bounce" />
            <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
            <p className="text-lg mb-4">Oops! The page you are looking for does not exist.</p>
            <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300">
                Go Back Home
            </Link>
        </div>
    );
};

export default Custom404;
