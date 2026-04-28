"use client";

import styles from "./Stepper.module.css";
import * as Icons from "lucide-react";
import { Check } from "lucide-react";

interface Step {
  id: string;
  title: string;
  icon: string;
}

interface StepperProps {
  steps: Step[];
  currentStepIndex: number;
  onStepClick: (index: number) => void;
}

export default function Stepper({ steps, currentStepIndex, onStepClick }: StepperProps) {
  return (
    <div className={styles.stepper}>
      {steps.map((step, index) => {
        const IconComponent = (Icons as any)[step.icon] || Icons.Circle;
        const isActive = index === currentStepIndex;
        const isCompleted = index < currentStepIndex;

        return (
          <div 
            key={step.id} 
            className={`${styles.stepWrapper} ${isActive ? styles.active : ""} ${isCompleted ? styles.completed : ""}`}
            onClick={() => onStepClick(index)}
          >
            <div className={styles.iconWrapper}>
              {isCompleted ? <Check size={20} /> : <IconComponent size={20} />}
            </div>
            <div className={styles.labelWrapper}>
              <span className={styles.stepTitle}>{step.title}</span>
              <span className={styles.stepStatus}>
                {isActive ? "In Progress" : isCompleted ? "Completed" : "Pending"}
              </span>
            </div>
            {index < steps.length - 1 && <div className={styles.line} />}
          </div>
        );
      })}
    </div>
  );
}
