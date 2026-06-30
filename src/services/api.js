// Simple id generator
const generateId = () => Math.random().toString(36).substring(2, 9);

// Initial Seed Data
const seedData = {
  users: [
    { id: 'u1', role: 'admin', email: 'admin@mentorlog.com', password: 'password', status: 'Active' },
    { id: 'u2', role: 'tutor', email: 'tutor1@mentorlog.com', password: 'password', status: 'Active' },
    { id: 'u3', role: 'student', email: 'student1@mentorlog.com', password: 'password', status: 'Active' },
  ],
  students: [
    { 
      id: 's1', userId: 'u3', name: 'Alice Smith', 
      age: '15', dob: '2011-05-12', gender: 'Female', 
      class: 'Grade 10', subjects: ['Math', 'Science'], 
      parentName: 'Bob Smith', parentContact: '555-0101', parentEmail: 'bob@example.com',
      address: '123 Main St', admissionDate: '2023-09-01' 
    },
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
  ]
};

// Initialize LocalStorage
const initializeDB = () => {
  if (!localStorage.getItem('mentorlog_db')) {
    localStorage.setItem('mentorlog_db', JSON.stringify(seedData));
  }
};

const getDB = () => {
  initializeDB();
  return JSON.parse(localStorage.getItem('mentorlog_db'));
};

const saveDB = (data) => {
  localStorage.setItem('mentorlog_db', JSON.stringify(data));
};

export const api = {
  // Auth
  login: async (email, password) => {
    const db = getDB();
    const user = db.users.find(u => u.email === email);
    
    if (!user) throw new Error("Invalid email or password");
    if (user.password !== password) throw new Error("Invalid email or password");
    if (user.status !== 'Active') throw new Error("Your account is currently inactive. Please contact admin.");
    
    // Fetch profile data based on role
    let profile = { name: email.split('@')[0] }; // fallback
    if (user.role === 'student') {
      const p = db.students.find(s => s.userId === user.id);
      if (p) profile = p;
    } else if (user.role === 'tutor') {
      const p = db.tutors.find(t => t.userId === user.id);
      if (p) profile = p;
    } else if (user.role === 'admin') {
      profile = { name: 'Academy Admin' };
    }

    const userData = { ...user, ...profile, id: user.id };
    return { token: 'mock-jwt-token-' + user.id, user: userData };
  },

  // Students
  getStudents: async () => {
    const db = getDB();
    // Join with users table to get email and status
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
    
    // Validation: Email uniqueness
    if (db.users.find(u => u.email === studentData.email)) {
      throw new Error("Email address is already in use.");
    }

    const userId = 'u' + generateId();
    const studentId = 's' + generateId();

    // Create User
    db.users.push({
      id: userId,
      role: 'student',
      email: studentData.email,
      password: studentData.password,
      status: studentData.status || 'Active'
    });

    // Create Profile
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
    saveDB(db);
    return newStudent;
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
    
    // Validation: Email uniqueness
    if (db.users.find(u => u.email === tutorData.email)) {
      throw new Error("Email address is already in use.");
    }

    const userId = 'u' + generateId();
    const tutorId = 't' + generateId();

    // Create User
    db.users.push({
      id: userId,
      role: 'tutor',
      email: tutorData.email,
      password: tutorData.password,
      status: tutorData.status || 'Active'
    });

    // Create Profile
    const newTutor = {
      id: tutorId,
      userId: userId,
      name: tutorData.name,
      age: tutorData.age,
      dob: tutorData.dob,
      gender: tutorData.gender,
      contact: tutorData.contact,
      subjects: tutorData.subjects || [],
      qualification: tutorData.qualification,
      experience: tutorData.experience,
      address: tutorData.address,
      bankName: tutorData.bankName,
      bankAccount: tutorData.bankAccount,
      ifsc: tutorData.ifsc,
      branch: tutorData.branch,
      joiningDate: tutorData.joiningDate || new Date().toISOString().split('T')[0],
      salaryType: tutorData.salaryType
    };

    db.tutors.push(newTutor);
    saveDB(db);
    return newTutor;
  },

  // Progress Logs
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
    saveDB(db);
    return newLog;
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
  }
};
