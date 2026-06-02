import { useState, useEffect, useCallback } from 'react';
import studentApi from '../services/studentApi.js';
import ConfirmDialog from './ConfirmDialog.jsx';

function StudentList({ onCreateNew, onEdit }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentApi.getStudents(page, 10, search);
      setStudents(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await studentApi.deleteStudent(deleteTarget.id);
      setDeleteTarget(null);
      fetchStudents();
    } catch (err) {
      setError(err.message || 'Failed to delete student');
      setDeleteTarget(null);
    }
  };

  const handleExport = async () => {
    try {
      await studentApi.exportToExcel();
    } catch (err) {
      setError(err.message || 'Failed to export');
    }
  };

  return (
    <div>
      <div className="toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name or email..."
          value={search}
          onChange={handleSearchChange}
        />
        <div className="toolbar-actions">
          <button className="btn btn-success" onClick={handleExport}>
            Export Excel
          </button>
          <button className="btn btn-primary" onClick={onCreateNew}>
            + Add Student
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading students...</div>
      ) : students.length === 0 ? (
        <div className="empty-state">
          <p>No students found.</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Date of Birth</th>
                  <th>Enrollment Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>{student.email}</td>
                    <td>{student.dateOfBirth || '-'}</td>
                    <td>{student.enrollmentDate}</td>
                    <td>
                      <span className={`badge ${student.active ? 'badge-active' : 'badge-inactive'}`}>
                        {student.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onEdit(student)}
                        style={{ marginRight: '0.5rem' }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteTarget(student)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              className="btn btn-secondary btn-sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span>
              Page {page + 1} of {totalPages} ({totalElements} total)
            </span>
            <button
              className="btn btn-secondary btn-sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Student"
          message={`Are you sure you want to delete ${deleteTarget.firstName} ${deleteTarget.lastName}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

export default StudentList;
