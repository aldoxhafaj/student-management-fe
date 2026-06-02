import { useState } from 'react';
import StudentList from './components/StudentList.jsx';
import StudentForm from './components/StudentForm.jsx';

function App() {
  const [view, setView] = useState('list');
  const [editingStudent, setEditingStudent] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateNew = () => {
    setEditingStudent(null);
    setView('form');
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setView('form');
  };

  const handleFormSuccess = () => {
    setView('list');
    setEditingStudent(null);
    setRefreshKey((k) => k + 1);
  };

  const handleCancel = () => {
    setView('list');
    setEditingStudent(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Student Management System</h1>
      </header>

      {view === 'list' && (
        <StudentList
          key={refreshKey}
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
        />
      )}

      {view === 'form' && (
        <StudentForm
          student={editingStudent}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default App;
