import { render, screen } from "@testing-library/react";
import RightsPage from "../app/rights/page";

describe("Rights Page", () => {
  test("renders the know your rights title", () => {
    render(<RightsPage />);
    expect(screen.getByText(/Know Your Rights/i)).toBeInTheDocument();
  });

  test("renders all core voter rights", () => {
    render(<RightsPage />);
    expect(screen.getByText(/Right to Secret Ballot/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /NOTA/i })).toBeInTheDocument();
    expect(screen.getByText(/Right against Denial/i)).toBeInTheDocument();
    expect(screen.getByText(/Right to Assistance/i)).toBeInTheDocument();
    expect(screen.getByText(/Right to Complain/i)).toBeInTheDocument();
  });

  test("renders legal complaint link", () => {
    render(<RightsPage />);
    const link = screen.getByText(/Legal Complaints/i);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://cvigil.eci.gov.in/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
