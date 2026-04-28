"use client";

import { useState } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { LayoutDashboard, BookOpen, Map, HelpCircle, Bell, Clock, Menu, X, CheckSquare, Users, Vote, ShieldAlert } from 'lucide-react';

const navItems = [
  { href: '/', label: 'HOME', icon: LayoutDashboard },
  { href: '/guide', label: 'GUIDE', icon: BookOpen },
  { href: '/timeline', label: 'TIMELINE', icon: Clock },
  { href: '/regions', label: 'REGIONS', icon: Map },
  { href: '/registration', label: 'REGISTRATION', icon: CheckSquare },
  { href: '/candidates', label: 'CANDIDATES', icon: Users },
  { href: '/evm', label: 'EVM', icon: Vote },
  { href: '/rights', label: 'RIGHTS', icon: ShieldAlert },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <div className={styles.logoContainer}>
        <Link href="/" className={styles.logo}>
          Elect<span className={styles.logoAccent}>Ed</span>
        </Link>
      </div>

      {/* Desktop Nav */}
      <div className={styles.navLinks}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <Icon size={16} className={styles.navIcon} />
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className={styles.rightSection}>
        <div className={styles.statusIndicator}>
          <div className={styles.pulse} />
          <span>LIVE</span>
        </div>

        <Link href="/registration" className={styles.loginBtn}>LOGIN</Link>

        {/* Mobile Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)}>
          <div className={styles.mobileDrawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>NAVIGATION</span>
              <button className={styles.drawerClose} onClick={() => setMobileOpen(false)}>
                <X size={20} />
              </button>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.mobileLink} ${isActive ? styles.mobileActive : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
