import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../../services/api';

interface EnrollStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const EnrollStudentModal: React.FC<EnrollStudentModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [credentials, setCredentials] = useState<{ email: string; temporaryPassword: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/admin/students', { name, email });
            setCredentials({ email: response.data.email, temporaryPassword: response.data.temporaryPassword });
            setName('');
            setEmail('');
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to enroll student');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setCredentials(null);
        setName('');
        setEmail('');
        setError('');
        onClose();
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    if (!isOpen) return null;

    if (credentials) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-green-600">Student Enrolled Successfully!</h2>
                        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <p className="font-semibold text-yellow-800 mb-2">⚠️ Save these credentials</p>
                        <p className="text-sm text-yellow-700">These credentials will not be shown again!</p>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={credentials.email}
                                    readOnly
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                />
                                <button
                                    onClick={() => copyToClipboard(credentials.email)}
                                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={credentials.temporaryPassword}
                                    readOnly
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono"
                                />
                                <button
                                    onClick={() => copyToClipboard(credentials.temporaryPassword)}
                                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Enroll New Student</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Enrolling...' : 'Enroll Student'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EnrollStudentModal;
