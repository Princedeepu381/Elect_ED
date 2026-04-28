import { render, screen } from "@testing-library/react";
import Timeline from "../Timeline";

describe("Timeline Component", () => {
  const events = [
    { id: "1", period: "Jan 2024", phase: "pre-election", title: "Event 1", description: "Desc 1", icon: "Calendar" },
    { id: "2", period: "Feb 2024", phase: "voting", title: "Event 2", description: "Desc 2", icon: "NonExistentIcon" }, // Tests fallback
    { id: "3", period: "Mar 2024", phase: "post-election", title: "Event 3", description: "Desc 3", icon: "Clock" },
  ];

  test("renders all events", () => {
    render(<Timeline events={events} />);
    expect(screen.getByText("Event 1")).toBeInTheDocument();
    expect(screen.getByText("Event 2")).toBeInTheDocument();
    expect(screen.getByText("Event 3")).toBeInTheDocument();
  });

  test("renders event descriptions", () => {
    render(<Timeline events={events} />);
    expect(screen.getByText("Desc 1")).toBeInTheDocument();
    expect(screen.getByText("Desc 2")).toBeInTheDocument();
  });

  test("renders event periods", () => {
    render(<Timeline events={events} />);
    expect(screen.getByText("Jan 2024")).toBeInTheDocument();
    expect(screen.getByText("Feb 2024")).toBeInTheDocument();
  });

  test("renders phase badges with hyphens replaced by spaces", () => {
    render(<Timeline events={events} />);
    // phase "pre-election" becomes "pre election"
    expect(screen.getByText("pre election")).toBeInTheDocument();
    // phase "post-election" becomes "post election"
    expect(screen.getByText("post election")).toBeInTheDocument();
  });

  test("renders fallback icon for unknown icon names (line 27 branch)", () => {
    // Event 2 uses "NonExistentIcon" which falls back to Icons.Circle
    const { container } = render(<Timeline events={events} />);
    // All events should render without crashing
    expect(container.querySelectorAll("[class*='eventWrapper']").length).toBe(3);
  });

  test("renders timeline container and line elements", () => {
    const { container } = render(<Timeline events={events} />);
    expect(container.querySelector("[class*='timelineContainer']")).toBeInTheDocument();
    expect(container.querySelector("[class*='line']")).toBeInTheDocument();
  });
});
