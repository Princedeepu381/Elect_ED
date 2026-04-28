import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

describe("Footer Component", () => {
  test("should render the brand logo and name", () => {
    render(<Footer />);
    expect(screen.getAllByText(/Elect/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Ed/i).length).toBeGreaterThan(0);
  });

  test("should render quick links", () => {
    render(<Footer />);
    expect(screen.getByText(/QUICK LINKS/i)).toBeInTheDocument();
    expect(screen.getByText(/Election Guide/i)).toBeInTheDocument();
  });

  test("should render the copyright text", () => {
    render(<Footer />);
    expect(screen.getByText(/ALL RIGHTS RESERVED/i)).toBeInTheDocument();
  });
});
