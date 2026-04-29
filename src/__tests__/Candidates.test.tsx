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

  test("handles zero wealth candidate (lines 91-92 branches)", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const reactMock = require("react");
    const mockCandidate = {
      id: 'zero', name: 'Zero Wealth', party: 'None', education: 'None', assetsStr: '₹ 0', liabilitiesStr: '₹ 0',
      assetsRaw: 0, liabilitiesRaw: 0, cases: 0, affidavitUrl: '#',
      color: '#000',
      promises: []
    };
    
    // We only want to mock the first useState call (which is the candidates list)
    // The rest (like those in Next.js Image) should use the real useState.
    const originalUseState = reactMock.useState;
    let callCount = 0;
    jest.spyOn(reactMock, "useState").mockImplementation((init: unknown) => {
      callCount++;
      if (callCount === 1) return [[mockCandidate], jest.fn()];
      return originalUseState(init);
    });

    render(<CandidatesPage />);
    expect(screen.getByText(/Zero Wealth/i)).toBeInTheDocument();
    
    // Percentages should be 0 and bars should have 0% width
    const assetBar = document.querySelector("[class*='assetBar']") as HTMLElement;
    const liabilityBar = document.querySelector("[class*='liabilityBar']") as HTMLElement;
    expect(assetBar.style.width).toBe("0%");
    expect(liabilityBar.style.width).toBe("0%");

    jest.restoreAllMocks();
  });
});
