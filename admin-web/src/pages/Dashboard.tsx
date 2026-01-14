import React, { useEffect, useState } from 'react';
import {
    Users,
    GraduationCap,
    Timer,
    CalendarCheck,
    ArrowUpRight,
    TrendingUp,
    Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm shadow-gray-100/50"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} shadow-lg shadow-opacity-20`}>
                <Icon size={28} className="text-white" />
            </div>
            <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold">
                <TrendingUp size={14} />
                {trend}
            </div>
        </div>
        <p className="text-gray-500 font-semibold text-sm uppercase tracking-wider">{label}</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
    </motion.div>
);

const Dashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/reports/overall-stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-8">Loading stats...</div>;
    }
    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Academy Overview</h2>
                    <p className="text-gray-500 font-medium mt-1">Real-time statistics for your tutoring business</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
                        <Clock size={18} className="text-gray-400" />
                        Last 30 Days
                    </button>
                    <button className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all flex items-center gap-2">
                        Download Report
                        <ArrowUpRight size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Users}
                    label="Total Tutors"
                    value={stats?.totalTutors || 0}
                    trend="+12%"
                    color="bg-primary-500 shadow-primary-200"
                />
                <StatCard
                    icon={GraduationCap}
                    label="Total Students"
                    value={stats?.totalStudents || 0}
                    trend="+8%"
                    color="bg-accent-violet shadow-violet-200"
                />
                <StatCard
                    icon={Timer}
                    label="Total Hours"
                    value={stats?.totalHours || 0}
                    trend="+23%"
                    color="bg-accent-emerald shadow-emerald-200"
                />
                <StatCard
                    icon={CalendarCheck}
                    label="Sessions"
                    value={stats?.totalSessions || 0}
                    trend="+15%"
                    color="bg-amber-500 shadow-amber-200"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-xl font-bold text-gray-900">Teaching Volume</h4>
                        <div className="flex gap-4 text-sm text-gray-500 font-semibold">
                            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary-500"></div> This Week</span>
                            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary-100"></div> Last Week</span>
                        </div>
                    </div>
                    {/* Simple Placeholder for Chart */}
                    <div className="h-64 flex items-end justify-between gap-4">
                        {[45, 60, 40, 80, 55, 90, 70].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col gap-2 items-center group">
                                <div className="w-full bg-gray-50 rounded-2xl relative overflow-hidden h-full">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className="absolute bottom-0 w-full bg-primary-500/20 group-hover:bg-primary-500/40 transition-colors rounded-t-xl"
                                    />
                                </div>
                                <span className="text-xs font-bold text-gray-400">Day {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                    <h4 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h4>
                    <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-400">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">New session started</p>
                                    <p className="text-xs text-gray-500 font-medium mt-0.5">Tutor John started Maths with Student Jane</p>
                                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">2 mins ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
