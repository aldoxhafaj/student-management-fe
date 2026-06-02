const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Centralized API service for student operations.
 */
const studentApi = {
  async getStudents(page = 0, size = 10, search = '', sortBy = 'id', sortDir = 'asc') {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir,
    });
    if (search) params.append('search', search);

    const response = await fetch(`${API_BASE_URL}/students?${params}`);
    if (!response.ok) throw await parseError(response);
    return response.json();
  },

  async getStudentById(id) {
    const response = await fetch(`${API_BASE_URL}/students/${id}`);
    if (!response.ok) throw await parseError(response);
    return response.json();
  },

  async createStudent(data) {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw await parseError(response);
    return response.json();
  },

  async updateStudent(id, data) {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw await parseError(response);
    return response.json();
  },

  async deleteStudent(id) {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw await parseError(response);
  },

  async exportToExcel() {
    const response = await fetch(`${API_BASE_URL}/students/export`);
    if (!response.ok) throw await parseError(response);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'students.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

async function parseError(response) {
  try {
    const data = await response.json();
    return { status: response.status, ...data };
  } catch {
    return { status: response.status, message: 'An unexpected error occurred' };
  }
}

export default studentApi;
