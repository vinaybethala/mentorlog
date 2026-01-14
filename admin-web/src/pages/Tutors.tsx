import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Filter, BookOpen } from 'lucide-react';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import AddTutorModal from '../components/modals/AddTutorModal';
import api from '../services/api';

interface Tutor {
    id: string;
    userId: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}

const Tutors = () => {
    const [loading, setLoading] = useState(true);
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchTutors = async () => {
        try {
            const response = await api.get('/admin/tutors');
            setTutors(response.data);
        } catch (error) {
            console.error('Failed to fetch tutors', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTutors();
    }, []);

    const handleSuccess = () => {
        fetchTutors();
    };

    if (loading) return <Loading />;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tutors Management</h2>
                    <p className="text-gray-500 font-medium mt-1">Manage all your academic staff and performance</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-3 bg-primary-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add New Tutor
                </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl flex-1 max-w-sm border border-transparent focus-within:border-primary-100 focus-within:bg-white transition-all">
                        <Search size={18} className="text-gray-400" />
                        <input type="text" placeholder="Filter tutors..." className="bg-transparent border-none outline-none text-sm w-full font-medium" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {tutors.length === 0 ? (
                        <EmptyState title="No tutors found" description="Add a new tutor to get started." />
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Tutor</th>
                                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
                                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {tutors.map((tutor) => (
                                    <tr key={tutor.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                                                    {tutor.user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{tutor.user.name}</p>
                                                    <p className="text-xs text-gray-500 font-medium">{tutor.user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex gap-2">
                                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold flex items-center gap-1">
                                                    <BookOpen size={12} />
                                                    Tutor
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold inline-flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Active
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                                                <MoreVertical size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <AddTutorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </div>
    );
};

export default Tutors;
