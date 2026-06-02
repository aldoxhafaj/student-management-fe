import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StudentForm from '../components/StudentForm.jsx';

describe('StudentForm', () => {
  it('renders create form when no student provided', () => {
    render(<StudentForm student={null} onSuccess={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Create Student' })).toBeInTheDocument();
  });

  it('renders edit form when student provided', () => {
    const student = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      dateOfBirth: '2000-01-01',
      enrollmentDate: '2023-09-01',
      active: true,
    };
    render(<StudentForm student={student} onSuccess={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Edit Student' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    render(<StudentForm student={null} onSuccess={vi.fn()} onCancel={vi.fn()} />);

    const submitButton = screen.getByRole('button', { name: 'Create Student' });
    fireEvent.click(submitButton);

    expect(await screen.findByText('First name is required')).toBeInTheDocument();
    expect(screen.getByText('Last name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button clicked', () => {
    const onCancel = vi.fn();
    render(<StudentForm student={null} onSuccess={vi.fn()} onCancel={onCancel} />);

    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });
});
