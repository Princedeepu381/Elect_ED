import { render, screen, fireEvent, act } from "@testing-library/react";
import EVMPage from "../app/evm/page";

// Mock AudioContext
const mockOscillator = {
  connect: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  type: 'sine',
  frequency: { setValueAtTime: jest.fn() }
};

const mockGain = {
  connect: jest.fn(),
  gain: { 
    setValueAtTime: jest.fn(),
    linearRampToValueAtTime: jest.fn()
  }
};

const mockAudioContext = {
  createOscillator: jest.fn(() => mockOscillator),
  createGain: jest.fn(() => mockGain),
  destination: {},
  currentTime: 0
};

Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: jest.fn().mockImplementation(() => mockAudioContext),
});

describe("EVM Page", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("renders the balloting unit and candidates", () => {
    render(<EVMPage />);
    expect(screen.getByText(/BALLOTING UNIT/i)).toBeInTheDocument();
    expect(screen.getByText(/Narendra Modi/i)).toBeInTheDocument();
    expect(screen.getByText(/Rahul Gandhi/i)).toBeInTheDocument();
  });

  test("starts VVPAT simulation on vote click", () => {
    render(<EVMPage />);
    const voteBtn = screen.getAllByLabelText(/Vote for/i)[0];
    fireEvent.click(voteBtn);

    expect(screen.getByRole('heading', { name: /VVPAT Slip/i })).toBeInTheDocument();
    expect(screen.getByText(/Verify your slip/i)).toBeInTheDocument();
  });

  test("completes voting cycle after 7 seconds", () => {
    render(<EVMPage />);
    const voteBtn = screen.getAllByLabelText(/Vote for/i)[0];
    fireEvent.click(voteBtn);

    act(() => {
      jest.advanceTimersByTime(7000);
    });

    expect(screen.getByText(/Vote successfully recorded/i)).toBeInTheDocument();
    expect(screen.getByText(/BEEEEEEP/i)).toBeInTheDocument();
  });

  test("renders security info cards", () => {
    render(<EVMPage />);
    expect(screen.getByRole('heading', { name: /Standalone System/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /The 7-Second Rule/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Audit Trail/i })).toBeInTheDocument();
  });

  test("resets vote state after showing success (3500ms timeout - lines 89-90)", () => {
    render(<EVMPage />);
    const voteBtn = screen.getAllByLabelText(/Vote for/i)[0];
    fireEvent.click(voteBtn);

    // Complete the 7-second VVPAT
    act(() => {
      jest.advanceTimersByTime(7000);
    });

    expect(screen.getByText(/Vote successfully recorded/i)).toBeInTheDocument();

    // Advance by 3500ms to trigger the reset (lines 89-90)
    act(() => {
      jest.advanceTimersByTime(3500);
    });

    // After reset, vote buttons should be enabled again
    const voteBtns = screen.getAllByLabelText(/Vote for/i);
    expect(voteBtns[0]).not.toBeDisabled();
  });

  test("prevents multiple votes during VVPAT cycle (line 68 guard)", () => {
    render(<EVMPage />);
    const voteBtns = screen.getAllByLabelText(/Vote for/i);
    
    // Click first candidate
    fireEvent.click(voteBtns[0]);
    
    // All buttons should be disabled now
    voteBtns.forEach(btn => {
      expect(btn).toBeDisabled();
    });
  });

  test("handles AudioContext not available (line 63 catch branch)", () => {
    // Temporarily remove AudioContext
    const originalAC = window.AudioContext;
    Object.defineProperty(window, 'AudioContext', {
      writable: true,
      value: undefined,
    });

    render(<EVMPage />);
    const voteBtn = screen.getAllByLabelText(/Vote for/i)[0];
    fireEvent.click(voteBtn);

    act(() => {
      jest.advanceTimersByTime(7000);
    });

    // Should still show success even without audio
    expect(screen.getByText(/Vote successfully recorded/i)).toBeInTheDocument();

    // Restore
    Object.defineProperty(window, 'AudioContext', {
      writable: true,
      value: originalAC,
    });
  });

  test("handles AudioContext throwing error (catch branch)", () => {
    Object.defineProperty(window, 'AudioContext', {
      writable: true,
      value: jest.fn().mockImplementation(() => { throw new Error("Audio not supported"); }),
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<EVMPage />);
    const voteBtn = screen.getAllByLabelText(/Vote for/i)[0];
    fireEvent.click(voteBtn);

    act(() => {
      jest.advanceTimersByTime(7000);
    });

    expect(consoleSpy).toHaveBeenCalledWith("Audio API not supported", expect.any(Error));
    consoleSpy.mockRestore();

    // Restore
    Object.defineProperty(window, 'AudioContext', {
      writable: true,
      value: jest.fn().mockImplementation(() => mockAudioContext),
    });
  });

  test("shows idle status when no vote is in progress", () => {
    render(<EVMPage />);
    expect(screen.getByText(/Live Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Please cast your vote/i)).toBeInTheDocument();
  });
});
