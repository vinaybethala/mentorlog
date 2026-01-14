import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MapPin } from 'lucide-react';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import EnrollStudentModal from '../components/modals/EnrollStudentModal';
import api from '../services/api';

interface Student {
    id: string;
    userId: string;
    parentId: string | null;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
    parent?: {
        user: {
            name: string;
            email: string;
        };
    };
}

const Students = () => {
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState<Student[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchStudents = async () => {
        try {
            const response = await api.get('/admin/students');
            setStudents(response.data);
        } catch (error) {
            console.error('Failed to fetch students', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleSuccess = () => {
        fetchStudents();
    };

    if (loading) return <Loading />;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Student Enrollment</h2>
                    <p className="text-gray-500 font-medium mt-1">Monitor student progress and session attendance</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-3 bg-primary-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all flex items-center gap-2"
                >
                    <Plus size={20} />
                    Enroll New Student
                </button>
            </div>

            {students.length === 0 ? (
                <EmptyState title="No students found" description="Enroll a new student to see them here." />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {students.map((student) => (
                        <div key={student.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group cursor-pointer">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center font-black text-2xl text-gray-300 group-hover:bg-primary-50 group-hover:text-primary-300 transition-colors">
                                    {student.user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                    Student
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 leading-none">{student.user.name}</h3>
                            <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm font-medium">
                                <div className="truncate w-full">{student.user.email}</div>
                            </div>
                            {student.parent && (
                                <div className="mt-2 text-xs text-gray-500">
                                    Parent: <span className="font-semibold">{student.parent.user.name}</span>
                                </div>
                            )}

                            <div className="h-0.5 w-full bg-gray-50 my-6"></div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</p>
                                    <p className="text-lg font-black text-green-600">Active</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <EnrollStudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </div>
    );
};

export default Students;
