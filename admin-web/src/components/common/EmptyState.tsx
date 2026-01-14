import React from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
    title?: string;
    description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title = 'No data found',
    description = 'We couldn\'t find any records matching your criteria.'
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/50">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <PackageOpen size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">{description}</p>
        </div>
    );
};

export default EmptyState;
