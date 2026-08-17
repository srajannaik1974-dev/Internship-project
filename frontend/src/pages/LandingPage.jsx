import React from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  User,
  Lightbulb,
  CheckCircle2,
  Utensils
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-app)', minHeight: '100vh' }}>
      {/* Top Navbar */}
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="landing-hero animate-fade-in">
        <div className="hero-grid">
          {/* Hero Left Content */}
          <div className="hero-copy">
            <div className="hero-pill-badge">
              
              <span>There's More to Every Bite.</span>
            </div>

            <h1 className="hero-title">
  Your plate,
  <br />
  finally <span className="highlight-accent">legible.</span>
</h1>

            <p className="hero-subtitle">
No barcode. No guesswork. Snap your real meal — NutriMind reads the plate and hands you honest numbers: protein, carbs, and calories, in seconds.            </p>

            <div className="hero-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/signin')}
              >
                <span>Analyze a meal</span>
                <ArrowRight size={18} />
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => scrollToSection('features')}
              >
                What's NutriMind
              </button>
            </div>

            <div className="hero-proof">
              
              <strong>Track what's in your meal before Your Next Bite.</strong>
            </div>
          </div>

          {/* Hero Right — food video + analysis card */}
          <div className="hero-food-wrapper">
            <div className="hero-food-image-container">
              <video
                src="/videos/food.mp4"
                autoPlay
                loop
                muted
                playsInline
                poster="/hero-food-poster.jpg"
                className="hero-food-video"
              />

              <div className="hero-food-overlay" />
               <div className="real-meal-label">
    REAL MEAL
  </div>

              {/* Top-right status pill */}
              <div className="hero-meals-pill">
                <CheckCircle2 size={15} />
                <span>3 meals logged today</span>
              </div>

              {/* THIS CARD IS INSIDE THE IMAGE CONTAINER */}
              <div className="hero-analysis-card">
                <div className="hero-analysis-header">
                  <div className="hero-analysis-label">
                    <span className="hero-analysis-dot" />
                    <span>NUTRIMIND ANALYSIS</span>
                  </div>
                  <span className="hero-analysis-match">96% MATCH</span>
                </div>

                <h3>Your Meal</h3>
                <p className="hero-analysis-food">
                  Poke bowl · tofu, salmon, brown rice, greens
                </p>

                <div className="hero-nutrition-grid">
                  <div className="hero-nutrition-item">
                    <strong>38</strong><span>g</span>
                    <small>PROTEIN</small>
                  </div>
                  <div className="hero-nutrition-item">
                    <strong>52</strong><span>g</span>
                    <small>CARBS</small>
                  </div>
                  <div className="hero-nutrition-item">
                    <strong>14</strong><span>g</span>
                    <small>FAT</small>
                  </div>
                  <div className="hero-nutrition-item hero-nutrition-kcal">
                    <strong>490</strong>
                    <small>KCAL</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST / VALUE STRIP */}
      <section className="value-strip-section">
        <div className="value-strip-container">
          <p className="value-strip-title">
            Everything you need to understand your everyday food choices
          </p>
          <div className="grid-3">
            <div className="card card-hover" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                <Sparkles size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>AI Food Analysis</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Understand what you're eating instantly with context-aware analysis.</p>
            </div>

            <div className="card card-hover" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                <User size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Personalized Guidance</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Get suggestions based on your health profile and food history.</p>
            </div>

            <div className="card card-hover" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                <BookOpen size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Smart Food Diary</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Keep track of your meals and discover your eating patterns over time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '5rem 1.5rem', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', uppercase: true, letterSpacing: '0.06em' }}>
            SIMPLE WORKFLOW
          </span>
          <h2 className="h1-heading" style={{ fontSize: '2.25rem', marginTop: '0.35rem' }}>
            How NutriMind works
          </h2>
          <p className="subtitle" style={{ fontSize: '1.05rem', maxWidth: '540px', margin: '0.5rem auto 0 auto' }}>
            From your plate to a smarter food choice in three simple steps.
          </p>
        </div>

        <div className="grid-3">
          <div className="step-card">
            <div className="step-number">01</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Tell us what you ate
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Type your food description or upload a photo of your meal. NutriMind accepts images or simple text like "I'm eating a samosa".
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Understand your food
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              NutriMind analyzes your meal, generates a non-alarmist risk badge (Low, Moderate, Higher Concern), and delivers practical wellness suggestions.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Build better habits
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Save meals to your food diary, review historical patterns by date, and receive ongoing daily AI insights.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FEATURE SECTION */}
      <section id="features" style={{ padding: '5rem 1.5rem', backgroundColor: '#ffffff', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', uppercase: true, letterSpacing: '0.06em' }}>
              POWERFUL FEATURES
            </span>
            <h2 className="h1-heading" style={{ fontSize: '2.25rem', marginTop: '0.35rem' }}>
              Your food. Your context. Your guidance.
            </h2>
          </div>

          <div className="grid-2">
            <div className="feature-card">
              <div className="feature-icon-box">
                <Sparkles size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>AI Food Analysis</h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Analyze the food you're eating and understand it in context. Get clear feedback without terrifying medical jargon or arbitrary calorie obsession.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <User size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>Personal Health Profile</h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Tell NutriMind about your preferences, activity, height, weight, allergies, and dietary restrictions so recommendations fit your exact life.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <BookOpen size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>Smart Food Diary</h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Keep your meals organized in a timeline view. Revisit your history by date and inspect details with a single tap.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <Lightbulb size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>Daily Insights</h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Get simple, actionable daily insights based on what you've logged throughout the morning, afternoon, and evening.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PERSONALIZATION SECTION */}
      <section id="personalization" style={{ padding: '5rem 1.5rem', maxWidth: '1240px', margin: '0 auto' }}>
        <div className="personalization-box">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-primary-soft)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              TAILORED RECOMMENDATIONS
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.35rem', color: '#ffffff' }}>
              Food advice should be personal.
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#caa1a0c9', marginTop: '0.75rem', lineHeight: 1.6 }}>
              Your food choices don't exist in isolation. NutriMind considers your health profile, activity levels, and daily food history to make its guidance relevant specifically to you.
            </p>
          </div>

          <div className="flow-diagram-container">
            <div className="flow-node">
              <User size={18} style={{ marginBottom: '0.2rem' }} />
              <div>Your Profile</div>
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>+</span>
            <div className="flow-node">
              <Utensils size={18} style={{ marginBottom: '0.2rem' }} />
              <div>Today's Food</div>
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>+</span>
            <div className="flow-node">
              <BookOpen size={18} style={{ marginBottom: '0.2rem' }} />
              <div>Food History</div>
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>↓</span>
            <div className="flow-result-node">
              
              Personalized Guidance
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA BANNER */}
      <section style={{ padding: '3rem 1.5rem 5rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="cta-banner">
          <h2 className="h1-heading" style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>
            Ready to understand your food better?
          </h2>
          <p className="subtitle" style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
            Start building a smarter relationship with what you eat every day.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/signin')}
            >
              <span>Get Started</span>
              <ArrowRight size={18} />
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => navigate('/signin')}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-top">
            <div>
              <div className="landing-logo" style={{ marginBottom: '0.35rem' }}>
                <div className="logo-icon">
                  <Utensils size={20} />
                </div>
                <span className="logo-title">NutriMind</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Small choices. Better habits. A healthier you.
              </p>
            </div>

            <div className="footer-links">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                Home
              </button>
              <button onClick={() => scrollToSection('features')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                Features
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                How It Works
              </button>
              <button onClick={() => navigate('/signin')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                Sign In
              </button>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 NutriMind. All rights reserved.</span>
            <span>AI Food & Wellness Assistant.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;