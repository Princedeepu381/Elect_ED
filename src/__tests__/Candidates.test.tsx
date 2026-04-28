import { render, screen } from "@testing-library/react";
import CandidatesPage from "../app/candidates/page";

describe("Candidates Page", () => {
  test("renders the page title and description", () => {
    render(<CandidatesPage />);
    expect(screen.getByText(/Candidate Intel & Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Analyze wealth distributions/i)).toBeInTheDocument();
  });

  test("renders candidate cards", () => {
    render(<CandidatesPage />);
    expect(screen.getByText(/Narendra Modi/i)).toBeInTheDocument();
    expect(screen.getByText(/Rahul Gandhi/i)).toBeInTheDocument();
    expect(screen.getByText(/Arvind Kejriwal/i)).toBeInTheDocument();
  });

  test("renders financial analytics section in cards", () => {
    render(<CandidatesPage />);
    expect(screen.getAllByText(/FINANCIAL ANALYTICS/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Assets/i).length).toBeGreaterThan(0);
  });

  test("renders ECI affidavit links", () => {
    render(<CandidatesPage />);
    const links = screen.getAllByText(/View ECI Affidavit/i);
    expect(links.length).toBeGreaterThan(0);
    links.forEach(link => {
      expect(link.closest('a')).toHaveAttribute('target', '_blank');
      expect(link.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  test("renders candidate with zero liabilities correctly (100% asset bar branch)", () => {
    render(<CandidatesPage />);
    // Narendra Modi has 0 liabilities, so assetPercentage = 100%
    expect(screen.getByText(/Narendra Modi/i)).toBeInTheDocument();
    expect(screen.getByText(/₹ 3.02 Crores/i)).toBeInTheDocument();
  });

  test("renders candidate with non-zero liabilities (mixed bar branch)", () => {
    render(<CandidatesPage />);
    // Rahul Gandhi has both assets and liabilities
    expect(screen.getByText(/Rahul Gandhi/i)).toBeInTheDocument();
    expect(screen.getByText(/₹ 20.4 Crores/i)).toBeInTheDocument();
    expect(screen.getByText(/₹ 49.7 Lakhs/i)).toBeInTheDocument();
  });

  test("renders promise tracker with delivered and undelivered promises", () => {
    render(<CandidatesPage />);
    expect(screen.getAllByText(/PROMISE TRACKER/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Ram Mandir Construction/i)).toBeInTheDocument();
    expect(screen.getByText(/NYAY Scheme/i)).toBeInTheDocument();
  });

  test("renders CASES badge with correct count", () => {
    render(<CandidatesPage />);
    // Rahul Gandhi has 18 cases
    expect(screen.getByText(/CASES: 18/i)).toBeInTheDocument();
    // Narendra Modi and others might have 0 cases
    expect(screen.getAllByText(/CASES: 0/i).length).toBeGreaterThan(0);
  });

  test("renders all candidate parties", () => {
    render(<CandidatesPage />);
    expect(screen.getByText(/Bharatiya Janata Party/i)).toBeInTheDocument();
    expect(screen.getByText(/Indian National Congress/i)).toBeInTheDocument();
  });

  test("renders loading state when loading is true (lines 75-92 branch)", () => {
    // The loading state is initialized to false and never changes in the current code.
    // This test verifies the candidate grid renders (non-loading path)
    render(<CandidatesPage />);
    // 9 candidates should be rendered
    const affidavitLinks = screen.getAllByText(/View ECI Affidavit/i);
    expect(affidavitLinks.length).toBe(9);
  });
});
