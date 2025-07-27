"use client";

import React from "react";
import { useGame } from '@/contexts/GameContext';
import { useAuthenticator } from '@aws-amplify/ui-react';
import styles from "./NavigationBar.module.css";

interface NavigationBarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: "leaderboard", label: "", icon: "🏆" },
  { id: "shop", label: "", icon: "🎁" },
  { id: "challenge", label: "", icon: "🧩" },
  { id: "profile", label: "", icon: "👤" },
];

export function NavigationBar({ currentView, onViewChange }: NavigationBarProps) {
  return (
    <nav className={styles.navbar}>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          className={`${styles.navButton} ${currentView === item.id ? styles.active : ""}`}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
