/**
 * Main Application Logic for Student & Course Management System (Multi-Page HTML)
 * Supports index.html (Dashboard), students.html (Directory), and courses.html (Curriculum).
 */

$(document).ready(async function () {
  let currentDeleteType = null;
  let currentDeleteId = null;

  // Check backend server connection silently
  await API.checkServer();

  // Initialize Page Elements based on presence
  if ($('#statTotalStudents').length) {
    await loadDashboardStats();
    await renderRecentStudents();
  }

  if ($('#studentsTableBody').length) {
    await renderStudentsTable();
    await populateCourseDropdown();
  }

  if ($('#coursesTableBody').length) {
    await renderCoursesTable();
  }

  // ---------------- DASHBOARD STATS ----------------
  async function loadDashboardStats() {
    const students = await API.getStudents();
    const courses = await API.getCourses();

    $('#statTotalStudents').text(students.length);
    const activeCount = students.filter(s => s.status === 'Active').length;
    $('#statActiveStudents').text(activeCount);
    $('#statTotalCourses').text(courses.length);

    const depts = new Set(students.map(s => s.department));
    $('#statTotalDepartments').text(depts.size || 0);
  }

  // Render recent 5 students on dashboard
  async function renderRecentStudents() {
    const $tbody = $('#recentStudentsTableBody');
    if (!$tbody.length) return;
    const students = await API.getStudents();
    $tbody.empty();

    students.slice(-5).reverse().forEach((student, index) => {
      const statusBadge = student.status === 'Active'
        ? '<span class="badge-active"><i class="bi bi-check-circle-fill me-1"></i>Active</span>'
        : '<span class="badge-inactive"><i class="bi bi-x-circle-fill me-1"></i>Inactive</span>';

      $tbody.append(`
        <tr>
          <td class="fw-semibold text-secondary">${index + 1}</td>
          <td><strong>${student.name}</strong><br><small class="text-muted">${student.email}</small></td>
          <td><span class="badge bg-light text-dark border">${student.rollNo}</span></td>
          <td>${student.department}</td>
          <td>${student.course}</td>
          <td>${statusBadge}</td>
        </tr>
      `);
    });
  }

  // ---------------- STUDENTS MANAGEMENT ----------------
  async function renderStudentsTable(filterText = '', deptFilter = '') {
    const $tbody = $('#studentsTableBody');
    if (!$tbody.length) return;
    const students = await API.getStudents();
    $tbody.empty();

    const filtered = students.filter(s => {
      const matchText = (s.name + s.email + s.rollNo + s.course)
        .toLowerCase()
        .includes(filterText.toLowerCase());
      const matchDept = deptFilter ? s.department === deptFilter : true;
      return matchText && matchDept;
    });

    if (filtered.length === 0) {
      $tbody.html(`
        <tr>
          <td colspan="7" class="text-center py-4 text-muted">
            <i class="bi bi-inbox fs-2 d-block mb-2"></i>
            No student records found matching the criteria.
          </td>
        </tr>
      `);
      return;
    }

    filtered.forEach((student, index) => {
      const statusBadge = student.status === 'Active'
        ? '<span class="badge-active"><i class="bi bi-check-circle-fill me-1"></i>Active</span>'
        : '<span class="badge-inactive"><i class="bi bi-x-circle-fill me-1"></i>Inactive</span>';

      const row = `
        <tr>
          <td class="fw-semibold text-secondary">${index + 1}</td>
          <td>
            <div class="fw-bold text-dark">${student.name}</div>
            <small class="text-muted">${student.email}</small>
          </td>
          <td><span class="badge bg-light text-dark border">${student.rollNo}</span></td>
          <td>${student.department} <br><small class="text-muted">${student.year}</small></td>
          <td><span class="text-primary fw-medium">${student.course}</span></td>
          <td>${statusBadge}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary btn-action edit-student-btn" data-id="${student.id}">
              <i class="bi bi-pencil-square"></i> Edit
            </button>
            <button class="btn btn-sm btn-outline-danger btn-action delete-student-btn" data-id="${student.id}" data-name="${student.name}">
              <i class="bi bi-trash"></i> Delete
            </button>
          </td>
        </tr>
      `;
      $tbody.append(row);
    });
  }

  // Populate course dropdown in the student form
  async function populateCourseDropdown() {
    const $select = $('#studentCourse');
    if (!$select.length) return;
    const courses = await API.getCourses();
    $select.empty().append('<option value="">-- Select Enrolled Course --</option>');
    courses.forEach(c => {
      $select.append(`<option value="${c.title}">${c.title} (${c.courseCode})</option>`);
    });
  }

  // Live Search & Filter for Students
  $('#searchStudentInput, #filterDepartmentSelect').on('input change', function () {
    const searchVal = $('#searchStudentInput').val();
    const deptVal = $('#filterDepartmentSelect').val();
    renderStudentsTable(searchVal, deptVal);
  });

  // Open Add Student Modal
  $('#btnOpenAddStudent').on('click', async function () {
    $('#studentModalTitle').text('Add New Student');
    $('#studentForm')[0].reset();
    $('#studentId').val('');
    $('#studentForm').removeClass('was-validated');
    await populateCourseDropdown();
    const modal = new bootstrap.Modal(document.getElementById('studentModal'));
    modal.show();
  });

  // Open Edit Student Modal
  $(document).on('click', '.edit-student-btn', async function () {
    const id = $(this).data('id');
    const students = await API.getStudents();
    const student = students.find(s => String(s.id) === String(id));

    if (student) {
      $('#studentModalTitle').text('Edit Student Record');
      $('#studentId').val(student.id);
      $('#studentName').val(student.name);
      $('#studentEmail').val(student.email);
      $('#studentRollNo').val(student.rollNo);
      $('#studentDepartment').val(student.department);
      $('#studentYear').val(student.year);
      await populateCourseDropdown();
      $('#studentCourse').val(student.course);
      $('#studentStatus').val(student.status);

      $('#studentForm').removeClass('was-validated');
      const modal = new bootstrap.Modal(document.getElementById('studentModal'));
      modal.show();
    }
  });

  // Save Student (Create or Update)
  $('#studentForm').on('submit', async function (e) {
    e.preventDefault();
    const form = this;

    if (!form.checkValidity()) {
      e.stopPropagation();
      $(form).addClass('was-validated');
      return;
    }

    const id = $('#studentId').val();
    const studentData = {
      name: $('#studentName').val().trim(),
      email: $('#studentEmail').val().trim(),
      rollNo: $('#studentRollNo').val().trim(),
      department: $('#studentDepartment').val(),
      year: $('#studentYear').val(),
      course: $('#studentCourse').val(),
      status: $('#studentStatus').val()
    };

    try {
      if (id) {
        await API.updateStudent(id, studentData);
        showToast('Student record updated successfully!', 'success');
      } else {
        await API.addStudent(studentData);
        showToast('New student added successfully!', 'success');
      }
      bootstrap.Modal.getInstance(document.getElementById('studentModal')).hide();
      await renderStudentsTable();
      if ($('#statTotalStudents').length) await loadDashboardStats();
    } catch (err) {
      showToast('Error saving student record.', 'danger');
    }
  });

  // ---------------- COURSES MANAGEMENT ----------------
  async function renderCoursesTable() {
    const $tbody = $('#coursesTableBody');
    if (!$tbody.length) return;
    const courses = await API.getCourses();
    $tbody.empty();

    if (courses.length === 0) {
      $tbody.html(`
        <tr>
          <td colspan="6" class="text-center py-4 text-muted">
            <i class="bi bi-book fs-2 d-block mb-2"></i> No courses available.
          </td>
        </tr>
      `);
      return;
    }

    courses.forEach((course, index) => {
      const row = `
        <tr>
          <td class="fw-semibold text-secondary">${index + 1}</td>
          <td><span class="badge bg-primary-subtle text-primary border border-primary-subtle">${course.courseCode}</span></td>
          <td class="fw-bold">${course.title}</td>
          <td>${course.instructor}</td>
          <td>${course.credits} Credits</td>
          <td>
            <button class="btn btn-sm btn-outline-primary btn-action edit-course-btn" data-id="${course.id}">
              <i class="bi bi-pencil-square"></i> Edit
            </button>
            <button class="btn btn-sm btn-outline-danger btn-action delete-course-btn" data-id="${course.id}" data-title="${course.title}">
              <i class="bi bi-trash"></i> Delete
            </button>
          </td>
        </tr>
      `;
      $tbody.append(row);
    });
  }

  // Open Add Course Modal
  $('#btnOpenAddCourse').on('click', function () {
    $('#courseModalTitle').text('Add New Course');
    $('#courseForm')[0].reset();
    $('#courseId').val('');
    $('#courseForm').removeClass('was-validated');
    const modal = new bootstrap.Modal(document.getElementById('courseModal'));
    modal.show();
  });

  // Open Edit Course Modal
  $(document).on('click', '.edit-course-btn', async function () {
    const id = $(this).data('id');
    const courses = await API.getCourses();
    const course = courses.find(c => String(c.id) === String(id));

    if (course) {
      $('#courseModalTitle').text('Edit Course Details');
      $('#courseId').val(course.id);
      $('#courseCode').val(course.courseCode);
      $('#courseTitle').val(course.title);
      $('#courseInstructor').val(course.instructor);
      $('#courseCredits').val(course.credits);
      $('#courseDepartment').val(course.department);

      $('#courseForm').removeClass('was-validated');
      const modal = new bootstrap.Modal(document.getElementById('courseModal'));
      modal.show();
    }
  });

  // Save Course (Create or Update)
  $('#courseForm').on('submit', async function (e) {
    e.preventDefault();
    const form = this;

    if (!form.checkValidity()) {
      e.stopPropagation();
      $(form).addClass('was-validated');
      return;
    }

    const id = $('#courseId').val();
    const courseData = {
      courseCode: $('#courseCode').val().trim(),
      title: $('#courseTitle').val().trim(),
      instructor: $('#courseInstructor').val().trim(),
      credits: parseInt($('#courseCredits').val()),
      department: $('#courseDepartment').val()
    };

    try {
      if (id) {
        await API.updateCourse(id, courseData);
        showToast('Course updated successfully!', 'success');
      } else {
        await API.addCourse(courseData);
        showToast('New course added successfully!', 'success');
      }
      bootstrap.Modal.getInstance(document.getElementById('courseModal')).hide();
      await renderCoursesTable();
      await populateCourseDropdown();
      if ($('#statTotalStudents').length) await loadDashboardStats();
    } catch (err) {
      showToast('Error saving course.', 'danger');
    }
  });

  // ---------------- DELETE DIALOG ----------------
  $(document).on('click', '.delete-student-btn', function () {
    currentDeleteType = 'student';
    currentDeleteId = $(this).data('id');
    const name = $(this).data('name');
    $('#deleteModalItemName').text(`student "${name}"`);
    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    modal.show();
  });

  $(document).on('click', '.delete-course-btn', function () {
    currentDeleteType = 'course';
    currentDeleteId = $(this).data('id');
    const title = $(this).data('title');
    $('#deleteModalItemName').text(`course "${title}"`);
    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    modal.show();
  });

  $('#btnConfirmDelete').on('click', async function () {
    try {
      if (currentDeleteType === 'student') {
        await API.deleteStudent(currentDeleteId);
        showToast('Student deleted successfully.', 'success');
        await renderStudentsTable();
      } else if (currentDeleteType === 'course') {
        await API.deleteCourse(currentDeleteId);
        showToast('Course deleted successfully.', 'success');
        await renderCoursesTable();
        await populateCourseDropdown();
      }
      if ($('#statTotalStudents').length) await loadDashboardStats();
      bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal')).hide();
    } catch (err) {
      showToast('Failed to delete item.', 'danger');
    }
  });

  // ---------------- TOAST NOTIFICATION ----------------
  function showToast(message, type = 'info') {
    const $toast = $('#appToast');
    const $toastBody = $('#toastMessage');
    if (!$toast.length) return;
    $toast.removeClass('bg-success bg-danger bg-info text-white');

    if (type === 'success') {
      $toast.addClass('bg-success text-white');
    } else if (type === 'danger') {
      $toast.addClass('bg-danger text-white');
    } else {
      $toast.addClass('bg-info text-white');
    }

    $toastBody.text(message);
    const toastInstance = new bootstrap.Toast(document.getElementById('appToast'));
    toastInstance.show();
  }
});
