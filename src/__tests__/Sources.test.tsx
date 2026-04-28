import { render, screen } from "@testing-library/react";
import SourcesPage from "../app/sources/page";

describe("Sources Page", () => {
  test("renders the data sources title", () => {
    render(<SourcesPage />);
    expect(screen.getByText(/Authoritative Data Sources/i)).toBeInTheDocument();
  });

  test("renders all official government links", () => {
    render(<SourcesPage />);
    expect(screen.getByText(/Election Commission of India/i)).toBeInTheDocument();
    expect(screen.getByText(/Voters' Service Portal/i)).toBeInTheDocument();
    
    const links = screen.getAllByText(/Verify Source/i);
    expect(links.length).toBeGreaterThan(0);
    links.forEach(link => {
      expect(link.closest('a')).toHaveAttribute('target', '_blank');
      expect(link.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
