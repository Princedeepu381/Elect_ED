import { render, screen } from "@testing-library/react";
import InteractiveMap from "../InteractiveMap";

const mockStates = [
  { id: 'ka', name: 'Karnataka', lat: 15.3173, lng: 75.7139, constituencies: 28, website: 'https://ceo.karnataka.gov.in/' }
];

describe("InteractiveMap Component", () => {
  test("returns null if no state is selected", () => {
    const { container } = render(<InteractiveMap states={mockStates} selectedStateId="unknown" />);
    expect(container.firstChild).toBeNull();
  });

  test("renders map embed for selected state", () => {
    const { container } = render(<InteractiveMap states={mockStates} selectedStateId="ka" />);
    expect(screen.getByText(/GOOGLE CLOUD UPLINK: KARNATAKA/i)).toBeInTheDocument();
    
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', expect.stringContaining('Karnataka'));
  });
});
