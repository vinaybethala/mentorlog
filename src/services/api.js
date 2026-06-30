// Simple id generator
const generateId = () => Math.random().toString(36).substring(2, 9);

// Initial Seed Data
const seedData = {
  users: [
    { id: 'u2', role: 'tutor', email: 'tutor1@mentorlog.com', password: 'password', status: 'Active' },
    { id: 'u3', role: 'student', email: 'student1@mentorlog.com', password: 'password', status: 'Active' },
    { id: 'u4', role: 'parent', email: 'parent1@mentorlog.com', password: 'password', status: 'Active' },
  ],
  students: [
    {
      id: 's1', userId: 'u3', name: 'Alice Smith',
      age: '15', dob: '2011-05-12', gender: 'Female',
      class: 'Grade 10', subjects: ['Math', 'Science'],
      parentName: 'Bob Smith', parentContact: '555-0101', parentEmail: 'parent1@mentorlog.com',
      address: '123 Main St', admissionDate: '2023-09-01'
    },
  ],
  parents: [
    { id: 'p1', userId: 'u4', studentIds: ['u3'], name: 'Bob Smith', contact: '555-0101' }
  ],
  tutors: [
    {
      id: 't1', userId: 'u2', name: 'John Doe',
      age: '30', dob: '1996-02-15', gender: 'Male',
      contact: '555-0202', subjects: ['Math', 'Science'],
      qualification: 'B.Sc Mathematics', experience: '5 years',
      address: '456 Elm St', bankDetails: 'Bank of America - 1234',
      bankName: 'Bank of America', bankAccount: '123456789', ifsc: 'BOA123', branch: 'Downtown',
      joiningDate: '2022-01-10', salaryType: 'Monthly'
    },
  ],
  progressLogs: [
    { id: 'log1', studentId: 'u3', tutorId: 'u2', subject: 'Math', topic: 'Algebra Basics', type: 'homework done', remarks: 'Good grasp on concepts. Needs practice with quadratic equations.', date: new Date(Date.now() - 86400000).toISOString() }
  ],
  attendance: [
    { id: 'att1', studentId: 'u3', tutorId: 'u2', subject: 'Math', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], status: 'Present' }
  ],
  homework: [
    { id: 'hw1', studentId: 'u3', tutorId: 'u2', subject: 'Math', topic: 'Algebra Chapter 1', status: 'Completed', dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0] }
  ],
  schedules: [
    { id: 'sch1', class: 'Grade 10', subject: 'Math', tutorId: 'u2', dayOfWeek: 'Monday', time: '10:00 AM' }
  ],
  fees: [
    { id: 'fee1', studentId: 'u3', totalAmount: 5000, paidAmount: 2000, dueDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0], status: 'Partial', history: [{ amount: 2000, date: new Date(Date.now() - 5 * 86400000).toISOString(), receipt: 'REC-001' }] }
  ],
  notifications: [
    { id: 'notif1', userId: 'u3', message: 'Homework Assigned for Math', type: 'homework', isRead: false, createdAt: new Date().toISOString() }
  ]
};

// Initialize LocalStorage
const initializeDB = () => {
  if (!localStorage.getItem('mentorlog_db_v2')) {
    localStorage.setItem('mentorlog_db_v2', JSON.stringify(seedData));
  }
};

const getDB = () => {
  initializeDB();
  return JSON.parse(localStorage.getItem('mentorlog_db_v2'));
};

const saveDB = (data) => {
  localStorage.setItem('mentorlog_db_v2', JSON.stringify(data));
};

