/**
 * Shared TypeScript interfaces for ElectEd data models.
 * Single source of truth — import from here, never redefine inline.
 */

export interface StateData {
  id: string;
  name: string;
  type: string;
  capital: string;
  constituencies: number;
  commissioner: string;
  website: string;
  fact: string;
  lat: number;
  lng: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizTopic {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export interface Reminder {
  id: string;
  title: string;
  date: string;
  type: "deadline" | "election" | "event" | "custom";
  description: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  period: string;
  phase: "pre-election" | "election" | "post-election";
  description: string;
  icon: string;
}

export interface GuideStep {
  id: string;
  title: string;
  icon: string;
  content: string;
  tip?: string;
}

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
}

export interface Grade {
  title: "ELECTION EXPERT" | "INFORMED CITIZEN" | "NOVICE VOTER";
  color: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
