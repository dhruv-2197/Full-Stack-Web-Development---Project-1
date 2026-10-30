/**
 * API Service for Student & Course Management System
 * Connects to JSON Server (http://localhost:3000) with automatic LocalStorage fallback.
 */

const API_BASE_URL = 'http://localhost:3000';

// Seed data used if running without active JSON Server
const SEED_DATA = {
  students: [
    {
      id: "1",
      name: "Aarav Sharma",
      email: "aarav.sharma@college.edu",
      rollNo: "2024CS101",
      department: "Computer Science",
      year: "3rd Year",
      course: "Full Stack Web Development",
      status: "Active"
    },
    {
      id: "2",
      name: "Diya Patel",
      email: "diya.patel@college.edu",
      rollNo: "2024IT105",
      department: "Information Technology",
      year: "2nd Year",
      course: "Database Management Systems",
      status: "Active"
    },
    {
      id: "3",
      name: "Rohan Verma",
      email: "rohan.verma@college.edu",
      rollNo: "2024EC112",
      department: "Electronics",
      year: "3rd Year",
      course: "Internet of Things & Embedded Systems",
      status: "Active"
    },
    {
      id: "4",
      name: "Ananya Iyer",
      email: "ananya.iyer@college.edu",
      rollNo: "2024CS145",
      department: "Computer Science",
      year: "4th Year",
      course: "Cloud Computing & DevOps",
      status: "Inactive"
    }
  ],
  courses: [
    {
      id: "1",
      courseCode: "CS301",
      title: "Full Stack Web Development",
      instructor: "Dr. Rajesh K.",
      credits: 4,
      department: "Computer Science"
    },
    {
      id: "2",
      courseCode: "IT204",
      title: "Database Management Systems",
      instructor: "Prof. Meenakshi S.",
      credits: 3,
      department: "Information Technology"
    },
    {
      id: "3",
      courseCode: "EC305",
      title: "Internet of Things & Embedded Systems",
      instructor: "Dr. Sunil Rao",
      credits: 4,
      department: "Electronics"
    },
    {
      id: "4",
      courseCode: "CS402",
      title: "Cloud Computing & DevOps",
      instructor: "Prof. Anita Sen",
      credits: 3,
      department: "Computer Science"
    }
  ]
};

// Check and initialize LocalStorage fallback
function initStorage() {
  if (!localStorage.getItem('p1_students')) {
    localStorage.setItem('p1_students', JSON.stringify(SEED_DATA.students));
  }
  if (!localStorage.getItem('p1_courses')) {
    localStorage.setItem('p1_courses', JSON.stringify(SEED_DATA.courses));
  }
}
initStorage();

const API = {
  isServerActive: false,

  // Probe server connectivity
  async checkServer() {
    try {
      const res = await fetch(`${API_BASE_URL}/students`, { method: 'GET', cache: 'no-store' });
      this.isServerActive = res.ok;
    } catch (e) {
      this.isServerActive = false;
    }
    return this.isServerActive;
  },

  // ---------------- STUDENTS CRUD ----------------
  async getStudents() {
    if (this.isServerActive) {
      try {
        const res = await fetch(`${API_BASE_URL}/students`);
        if (!res.ok) throw new Error('Network error');
        return await res.json();
      } catch (err) {
        console.warn('Falling back to localStorage for getStudents', err);
      }
    }
    return JSON.parse(localStorage.getItem('p1_students') || '[]');
  },

  async addStudent(student) {
    if (this.isServerActive) {
      try {
        const res = await fetch(`${API_BASE_URL}/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(student)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Falling back to localStorage for addStudent', err);
      }
    }
    const list = JSON.parse(localStorage.getItem('p1_students') || '[]');
    const newStudent = { ...student, id: String(Date.now()) };
    list.push(newStudent);
    localStorage.setItem('p1_students', JSON.stringify(list));
    return newStudent;
  },

  async updateStudent(id, studentData) {
    if (this.isServerActive) {
      try {
        const res = await fetch(`${API_BASE_URL}/students/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Falling back to localStorage for updateStudent', err);
      }
    }
    const list = JSON.parse(localStorage.getItem('p1_students') || '[]');
    const index = list.findIndex(s => String(s.id) === String(id));
    if (index !== -1) {
      list[index] = { ...studentData, id: String(id) };
      localStorage.setItem('p1_students', JSON.stringify(list));
      return list[index];
    }
    throw new Error('Student not found');
  },

  async deleteStudent(id) {
    if (this.isServerActive) {
      try {
        const res = await fetch(`${API_BASE_URL}/students/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) return true;
      } catch (err) {
        console.warn('Falling back to localStorage for deleteStudent', err);
      }
    }
    let list = JSON.parse(localStorage.getItem('p1_students') || '[]');
    list = list.filter(s => String(s.id) !== String(id));
    localStorage.setItem('p1_students', JSON.stringify(list));
    return true;
  },

  // ---------------- COURSES CRUD ----------------
  async getCourses() {
    if (this.isServerActive) {
      try {
        const res = await fetch(`${API_BASE_URL}/courses`);
        if (!res.ok) throw new Error('Network error');
        return await res.json();
      } catch (err) {
        console.warn('Falling back to localStorage for getCourses', err);
      }
    }
    return JSON.parse(localStorage.getItem('p1_courses') || '[]');
  },

  async addCourse(course) {
    if (this.isServerActive) {
      try {
        const res = await fetch(`${API_BASE_URL}/courses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(course)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Falling back to localStorage for addCourse', err);
      }
    }
    const list = JSON.parse(localStorage.getItem('p1_courses') || '[]');
    const newCourse = { ...course, id: String(Date.now()) };
    list.push(newCourse);
    localStorage.setItem('p1_courses', JSON.stringify(list));
    return newCourse;
  },

  async updateCourse(id, courseData) {
    if (this.isServerActive) {
      try {
        const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(courseData)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Falling back to localStorage for updateCourse', err);
      }
    }
    const list = JSON.parse(localStorage.getItem('p1_courses') || '[]');
    const index = list.findIndex(c => String(c.id) === String(id));
    if (index !== -1) {
      list[index] = { ...courseData, id: String(id) };
      localStorage.setItem('p1_courses', JSON.stringify(list));
      return list[index];
    }
    throw new Error('Course not found');
  },

  async deleteCourse(id) {
    if (this.isServerActive) {
      try {
        const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) return true;
      } catch (err) {
        console.warn('Falling back to localStorage for deleteCourse', err);
      }
    }
    let list = JSON.parse(localStorage.getItem('p1_courses') || '[]');
    list = list.filter(c => String(c.id) !== String(id));
    localStorage.setItem('p1_courses', JSON.stringify(list));
    return true;
  }
};
