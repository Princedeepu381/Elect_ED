"use client";

import { useState } from "react";
import styles from "./quiz.module.css";
import { CheckCircle, XCircle, RotateCcw, ArrowRight, Trophy, BookOpen, ChevronLeft } from "lucide-react";
import Link from "next/link";
import quizzesData from "@/data/quizzes.json";

type QuizTopic = typeof quizzesData[number];
type Question = QuizTopic["questions"][number];

function getGrade(score: number, total: number) {
  const pct = (score / total) * 100;
  if (pct >= 90) return { title: "ELECTION EXPERT", color: "var(--accent-emerald)" };
  if (pct >= 60) return { title: "INFORMED CITIZEN", color: "var(--accent-amber)" };
  return { title: "NOVICE VOTER", color: "var(--accent-rose)" };
}

export default function QuizPage() {
  const [selectedTopic, setSelectedTopic] = useState<QuizTopic | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleTopicSelect = (topic: QuizTopic) => {
    setSelectedTopic(topic);
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const handleOptionSelect = (idx: number) => {
    if (isAnswered || !selectedTopic) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === selectedTopic.questions[currentIdx].correctIndex) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (!selectedTopic) return;
    if (currentIdx < selectedTopic.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setSelectedTopic(null);
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  // ═══ TOPIC SELECTOR ═══
  if (!selectedTopic) {
    return (
      <div className={styles.wrapper}>
        <header className={styles.topicHeader}>
          <div className={styles.topicBadge}>CIVIC KNOWLEDGE</div>
          <h1 className={styles.topicTitle}>CHOOSE YOUR <span className={styles.accent}>CHALLENGE</span></h1>
          <p className={styles.topicSubtitle}>Select a topic to test your election knowledge.</p>
        </header>

        <div className={styles.topicGrid}>
          {quizzesData.map((topic, i) => (
            <button
              key={topic.id}
              className={`${styles.topicCard} fade-in-up`}
              style={{ animationDelay: `${i * 0.1}s` }}
              onClick={() => handleTopicSelect(topic)}
            >
              <div className={styles.topicIcon}><BookOpen size={28} /></div>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <div className={styles.topicMeta}>
                <span>{topic.questions.length} QUESTIONS</span>
                <ArrowRight size={16} />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ═══ RESULT SCREEN ═══
  if (showResult) {
    const grade = getGrade(score, selectedTopic.questions.length);
    const isHighScore = score >= selectedTopic.questions.length * 0.9;

    return (
      <div className={styles.wrapper}>
        <div className="mesh-bg" />
        
        {isHighScore && (
          <div className={styles.confettiContainer}>
            {[...Array(20)].map((_, i) => (
              <div key={i} className={styles.confettiPiece} style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s` }} />
            ))}
          </div>
        )}

        <div className={styles.resultCard}>
          <div className={styles.gradeBadge} style={{ color: grade.color, borderColor: grade.color }}>
            {grade.title}
          </div>
          <h1 className={styles.resultTitle}>QUIZ COMPLETED</h1>
          <div className={styles.scoreCircle} style={{ borderColor: grade.color, boxShadow: `0 0 30px ${grade.color}33` }}>
            <span className={styles.scoreText}>{score}/{selectedTopic.questions.length}</span>
          </div>
          <p className={styles.resultMsg}>
            {score === selectedTopic.questions.length
              ? "PERFECT SCORE! You are a true Election Expert."
              : score >= selectedTopic.questions.length * 0.6
              ? "Great job! You have a solid understanding of the election process."
              : "Keep learning! Explore our guide to boost your knowledge."}
          </p>
          <div className={styles.resultActions}>
            <button className={styles.resetBtn} onClick={resetQuiz}>
              <RotateCcw size={20} />
              TRY ANOTHER
            </button>
            <Link href="/guide">
              <button className="btn-primary">STUDY THE GUIDE</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ═══ QUIZ QUESTION ═══
  const currentQ = selectedTopic.questions[currentIdx];

  return (
    <div className={styles.wrapper}>
      <div className="mesh-bg" />
      <div className="noise-overlay" />
      
      <div className={styles.quizContainer}>
        <button className={styles.backBtn} onClick={resetQuiz}>
          <ChevronLeft size={18} />
          ALL TOPICS
        </button>

        <div className={styles.progress}>
          <div 
            className={styles.progressBar} 
            style={{ width: `${((currentIdx + 1) / selectedTopic.questions.length) * 100}%` }} 
          />
        </div>

        <div className={styles.questionSection}>
          <span className={styles.qCount}>QUESTION {currentIdx + 1} OF {selectedTopic.questions.length}</span>
          <h2 className={styles.questionText}>{currentQ.question}</h2>
        </div>

        <div className={styles.optionsGrid}>
          {currentQ.options.map((option, i) => (
            <button
              key={i}
              className={`
                ${styles.optionBtn} 
                ${selectedOption === i ? (i === currentQ.correctIndex ? styles.correct : styles.wrong) : ""}
                ${isAnswered && i === currentQ.correctIndex ? styles.correct : ""}
              `}
              onClick={() => handleOptionSelect(i)}
              disabled={isAnswered}
            >
              <span className={styles.optionLetter}>{String.fromCharCode(65 + i)}</span>
              <span className={styles.optionContent}>{option}</span>
              {isAnswered && i === currentQ.correctIndex && <CheckCircle className={styles.statusIcon} />}
              {isAnswered && selectedOption === i && i !== currentQ.correctIndex && <XCircle className={styles.statusIcon} />}
            </button>
          ))}
        </div>

        {isAnswered && (
          <div className={`${styles.explanation} fade-in-up`}>
            <p>{currentQ.explanation}</p>
            <button className={styles.nextBtn} onClick={nextQuestion}>
              {currentIdx === selectedTopic.questions.length - 1 ? "FINISH" : "NEXT QUESTION"}
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
