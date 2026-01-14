import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-gray-400">
            <Loader2 size={40} className="animate-spin mb-4 text-primary-500" />
            <p className="font-medium text-sm">Loading data...</p>
        </div>
    );
};

export default Loading;
