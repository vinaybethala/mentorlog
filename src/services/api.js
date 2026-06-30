

// Simple id generator
const generateId = () => Math.random().toString(36).substring(2, 9);

// Initial Seed Data
const seedData = {
  users: [
    { id: '1', role: 'admin', email: 'admin@mentorlog.com', password: 'password', name: 'Academy Admin' },
    { id: '2', role: 'tutor', email: 'tutor1@mentorlog.com', password: 'password', name: 'John Doe', age: 30, subjects: ['Math', 'Science'], status: 'Active' },
    { id: '3', role: 'student', email: 'student1@mentorlog.com', password: 'password', name: 'Alice Smith', class: 'Grade 10', subjects: ['Math', 'Science'], parentContact: '555-0101' },
  ],
  students: [
    { id: '3', name: 'Alice Smith', class: 'Grade 10', subjects: ['Math', 'Science'], email: 'student1@mentorlog.com', parentContact: '555-0101', enrollmentDate: '2023-09-01', status: 'Active' },
  ],
  tutors: [
    { id: '2', name: 'John Doe', age: 30, subjects: ['Math', 'Science'], email: 'tutor1@mentorlog.com', bankDetails: 'Bank of America - 1234', contact: '555-0202', status: 'Active' },
  ],
  progressLogs: [
    { id: 'log1', studentId: '3', tutorId: '2', subject: 'Math', topic: 'Algebra Basics', type: 'homework done', remarks: 'Good grasp on concepts. Needs practice with quadratic equations.', date: new Date(Date.now() - 86400000).toISOString() }
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
    const user = db.users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error("Invalid credentials");
    // Return mock token and user details
    return { token: 'mock-jwt-token-' + user.id, user };
  },

  // Students
  getStudents: async () => getDB().students,
  getStudentById: async (id) => getDB().students.find(s => s.id === id),
  createStudent: async (studentData) => {
    const db = getDB();
    const id = generateId();
    const newStudent = { ...studentData, id, status: 'Active', enrollmentDate: new Date().toISOString() };
    db.students.push(newStudent);
    db.users.push({ id, role: 'student', email: studentData.email, password: studentData.password || 'password123', name: studentData.name });
    saveDB(db);
    return newStudent;
  },
  
  // Tutors
  getTutors: async () => getDB().tutors,
  createTutor: async (tutorData) => {
    const db = getDB();
    const id = generateId();
    const newTutor = { ...tutorData, id, status: 'Active' };
    db.tutors.push(newTutor);
    db.users.push({ id, role: 'tutor', email: tutorData.email, password: tutorData.password || 'password123', name: tutorData.name });
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
