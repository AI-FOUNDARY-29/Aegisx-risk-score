import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';

describe('Sidebar Component', () => {
  const mockToggleTheme = vi.fn();
  const mockOnLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSidebar = (theme = 'dark') => {
    render(
      <MemoryRouter>
        <Sidebar theme={theme} toggleTheme={mockToggleTheme} onLogout={mockOnLogout} />
      </MemoryRouter>
    );
  };

  it('renders the logo and all navigation links', () => {
    renderSidebar();
    expect(screen.getByText('AegisX')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Threat History')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls toggleTheme when the theme button is clicked', () => {
    renderSidebar();
    const themeBtn = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(themeBtn);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('calls onLogout when the logout button is clicked', () => {
    renderSidebar();
    const logoutBtn = screen.getByText('Logout');
    fireEvent.click(logoutBtn);
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });
});
