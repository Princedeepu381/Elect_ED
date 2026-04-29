import { render, screen, fireEvent } from "@testing-library/react";
import ChatBot from "../ChatBot";

describe("ChatBot Component", () => {
  if (typeof global.TextEncoder === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { TextEncoder: TE, TextDecoder: TD } = require('util');
    global.TextEncoder = TE;
    global.TextDecoder = TD;
  }
  if (typeof global.fetch === 'undefined') {
    global.fetch = jest.fn() as jest.Mock;
  }

  test("should render the launcher button initially", () => {
    render(<ChatBot />);
    expect(screen.getByRole("button", { name: /Open ElectED AI Assistant/i })).toBeInTheDocument();
    expect(screen.getByText(/ASK AI/i)).toBeInTheDocument();
  });

  test("should open the chat window when clicked", () => {
    render(<ChatBot />);
    const launcher = screen.getByRole("button", { name: /Open ElectED AI Assistant/i });
    fireEvent.click(launcher);
    expect(screen.getAllByText(/ELECTED AI/i).length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/ASK ABOUT LAWS, DATES, OR PROCESSES/i)).toBeInTheDocument();
  });

  test("should allow typing in the input field", () => {
    render(<ChatBot />);
    fireEvent.click(screen.getByRole("button", { name: /Open ElectED AI Assistant/i }));
    const input = screen.getByPlaceholderText(/ASK ABOUT LAWS, DATES, OR PROCESSES/i);
    fireEvent.change(input, { target: { value: "How do I register?" } });
    expect(input).toHaveValue("How do I register?");
  });

  test("should send message and handle streaming response", async () => {
    const mockStream = {
      getReader: () => ({
        read: jest.fn()
          .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode("AI ") })
          .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode("Response") })
          .mockResolvedValueOnce({ done: true }),
      }),
    };

    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      body: mockStream,
    } as unknown as Response);

    render(<ChatBot />);
    fireEvent.click(screen.getByRole("button", { name: /Open ElectED AI Assistant/i }));
    const input = screen.getByPlaceholderText(/ASK ABOUT LAWS, DATES, OR PROCESSES/i);
    fireEvent.change(input, { target: { value: "User Question" } });
    fireEvent.click(screen.getByRole("button", { name: /Send message/i }));

    expect(await screen.findByText(/AI Response/i)).toBeInTheDocument();
    
    fetchSpy.mockRestore();
  });

  test("should minimize the chat window", () => {
    render(<ChatBot />);
    fireEvent.click(screen.getByRole("button", { name: /Open ElectED AI Assistant/i }));
    
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]); // Header close button
    
    expect(screen.getByText(/ASK AI/i)).toBeInTheDocument();
  });

  test("should handle API error", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    render(<ChatBot />);
    fireEvent.click(screen.getByRole("button", { name: /Open ElectED AI Assistant/i }));
    const input = screen.getByPlaceholderText(/ASK ABOUT LAWS, DATES, OR PROCESSES/i);
    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(screen.getByRole("button", { name: /Send message/i }));

    await screen.findByText(/I encountered an error: Network error. Please ensure your API key is valid and try again./i);
  });

  test("should handle API response not ok error with missing details", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as unknown as Response);

    render(<ChatBot />);
    fireEvent.click(screen.getByRole("button", { name: /Open ElectED AI Assistant/i }));
    const input = screen.getByPlaceholderText(/ASK ABOUT LAWS, DATES, OR PROCESSES/i);
    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(screen.getByRole("button", { name: /Send message/i }));

    await screen.findByText(/I encountered an error: Upstream service error. Please ensure your API key is valid and try again./i);
  });

  test("should handle missing reader", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      body: null,
    } as unknown as Response);

    render(<ChatBot />);
    fireEvent.click(screen.getByRole("button", { name: /Open ElectED AI Assistant/i }));
    const input = screen.getByPlaceholderText(/ASK ABOUT LAWS, DATES, OR PROCESSES/i);
    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(screen.getByRole("button", { name: /Send message/i }));

    await screen.findByText(/I encountered an error: No reader available. Please ensure your API key is valid and try again./i);
  });

  test("should not send empty message", () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    fetchSpy.mockClear();
    render(<ChatBot />);
    fireEvent.click(screen.getByRole("button", { name: /Open ElectED AI Assistant/i }));
    // Don't type anything, just click send
    fireEvent.click(screen.getByRole("button", { name: /Send message/i }));
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  test("should send message on Enter key press", async () => {
    const mockStream = {
      getReader: () => ({
        read: jest.fn()
          .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode("Answer") })
          .mockResolvedValueOnce({ done: true }),
      }),
    };
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      body: mockStream,
    } as unknown as Response);

    render(<ChatBot />);
    fireEvent.click(screen.getByRole("button", { name: /Open ElectED AI Assistant/i }));
    const input = screen.getByPlaceholderText(/ASK ABOUT LAWS, DATES, OR PROCESSES/i);
    fireEvent.change(input, { target: { value: "What is EVM?" } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(await screen.findByText(/Answer/i)).toBeInTheDocument();
    fetchSpy.mockRestore();
  });

  test("should open chat window via open-chatbot event", () => {
    render(<ChatBot />);
    // Trigger the custom event
    fireEvent(window, new CustomEvent('open-chatbot'));
    expect(screen.getByPlaceholderText(/ASK ABOUT LAWS, DATES, OR PROCESSES/i)).toBeInTheDocument();
  });

  test("should render bold text in formatMessage", async () => {
    const mockStream = {
      getReader: () => ({
        read: jest.fn()
          .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode("**bold text**") })
          .mockResolvedValueOnce({ done: true }),
      }),
    };
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      body: mockStream,
    } as unknown as Response);

    render(<ChatBot />);
    fireEvent.click(screen.getByRole("button", { name: /Open ElectED AI Assistant/i }));
    const input = screen.getByPlaceholderText(/ASK ABOUT LAWS, DATES, OR PROCESSES/i);
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.click(screen.getByRole("button", { name: /Send message/i }));

    const boldEl = await screen.findByText(/bold text/i);
    expect(boldEl.tagName).toBe('STRONG');
    fetchSpy.mockRestore();
  });
});
