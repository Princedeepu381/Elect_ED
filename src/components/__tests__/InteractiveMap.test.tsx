import { render, screen } from "@testing-library/react";
import InteractiveMap from "../InteractiveMap";

const mockStates = [
  { id: 'ka', name: 'Karnataka', lat: 15.3173, lng: 75.7139, constituencies: 28, website: 'https://ceo.karnataka.gov.in/' }
];

describe("InteractiveMap Component", () => {
  test("renders placeholder if no state is selected", () => {
    render(<InteractiveMap states={mockStates} selectedStateId="unknown" />);
    expect(screen.getByText(/SELECT A STATE TO VIEW GOOGLE MAP/i)).toBeInTheDocument();
  });

  test("renders map embed for selected state", () => {
    const { container } = render(<InteractiveMap states={mockStates} selectedStateId="ka" />);
    expect(screen.getByText(/GOOGLE MAPS \| KARNATAKA/i)).toBeInTheDocument();
    
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', expect.stringContaining('Karnataka'));
  });

  test("renders map embed with API key if provided", () => {
    process.env.NEXT_PUBLIC_MAPS_API_KEY = "test-api-key";
    const { container } = render(<InteractiveMap states={mockStates} selectedStateId="ka" />);
    const iframe = container.querySelector('iframe');
    expect(iframe).toHaveAttribute('src', expect.stringContaining('test-api-key'));
    delete process.env.NEXT_PUBLIC_MAPS_API_KEY;
  });
});
