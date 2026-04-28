import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatPanel from "../ChatPanel";

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe("ChatPanel Component", () => {
  if (typeof global.TextEncoder === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { TextEncoder: TE, TextDecoder: TD } = require('util');
    global.TextEncoder = TE;
    global.TextDecoder = TD;
  }
  if (typeof global.fetch === 'undefined') {
    global.fetch = jest.fn() as jest.Mock;
  }
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("does not render when isOpen is false", () => {
    const { container } = render(<ChatPanel isOpen={false} onClose={mockOnClose} />);
    expect(container.firstChild).toBeNull();
  });

  test("renders correctly when open", () => {
    render(<ChatPanel isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText(/Election Assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/Hi! I'm your ElectEd AI Assistant/i)).toBeInTheDocument();
  });

  test("calls onClose when close button is clicked", () => {
    render(<ChatPanel isOpen={true} onClose={mockOnClose} />);
    const closeButton = screen.getByRole("button", { name: /Close Election Assistant/i });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("allows typing in the input field", () => {
    render(<ChatPanel isOpen={true} onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText(/Ask about registration/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "How to register?" } });
    expect(input.value).toBe("How to register?");
  });

  test("submits message and handles streaming response", async () => {
    const mockStream = {
      getReader: () => ({
        read: jest.fn()
          .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode("Hello ") })
          .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode("World") })
          .mockResolvedValueOnce({ done: true }),
      }),
    };

    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      body: mockStream,
    } as unknown as Response);

    render(<ChatPanel isOpen={true} onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText(/Ask about registration/i);
    const sendBtn = screen.getByRole("button", { name: /Send message/i });
    
    fireEvent.change(input, { target: { value: "Test Question" } });
    fireEvent.click(sendBtn);
    
    expect(await screen.findByText(/Hello World/i)).toBeInTheDocument();
    
    fetchSpy.mockRestore();
  });

  test("handles API error in ChatPanel", async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ details: "API Error" }),
    } as unknown as Response);

    render(<ChatPanel isOpen={true} onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText(/Ask about registration/i);
    const sendBtn = screen.getByRole("button", { name: /Send message/i });
    
    fireEvent.change(input, { target: { value: "Fail" } });
    fireEvent.click(sendBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/Sorry, I encountered an error/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    fetchSpy.mockRestore();
  });

  test("calls onClose when overlay is clicked", () => {
    render(<ChatPanel isOpen={true} onClose={mockOnClose} />);
    const overlay = document.querySelector("[class*='overlay']") as HTMLElement;
    if (overlay) fireEvent.click(overlay);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("does NOT close when panel content is clicked (stopPropagation)", () => {
    render(<ChatPanel isOpen={true} onClose={mockOnClose} />);
    const panel = document.querySelector("[class*='panel']") as HTMLElement;
    if (panel) fireEvent.click(panel);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("handles no-reader response (lines 57-60 branch)", async () => {
    // Simulate a response with no body (reader = undefined)
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      body: null,
      text: async () => "Fallback text response",
    } as unknown as Response);

    render(<ChatPanel isOpen={true} onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText(/Ask about registration/i);
    fireEvent.change(input, { target: { value: "Test" } });
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(screen.getByText(/Fallback text response/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    fetchSpy.mockRestore();
  });

  test("should not submit empty message", () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    render(<ChatPanel isOpen={true} onClose={mockOnClose} />);
    const form = document.querySelector("form")!;
    fireEvent.submit(form);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  test("handles stream read error (line 86 branch)", async () => {
    const mockStream = {
      getReader: () => ({
        read: jest.fn()
          .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode("Partial") })
          .mockRejectedValueOnce(new Error("Stream error")),
      }),
    };

    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      body: mockStream,
    } as unknown as Response);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<ChatPanel isOpen={true} onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText(/Ask about registration/i);
    fireEvent.change(input, { target: { value: "Stream test" } });
    fireEvent.click(screen.getByRole("button", { name: /Send message/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Stream read error:", expect.any(Error));
    }, { timeout: 3000 });

    consoleSpy.mockRestore();
    fetchSpy.mockRestore();
  });
});
