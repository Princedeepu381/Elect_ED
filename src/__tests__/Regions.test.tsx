import { render, screen } from "@testing-library/react";
import RegionsPage from "../app/regions/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/regions",
}));

// Mock dynamic import of InteractiveMap
jest.mock("next/dynamic", () => () => {
  const MockMap = () => <div data-testid="mock-map">Interactive Map Mock</div>;
  MockMap.displayName = "MockMap";
  return MockMap;
});

describe("Regions Page", () => {
  test("should render the header and title", () => {
    render(<RegionsPage />);
    expect(screen.getAllByText(/REGIONAL/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/PORTALS/i).length).toBeGreaterThan(0);
  });

  test("should render the state selection sidebar", () => {
    render(<RegionsPage />);
    expect(screen.getByPlaceholderText(/Search state\.\.\./i)).toBeInTheDocument();
    expect(screen.getByText(/SELECT STATE/i)).toBeInTheDocument();
  });

  test("should render state details for the default selected state", () => {
    render(<RegionsPage />);
    // Default is Andaman & Nicobar or Andhra Pradesh depending on states.json
    expect(screen.getByText(/CAPITAL/i)).toBeInTheDocument();
    expect(screen.getByText(/LOK SABHA SEATS/i)).toBeInTheDocument();
  });
});
