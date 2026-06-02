import { useState } from 'react';
import studentApi from '../services/studentApi.js';

function StudentForm({ student, onSuccess, onCancel }) {
  const isEditing = !!student;

  const [formData, setFormData] = useState({
    firstName: student?.firstName || '',
    lastName: student?.lastName || '',
    email: student?.email || '',
    dateOfBirth: student?.dateOfBirth || '',
    enrollmentDate: student?.enrollmentDate || '',
    active: student?.active ?? true,
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Email must be valid';
    if (!formData.enrollmentDate) newErrors.enrollmentDate = 'Enrollment date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError(null);

    try {
      const payload = {
        ...formData,
        dateOfBirth: formData.dateOfBirth || null,
      };

      if (isEditing) {
        await studentApi.updateStudent(student.id, payload);
      } else {
        await studentApi.createStudent(payload);
      }
      onSuccess();
    } catch (err) {
      if (err.fieldErrors) {
        const fieldErrs = {};
        err.fieldErrors.forEach((fe) => {
          fieldErrs[fe.field] = fe.message;
        });
        setErrors(fieldErrs);
      } else {
        setApiError(err.message || 'An error occurred');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{isEditing ? 'Edit Student' : 'Create Student'}</h2>

      {apiError && <div className="error-message">{apiError}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <div className="field-error">{errors.firstName}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <div className="field-error">{errors.lastName}</div>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
            {errors.dateOfBirth && <div className="field-error">{errors.dateOfBirth}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="enrollmentDate">Enrollment Date *</label>
            <input
              id="enrollmentDate"
              name="enrollmentDate"
              type="date"
              value={formData.enrollmentDate}
              onChange={handleChange}
            />
            {errors.enrollmentDate && <div className="field-error">{errors.enrollmentDate}</div>}
          </div>
        </div>

        <div className="form-group">
          <label>
            <input
              name="active"
              type="checkbox"
              checked={formData.active}
              onChange={handleChange}
              style={{ marginRight: '0.5rem' }}
            />
            Active
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : isEditing ? 'Update Student' : 'Create Student'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default StudentForm;
