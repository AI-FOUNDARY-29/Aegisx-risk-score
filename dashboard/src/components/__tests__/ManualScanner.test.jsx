import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ManualScanner from '../ManualScanner';

// Mock the global fetch
global.fetch = vi.fn();

describe('ManualScanner Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with URL as default input type', () => {
    render(<ManualScanner />);
    expect(screen.getByText('Manual Threat Scanner')).toBeInTheDocument();
    
    const input = screen.getByPlaceholderText(/Paste a suspicious URL here/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'url');
  });

  it('switches to text input when Text button is clicked', () => {
    render(<ManualScanner />);
    const textBtn = screen.getByText('Text');
    fireEvent.click(textBtn);
    
    expect(screen.getByPlaceholderText(/Paste suspicious email text/i)).toBeInTheDocument();
  });

  it('shows scanning result correctly on successful scan', async () => {
    const mockResponse = {
      is_threat: true,
      risk_score: 95,
      threat_type: 'malicious_url',
      message: 'Suspicious URL detected.'
    };
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<ManualScanner />);
    
    const input = screen.getByPlaceholderText(/Paste a suspicious URL here/i);
    const submitBtn = screen.getByRole('button', { name: /scan/i });

    fireEvent.change(input, { target: { value: 'http://evil.com' } });
    fireEvent.click(submitBtn);

    // Should show loading state
    expect(submitBtn).toBeDisabled();

    // Wait for the result to appear
    await waitFor(() => {
      expect(screen.getByText('Threat Detected!')).toBeInTheDocument();
    });

    expect(screen.getByText('Suspicious URL detected.')).toBeInTheDocument();
    expect(screen.getByText('95/100')).toBeInTheDocument();
    expect(screen.getByText('malicious_url')).toBeInTheDocument();
  });
});
