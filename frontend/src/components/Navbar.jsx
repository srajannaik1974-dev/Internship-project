import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="landing-navbar">
      <div className="landing-navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="landing-logo">
          <div className="logo-icon">
            <Leaf size={22} />
          </div>
          <div className="logo-text-wrapper">
            <span className="logo-title">
  NutriMind<span className="logo-dot"></span>
</span>
            
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav-links">
          <button onClick={() => scrollToSection('how-it-works')} className="nav-link-btn">
            How It Works
          </button>
          <button onClick={() => scrollToSection('features')} className="nav-link-btn">
            Features
          </button>
          <button onClick={() => scrollToSection('personalization')} className="nav-link-btn">
            Why NutriMind
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="desktop-nav-actions">
          <button
            onClick={() => navigate('/signin')}
            className="btn btn-secondary btn-sm"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/signin')}
            className="btn btn-primary btn-sm"
          >
            <span>Get Started</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer animate-fade-in">
          <button onClick={() => scrollToSection('how-it-works')} className="mobile-nav-btn">
            How It Works
          </button>
          <button onClick={() => scrollToSection('features')} className="mobile-nav-btn">
            Features
          </button>
          <button onClick={() => scrollToSection('personalization')} className="mobile-nav-btn">
            Why NutriMind
          </button>
          <div className="mobile-nav-actions">
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/signin'); }}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/signin'); }}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              <span>Get Started →</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
