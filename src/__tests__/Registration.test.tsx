import { render, screen, fireEvent } from "@testing-library/react";
import RegistrationPage from "../app/registration/page";

describe("Registration Page", () => {
  test("renders the registration guide title", () => {
    render(<RegistrationPage />);
    expect(screen.getByText(/Smart Registration Guide/i)).toBeInTheDocument();
  });

  test("allows switching between forms", () => {
    render(<RegistrationPage />);
    const form8Tab = screen.getByText(/Form 8/i);
    fireEvent.click(form8Tab);
    
    expect(screen.getByText(/Form 8: Shift \/ Correction/i)).toBeInTheDocument();
  });

  test("renders document requirements", () => {
    render(<RegistrationPage />);
    expect(screen.getByText(/Passport Size Photograph/i)).toBeInTheDocument();
    expect(screen.getByText(/Age Proof/i)).toBeInTheDocument();
    expect(screen.getByText(/Address Proof/i)).toBeInTheDocument();
  });

  test("renders official ECI portal link", () => {
    render(<RegistrationPage />);
    const link = screen.getByLabelText(/Go to official ECI portal/i);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://voters.eci.gov.in');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
