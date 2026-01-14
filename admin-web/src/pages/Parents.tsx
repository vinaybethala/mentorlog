import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, UserPlus } from 'lucide-react';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import AddParentModal from '../components/modals/AddParentModal';
import api from '../services/api';

interface Parent {
    id: string;
    userId: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
    students: {
        user: {
            name: string;
        };
    }[];
}

const Parents = () => {
    const [loading, setLoading] = useState(true);
    const [parents, setParents] = useState<Parent[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchParents = async () => {
        try {
            const response = await api.get('/admin/parents');
            setParents(response.data);
        } catch (error) {
            console.error('Failed to fetch parents', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParents();
    }, []);

    const handleSuccess = () => {
        fetchParents();
    };

    if (loading) return <Loading />;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Parent Management</h2>
                    <p className="text-gray-500 font-medium mt-1">Manage parent accounts and their linked students</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-3 bg-primary-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add New Parent
                </button>
            </div>

            {parents.length === 0 ? (
                <EmptyState title="No parents found" description="Add a new parent to get started." />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {parents.map((parent) => (
                        <div key={parent.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group cursor-pointer">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center text-primary-600 group-hover:bg-primary-50 transition-colors">
                                    <UserPlus size={28} />
                                </div>
                                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                    Active
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 leading-none">{parent.user.name}</h3>
                            <p className="mt-2 text-gray-400 text-sm font-medium">{parent.user.email}</p>

                            <div className="h-0.5 w-full bg-gray-50 my-6"></div>

                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Children Linked</p>
                                <div className="flex -space-x-3 mt-2">
                                    {parent.students.length > 0 ? (
                                        parent.students.map((student, idx) => (
                                            <div key={idx} className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-600" title={student.user.name}>
                                                {student.user.name.charAt(0)}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400">No children linked</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AddParentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </div>
    );
};

export default Parents;
