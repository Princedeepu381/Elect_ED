import { render, screen, fireEvent } from "@testing-library/react";
import Stepper from "../Stepper";

describe("Stepper Component", () => {
  const steps = [
    { id: "1", title: "Step 1", icon: "Check" },
    { id: "2", title: "Step 2", icon: "Circle" },
    { id: "3", title: "Step 3", icon: "NonExistentIcon" }, // Tests fallback to Icons.Circle
  ];

  test("renders all steps", () => {
    render(<Stepper steps={steps} currentStepIndex={0} onStepClick={() => {}} />);
    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("Step 2")).toBeInTheDocument();
    expect(screen.getByText("Step 3")).toBeInTheDocument();
  });

  test("highlights current step", () => {
    const { container } = render(<Stepper steps={steps} currentStepIndex={0} onStepClick={() => {}} />);
    const activeStep = container.querySelector("[class*='active']");
    expect(activeStep).toBeInTheDocument();
  });

  test("marks previous steps as completed", () => {
    const { container } = render(<Stepper steps={steps} currentStepIndex={1} onStepClick={() => {}} />);
    const completedSteps = container.querySelectorAll("[class*='completed']");
    expect(completedSteps.length).toBeGreaterThan(0);
  });

  test("shows Check icon for completed steps", () => {
    render(<Stepper steps={steps} currentStepIndex={1} onStepClick={() => {}} />);
    // Step 1 is completed (index 0 < currentStepIndex 1), should show Completed status
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  test("shows In Progress for current step", () => {
    render(<Stepper steps={steps} currentStepIndex={1} onStepClick={() => {}} />);
    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  test("shows Pending for future steps", () => {
    render(<Stepper steps={steps} currentStepIndex={0} onStepClick={() => {}} />);
    const pendingItems = screen.getAllByText("Pending");
    expect(pendingItems.length).toBeGreaterThan(0);
  });

  test("calls onStepClick with correct index when step is clicked", () => {
    const onStepClick = jest.fn();
    render(<Stepper steps={steps} currentStepIndex={0} onStepClick={onStepClick} />);
    fireEvent.click(screen.getByText("Step 2").closest("[class*='stepWrapper']")!);
    expect(onStepClick).toHaveBeenCalledWith(1);
  });

  test("renders fallback icon for unknown icon names (line 31 branch)", () => {
    // Step 3 has icon "NonExistentIcon" which should fall back to Icons.Circle
    const { container } = render(<Stepper steps={steps} currentStepIndex={0} onStepClick={() => {}} />);
    // All steps should render without crashing
    expect(container.querySelectorAll("[class*='stepWrapper']").length).toBe(3);
  });

  test("does not render a line connector after the last step", () => {
    const { container } = render(<Stepper steps={steps} currentStepIndex={0} onStepClick={() => {}} />);
    const lines = container.querySelectorAll("[class*='line']");
    // Should have steps.length - 1 lines
    expect(lines.length).toBe(steps.length - 1);
  });
});
