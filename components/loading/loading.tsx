import { ReactNode } from "react";
// import { LoadingVisualType } from "@/types/open";

interface LoadingIndicatorProps {
    message: ReactNode;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
    return (
        <div className="flex justify-center items-center h-64">
            <p className="text-xl font-bold">{message}</p>
        </div>
    );
};
