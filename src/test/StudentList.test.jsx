import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StudentList from '../components/StudentList.jsx';

vi.mock('../services/studentApi.js', () => ({
  default: {
    getStudents: vi.fn().mockResolvedValue({
      content: [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@test.com',
          dateOfBirth: '2000-01-01',
          enrollmentDate: '2023-09-01',
          active: true,
        },
      ],
      page: 0,
      size: 10,
      totalElements: 1,
      totalPages: 1,
      last: true,
    }),
    deleteStudent: vi.fn().mockResolvedValue(undefined),
    exportToExcel: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('StudentList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders student data after loading', async () => {
    render(<StudentList onCreateNew={vi.fn()} onEdit={vi.fn()} />);

    expect(await screen.findByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('john@test.com')).toBeInTheDocument();
  });

  it('renders add student button', () => {
    render(<StudentList onCreateNew={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText('+ Add Student')).toBeInTheDocument();
  });

  it('renders export button', () => {
    render(<StudentList onCreateNew={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText('Export Excel')).toBeInTheDocument();
  });
});
