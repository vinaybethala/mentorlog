import React from 'react';
import { FileText, Download, BarChart2, PieChart, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Reports = () => {
    const reports = [
        { title: 'Monthly Tutor Performance', type: 'Tutor', color: 'bg-primary-500' },
        { title: 'Student Engagement Index', type: 'Student', color: 'bg-accent-violet' },
        { title: 'Academy Financial Summary', type: 'Academy', color: 'bg-accent-emerald' },
        { title: 'Subject-wise Time Matrix', type: 'Academic', color: 'bg-amber-500' },
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Analytics & Reports</h2>
                    <p className="text-gray-500 font-medium mt-1">Generate and export detailed academic insights</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.map((report, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.01 }}
                        className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer"
                    >
                        <div className="flex items-center gap-6">
                            <div className={`w-16 h-16 rounded-2xl ${report.color} flex items-center justify-center text-white shadow-lg shadow-opacity-30 group-hover:rotate-6 transition-transform`}>
                                <FileText size={28} />
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{report.type} Report</span>
                                <h3 className="text-xl font-bold text-gray-900 mt-1">{report.title}</h3>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-colors p-4 bg-primary-50 rounded-2xl">
                            <Download size={20} />
                            <span className="hidden sm:inline">Export PDF</span>
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                    <div className="flex items-center gap-2 mb-8">
                        <BarChart2 className="text-primary-500" />
                        <h4 className="text-xl font-bold text-gray-900">Weekly Progress Distribution</h4>
                    </div>
                    <div className="space-y-6">
                        {[
                            { label: 'Completed Sessions', value: 85, color: 'bg-primary-500' },
                            { label: 'Pending Assessments', value: 15, color: 'bg-amber-400' },
                            { label: 'Average Score', value: 72, color: 'bg-accent-violet' },
                            { label: 'Attendance Rate', value: 94, color: 'bg-accent-emerald' },
                        ].map((bar, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm font-bold text-gray-700 uppercase tracking-tighter">
                                    <span>{bar.label}</span>
                                    <span>{bar.value}%</span>
                                </div>
                                <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${bar.value}%` }}
                                        transition={{ duration: 1.5, delay: i * 0.2 }}
                                        className={`h-full ${bar.color} rounded-full`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <Activity size={32} className="text-gray-300" />
                    </div>
                    <h4 className="text-2xl font-black text-gray-900">Custom Reports</h4>
                    <p className="text-gray-400 font-medium max-w-xs mt-2 mb-8 lowercase leading-relaxed">
                        Need a specific data set? use our report builder to create custom insights for your academy.
                    </p>
                    <button className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-xl shadow-gray-200 hover:bg-black transition-all">
                        Open Report Builder
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reports;
