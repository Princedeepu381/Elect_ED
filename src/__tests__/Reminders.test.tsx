import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import RemindersPage from "../app/reminders/page";

describe("Reminders Page", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-01-01T00:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("should render the reminders header", () => {
    render(<RemindersPage />);
    expect(screen.getAllByText(/VOTER/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/REMINDERS/i).length).toBeGreaterThan(0);
  });

  test("should allow adding a new custom reminder via Enter key", () => {
    render(<RemindersPage />);
    const input = screen.getByPlaceholderText(/ADD NEW DEADLINE\.\.\./i);
    fireEvent.change(input, { target: { value: "Enter Key Deadline" } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText(/Enter Key Deadline/i)).toBeInTheDocument();
  });

  test("should allow deleting a reminder", async () => {
    render(<RemindersPage />);
    const input = screen.getByPlaceholderText(/ADD NEW DEADLINE\.\.\./i);
    fireEvent.change(input, { target: { value: "ToDelete" } });
    fireEvent.click(screen.getByText(/ADD/i));
    
    const reminderCard = screen.getByText(/ToDelete/i).closest('div');
    const deleteBtn = within(reminderCard!).getByTitle(/Delete/i);
    fireEvent.click(deleteBtn);
    
    await waitFor(() => {
      expect(screen.queryByText(/ToDelete/i)).not.toBeInTheDocument();
    });
  });

  test("should trigger ICS download", () => {
    global.URL.createObjectURL = jest.fn(() => "blob:test");
    global.URL.revokeObjectURL = jest.fn();
    const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(<RemindersPage />);
    const icsBtns = screen.getAllByText(/\.ICS/i);
    fireEvent.click(icsBtns[0]);

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    
    clickSpy.mockRestore();
  });

  test("should not add reminder when input is empty", () => {
    render(<RemindersPage />);
    const initialCount = screen.getAllByText(/\.ICS/i).length;
    fireEvent.click(screen.getByText(/ADD/i));
    // Count should stay the same
    expect(screen.getAllByText(/\.ICS/i).length).toBe(initialCount);
  });

  test("should show past events section (line 212 branch)", () => {
    // Set system time to far in the future so all reminders become past events
    jest.setSystemTime(new Date("2030-12-31T00:00:00.000Z"));
    render(<RemindersPage />);
    // Past events section should appear
    expect(screen.getAllByText(/PAST EVENTS/i).length).toBeGreaterThan(0);
  });

  test("should show countdown for upcoming events", () => {
    // Set system time to before the reminders data dates
    jest.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));
    render(<RemindersPage />);
    // Should show UPCOMING section
    expect(screen.getAllByText(/UPCOMING/i).length).toBeGreaterThan(0);
  });

  test("should add reminder and show it in upcoming list when date is future", () => {
    jest.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));
    render(<RemindersPage />);
    const input = screen.getByPlaceholderText(/ADD NEW DEADLINE\.\.\./i);
    fireEvent.change(input, { target: { value: "My Custom Reminder" } });
    fireEvent.click(screen.getByText(/ADD/i));
    expect(screen.getByText(/My Custom Reminder/i)).toBeInTheDocument();
  });

  test("should show NEXT badge on the nearest upcoming event", () => {
    jest.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));
    render(<RemindersPage />);
    // NEXT badge should appear on the nearest event
    expect(screen.getAllByText(/NEXT/i).length).toBeGreaterThan(0);
  });
});