export const api = {
  // Auth
  login: async (email, password) => {
    const db = getDB();
    const user = db.users.find(u => u.email === email);

    if (!user) throw new Error("Invalid email or password");
    if (user.password !== password) throw new Error("Invalid email or password");
    if (user.status && user.status !== 'Active') throw new Error("Your account is currently inactive. Please contact admin.");

    let profile = { name: email.split('@')[0] }; // fallback
    if (user.role === 'student') {
      const p = db.students.find(s => s.userId === user.id);
      if (p) profile = p;
    } else if (user.role === 'tutor') {
      const p = db.tutors.find(t => t.userId === user.id);
      if (p) profile = p;
    } else if (user.role === 'parent') {
      const p = db.parents.find(p => p.userId === user.id);
      if (p) profile = p;
    } else if (user.role === 'admin') {
      profile = { name: 'Academy Admin' };
    }

    const userData = { ...user, ...profile, id: user.id };
    return { token: 'mock-jwt-token-' + user.id, user: userData };
  },

  // Students & Parents
  getStudents: async () => {
    const db = getDB();
    return db.students.map(student => {
      const user = db.users.find(u => u.id === student.userId);
      return { ...student, email: user?.email, status: user?.status };
    });
  },
  getStudentById: async (userId) => {
    const db = getDB();
    const student = db.students.find(s => s.userId === userId);
    const user = db.users.find(u => u.id === userId);
    return { ...student, email: user?.email, status: user?.status };
  },
  createStudent: async (studentData) => {
    const db = getDB();

    if (db.users.find(u => u.email === studentData.email)) {
      throw new Error("Student email address is already in use.");
    }

    const userId = 'u' + generateId();
    const studentId = 's' + generateId();

    db.users.push({
      id: userId,
      role: 'student',
      email: studentData.email,
      password: studentData.password,
      status: studentData.status || 'Active'
    });

    const newStudent = {
      id: studentId,
      userId: userId,
      name: studentData.name,
      age: studentData.age,
      dob: studentData.dob,
      gender: studentData.gender,
      class: studentData.class,
      subjects: studentData.subjects || [],
      parentName: studentData.parentName,
      parentContact: studentData.parentContact,
      parentEmail: studentData.parentEmail,
      address: studentData.address,
      admissionDate: studentData.admissionDate || new Date().toISOString().split('T')[0]
    };
    db.students.push(newStudent);

    // Auto-create or link parent account
    let parentUser = db.users.find(u => u.email === studentData.parentEmail && u.role === 'parent');
    if (!parentUser) {
      const parentUserId = 'u' + generateId();
      parentUser = {
        id: parentUserId,
        role: 'parent',
        email: studentData.parentEmail,
        password: 'password123', // Default parent password
        status: 'Active'
      };
      db.users.push(parentUser);
      db.parents.push({
        id: 'p' + generateId(),
        userId: parentUserId,
        studentIds: [userId],
        name: studentData.parentName,
        contact: studentData.parentContact
      });
    } else {
      const parentRecord = db.parents.find(p => p.userId === parentUser.id);
      if (parentRecord && !parentRecord.studentIds.includes(userId)) {
        parentRecord.studentIds.push(userId);
      }
    }

    saveDB(db);
    return newStudent;
  },

  getParentByUserId: async (userId) => {
    const db = getDB();
    return db.parents.find(p => p.userId === userId);
  },

  // Tutors
  getTutors: async () => {
    const db = getDB();
    return db.tutors.map(tutor => {
      const user = db.users.find(u => u.id === tutor.userId);
      return { ...tutor, email: user?.email, status: user?.status };
    });
  },
  createTutor: async (tutorData) => {
    const db = getDB();
    if (db.users.find(u => u.email === tutorData.email)) {
      throw new Error("Email address is already in use.");
    }

    const userId = 'u' + generateId();
    const tutorId = 't' + generateId();

    db.users.push({
      id: userId,
      role: 'tutor',
      email: tutorData.email,
      password: tutorData.password,
      status: tutorData.status || 'Active'
    });

    const newTutor = {
      id: tutorId,
      userId: userId,
      ...tutorData,
      joiningDate: tutorData.joiningDate || new Date().toISOString().split('T')[0]
    };
    // Clean up passwords from profile
    delete newTutor.password;
    delete newTutor.confirmPassword;
    delete newTutor.status;
    delete newTutor.email;

    db.tutors.push(newTutor);
    saveDB(db);
    return newTutor;
  },

  // Operations (Logs, Attendance, Homework, Fees)
  getProgressLogs: async (filters = {}) => {
    const db = getDB();
    let logs = db.progressLogs;
    if (filters.studentId) logs = logs.filter(l => l.studentId === filters.studentId);
    if (filters.tutorId) logs = logs.filter(l => l.tutorId === filters.tutorId);
    return logs.sort((a, b) => new Date(b.date) - new Date(a.date));
  },
  createProgressLog: async (logData) => {
    const db = getDB();
    const newLog = { ...logData, id: generateId(), date: new Date().toISOString() };
    db.progressLogs.push(newLog);

    db.notifications.push({
      id: 'n' + generateId(),
      userId: logData.studentId,
      message: `New progress logged for ${logData.subject}: ${logData.topic}`,
      type: 'progress',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    saveDB(db);
    return newLog;
  },

  createAttendance: async (attData) => {
    const db = getDB();
    const newAtt = { ...attData, id: 'att' + generateId() };
    db.attendance.push(newAtt);

    if (attData.status === 'Absent' || attData.status === 'Leave') {
      db.notifications.push({
        id: 'n' + generateId(),
        userId: attData.studentId,
        message: `Attendance marked as ${attData.status} for ${attData.subject} on ${attData.date}`,
        type: 'attendance',
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    saveDB(db);
    return newAtt;
  },

  getAttendance: async (filters = {}) => {
    const db = getDB();
    let att = db.attendance;
    if (filters.studentId) att = att.filter(a => a.studentId === filters.studentId);
    return att;
  },

  createHomework: async (hwData) => {
    const db = getDB();
    const newHw = { ...hwData, id: 'hw' + generateId() };
    db.homework.push(newHw);

    db.notifications.push({
      id: 'n' + generateId(),
      userId: hwData.studentId,
      message: `New homework assigned for ${hwData.subject}: ${hwData.topic}`,
      type: 'homework',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    saveDB(db);
    return newHw;
  },

  getHomework: async (filters = {}) => {
    const db = getDB();
    let hw = db.homework;
    if (filters.studentId) hw = hw.filter(h => h.studentId === filters.studentId);
    return hw;
  },

  getSchedules: async (filters = {}) => {
    const db = getDB();
    let schedules = db.schedules;
    if (filters.tutorId) schedules = schedules.filter(s => s.tutorId === filters.tutorId);
    if (filters.class) schedules = schedules.filter(s => s.class === filters.class);
    return schedules;
  },

  getFees: async (filters = {}) => {
    const db = getDB();
    let fees = db.fees;
    if (filters.studentId) fees = fees.filter(f => f.studentId === filters.studentId);
    return fees;
  },

  // Analytics
  getDashboardStats: async () => {
    const db = getDB();
    return {
      totalStudents: db.students.length,
      totalTutors: db.tutors.length,
      totalLogs: db.progressLogs.length,
      recentActivity: db.progressLogs.slice(-5).reverse()
    };
  },

  getNotifications: async (userId) => {
    const db = getDB();
    return (db.notifications || [])
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  markNotificationRead: async (id) => {
    const db = getDB();
    const notif = db.notifications.find(n => n.id === id);
    if (notif) notif.isRead = true;
    saveDB(db);
  },

  createFeePayment: async (studentId, amount) => {
    const db = getDB();
    const feeRecord = db.fees.find(f => f.studentId === studentId);
    if (!feeRecord) throw new Error('Fee record not found');
    feeRecord.paidAmount += Number(amount);
    if (feeRecord.paidAmount >= feeRecord.totalAmount) feeRecord.status = 'Paid';
    else feeRecord.status = 'Partial';
    feeRecord.history.push({
      amount: Number(amount),
      date: new Date().toISOString(),
      receipt: 'REC-' + generateId().toUpperCase()
    });
    db.notifications.push({
      id: 'n' + generateId(),
      userId: studentId,
      message: `Payment of ₹${amount} received. Thank you!`,
      type: 'fee',
      isRead: false,
      createdAt: new Date().toISOString()
    });
    saveDB(db);
    return feeRecord;
  },

  createFeeRecord: async (data) => {
    const db = getDB();
    const newFee = {
      id: 'fee' + generateId(),
      studentId: data.studentId,
      totalAmount: Number(data.totalAmount),
      paidAmount: 0,
      dueDate: data.dueDate,
      status: 'Unpaid',
      history: []
    };
    db.fees.push(newFee);
    saveDB(db);
    return newFee;
  },

  updateStudent: async (studentUserId, updatedData) => {
    const db = getDB();
    const studentIdx = db.students.findIndex(s => s.userId === studentUserId);
    if (studentIdx === -1) throw new Error('Student record not found.');

    const userIdx = db.users.findIndex(u => u.id === studentUserId);
    if (userIdx === -1) throw new Error('Student user account not found.');

    // Check email uniqueness if email is being changed
    const currentEmail = db.users[userIdx].email;
    if (updatedData.email && updatedData.email !== currentEmail) {
      const emailTaken = db.users.find(u => u.email === updatedData.email && u.id !== studentUserId);
      if (emailTaken) throw new Error('Email address is already in use by another account.');
    }

    // Update user auth record
    if (updatedData.email) db.users[userIdx].email = updatedData.email;
    if (updatedData.status) db.users[userIdx].status = updatedData.status;
    if (updatedData.password && updatedData.password.trim() !== '') {
      db.users[userIdx].password = updatedData.password;
    }

    // Update student profile record
    const { email, password, confirmPassword, ...profileData } = updatedData;
    db.students[studentIdx] = {
      ...db.students[studentIdx],
      ...profileData,
    };

    saveDB(db);
    const user = db.users[userIdx];
    return { ...db.students[studentIdx], email: user.email, status: user.status };
  },

  updateTutor: async (tutorUserId, updatedData) => {
    const db = getDB();
    const tutorIdx = db.tutors.findIndex(t => t.userId === tutorUserId);
    if (tutorIdx === -1) throw new Error('Tutor record not found.');

    const userIdx = db.users.findIndex(u => u.id === tutorUserId);
    if (userIdx === -1) throw new Error('Tutor user account not found.');

    // Check email uniqueness if email is being changed
    const currentEmail = db.users[userIdx].email;
    if (updatedData.email && updatedData.email !== currentEmail) {
      const emailTaken = db.users.find(u => u.email === updatedData.email && u.id !== tutorUserId);
      if (emailTaken) throw new Error('Email address is already in use by another account.');
    }

    // Update user auth record
    if (updatedData.email) db.users[userIdx].email = updatedData.email;
    if (updatedData.status) db.users[userIdx].status = updatedData.status;
    if (updatedData.password && updatedData.password.trim() !== '') {
      db.users[userIdx].password = updatedData.password;
    }

    // Update tutor profile record (exclude auth-only fields)
    const { email, password, confirmPassword, ...profileData } = updatedData;
    db.tutors[tutorIdx] = {
      ...db.tutors[tutorIdx],
      ...profileData,
    };

    saveDB(db);
    const user = db.users[userIdx];
    return { ...db.tutors[tutorIdx], email: user.email, status: user.status };
  },

  checkAdminExists: () => {
    const db = getDB();
    return db.users.some(u => u.role === 'admin');
  },

  createAdmin: async (adminData) => {
    const db = getDB();
    if (db.users.find(u => u.email === adminData.email)) {
      throw new Error('This email address is already in use.');
    }

    const userId = 'u' + generateId();
    const newUser = {
      id: userId,
      role: 'admin',
      email: adminData.email,
      password: adminData.password,
      status: 'Active',
      name: adminData.name,
      academyName: adminData.academyName,
      phone: adminData.phone || '',
    };
    db.users.push(newUser);
    saveDB(db);
    return newUser;
  },

  getAdvancedStats: async () => {
    const db = getDB();
    const totalStudents = db.students.length;
    const totalTutors = db.tutors.length;
    const activeStudents = db.students.filter(s => {
      const u = db.users.find(u => u.id === s.userId);
      return u?.status === 'Active';
    }).length;

    // Attendance stats
    const totalAtt = db.attendance.length;
    const presentAtt = db.attendance.filter(a => a.status === 'Present').length;
    const attRate = totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 100) : 100;

    // Homework stats
    const totalHw = db.homework.length;
    const completedHw = db.homework.filter(h => h.status === 'Completed').length;
    const hwRate = totalHw > 0 ? Math.round((completedHw / totalHw) * 100) : 100;

    // Fee stats
    const totalDue = db.fees.reduce((sum, f) => sum + f.totalAmount, 0);
    const totalPaid = db.fees.reduce((sum, f) => sum + f.paidAmount, 0);

    // At-risk students (< 70% attendance OR missing homework > 2)
    const atRiskStudentIds = new Set();
    db.students.forEach(student => {
      const sAtt = db.attendance.filter(a => a.studentId === student.userId);
      const sPresent = sAtt.filter(a => a.status === 'Present').length;
      const attPct = sAtt.length > 0 ? (sPresent / sAtt.length) * 100 : 100;
      const missingHw = db.homework.filter(h => h.studentId === student.userId && h.status === 'Missing').length;
      const noRecentLog = !db.progressLogs.find(l => l.studentId === student.userId &&
        new Date(l.date) > new Date(Date.now() - 14 * 86400000));
      if (attPct < 70 || missingHw > 2 || noRecentLog) atRiskStudentIds.add(student.userId);
    });

    // Subject distribution
    const subjectMap = {};
    db.students.forEach(s => {
      (s.subjects || []).forEach(sub => {
        subjectMap[sub] = (subjectMap[sub] || 0) + 1;
      });
    });
    const subjectDistribution = Object.entries(subjectMap).map(([name, count]) => ({ name, count }));

    // Monthly attendance trend (last 6 months)
    const monthlyAtt = {};
    db.attendance.forEach(a => {
      const month = a.date?.substring(0, 7);
      if (month) {
        if (!monthlyAtt[month]) monthlyAtt[month] = { present: 0, total: 0 };
        monthlyAtt[month].total++;
        if (a.status === 'Present') monthlyAtt[month].present++;
      }
    });
    const attendanceTrend = Object.entries(monthlyAtt)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, data]) => ({
        month,
        rate: Math.round((data.present / data.total) * 100)
      }));

    return {
      totalStudents,
      totalTutors,
      activeStudents,
      attRate,
      hwRate,
      totalDue,
      totalPaid,
      atRiskCount: atRiskStudentIds.size,
      subjectDistribution,
      attendanceTrend,
      recentActivity: db.progressLogs.slice(-8).reverse()
    };
  }
};
