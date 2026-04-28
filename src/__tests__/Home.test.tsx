import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../app/page";
import { useRouter } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: () => "/",
}));

describe("Home Page", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
  });

  test("should render the hero section titles", () => {
    render(<Home />);
    expect(screen.getAllByText(/YOUR/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/VOTE/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/POWER/i).length).toBeGreaterThan(0);
  });

  test("should render the feature cards", () => {
    render(<Home />);
    const featureTitles = ["THE GUIDE", "TIMELINE", "AI ASSISTANT", "REGIONS", "QUIZ", "REMINDERS"];
    featureTitles.forEach((title) => {
      expect(screen.getAllByText(title).length).toBeGreaterThan(0);
    });
  });

  test("should navigate when a feature card is clicked", () => {
    render(<Home />);
    const guideCard = screen.getByText("THE GUIDE").closest('[role="button"]');
    fireEvent.click(guideCard!);
    expect(pushMock).toHaveBeenCalledWith("/guide");
  });

  test("should dispatch open-chatbot event when AI card is clicked", () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    render(<Home />);
    const aiCard = screen.getByText("AI ASSISTANT").closest('[role="button"]');
    fireEvent.click(aiCard!);
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(CustomEvent));
    expect(dispatchSpy.mock.calls[0][0].type).toBe('open-chatbot');
    dispatchSpy.mockRestore();
  });

  test("should render the stats section", () => {
    render(<Home />);
    expect(screen.getAllByText(/960M\+/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/543/i).length).toBeGreaterThan(0);
  });

  test("should handle Enter key on AI assistant card", () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    render(<Home />);
    const aiCard = screen.getByText("AI ASSISTANT").closest('[role="button"]');
    fireEvent.keyDown(aiCard!, { key: 'Enter' });
    expect(dispatchSpy).toHaveBeenCalled();
    dispatchSpy.mockRestore();
  });

  test("should handle Enter key on a non-AI card to navigate", () => {
    render(<Home />);
    const quizCard = screen.getAllByText("QUIZ")[0].closest('[role="button"]');
    fireEvent.keyDown(quizCard!, { key: 'Enter' });
    expect(pushMock).toHaveBeenCalledWith("/quiz");
  });

  test("should handle Space key on a feature card to navigate", () => {
    render(<Home />);
    const regionsCard = screen.getByText("REGIONS").closest('[role="button"]');
    fireEvent.keyDown(regionsCard!, { key: ' ' });
    expect(pushMock).toHaveBeenCalledWith("/regions");
  });

  test("should NOT navigate on other keys", () => {
    render(<Home />);
    const quizCard = screen.getAllByText("QUIZ")[0].closest('[role="button"]');
    fireEvent.keyDown(quizCard!, { key: 'Tab' });
    expect(pushMock).not.toHaveBeenCalled();
  });

  test("should render HOW IT WORKS section with steps", () => {
    render(<Home />);
    expect(screen.getByText(/HOW IT/i)).toBeInTheDocument();
    expect(screen.getAllByText(/LEARN/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/PARTICIPATE/i).length).toBeGreaterThan(0);
  });

  test("should render DEMOCRACY NEEDS YOU CTA section", () => {
    render(<Home />);
    expect(screen.getByText(/DEMOCRACY NEEDS YOU/i)).toBeInTheDocument();
    expect(screen.getByText(/START NOW/i)).toBeInTheDocument();
  });
});
