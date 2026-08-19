import React, { useState, useEffect } from 'react';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useApi } from '../hooks/useApi';
import { getProfile, updateProfile, getStoredUser } from '../services/api';
import { User, Save, Edit2, CheckCircle2, ShieldAlert } from 'lucide-react';

const Profile = () => {
  const { data: profileData, loading, error, execute: fetchProfile } = useApi(getProfile, true);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    activity_level: 'Active',
    diet_preference: 'No Preference',
    allergies: '',
    dietary_restrictions: '',
    health_conditions: '',
    additional_notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const storedUser = getStoredUser();
    const p = profileData?.data || profileData;
    if (p) {
      setFormData({
        name: p.name || p.user?.name || storedUser?.name || '',
        age: p.age ?? '',
        height: p.height ?? '',
        weight: p.weight ?? '',
        activity_level: p.activity_level || p.activityLevel || 'Active',
        diet_preference: p.diet_preference || p.dietaryGoal || 'No Preference',
        allergies: p.allergies || '',
        dietary_restrictions: p.dietary_restrictions || '',
        health_conditions: p.health_conditions || (Array.isArray(p.healthConditions) ? p.healthConditions.join(', ') : p.healthConditions) || '',
        additional_notes: p.additional_notes || ''
      });
    } else if (storedUser?.name) {
      setFormData(prev => ({ ...prev, name: storedUser.name }));
    }
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required.";
    }

    const ageNum = Number(formData.age);
    if (!formData.age || isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      newErrors.age = "Please enter a valid age between 1 and 120.";
    }

    const heightNum = Number(formData.height);
    if (!formData.height || isNaN(heightNum) || heightNum <= 30 || heightNum > 270) {
      newErrors.height = "Please enter a valid height in cm (e.g. 150-220).";
    }

    const weightNum = Number(formData.weight);
    if (!formData.weight || isNaN(weightNum) || weightNum <= 10 || weightNum > 300) {
      newErrors.weight = "Please enter a valid weight in kg (e.g. 30-150).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateProfile(formData);
      setSaveSuccess(true);
      setIsEditing(false);
      await fetchProfile();
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingState message="Loading your wellness profile..." />;
  if (error) return <ErrorState message={error} onRetry={fetchProfile} />;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '840px', margin: '0 auto', paddingBottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.25rem'
      }}>
        <div>
          <h1 className="h1-heading" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'clamp(1.2rem, 5vw, 1.6rem)' }}>
            <User size={22} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span>My Health Profile</span>
          </h1>
          <p className="subtitle" style={{ fontSize: 'clamp(0.8rem, 3vw, 0.95rem)' }}>
            Help us personalize your food and wellness guidance.
          </p>
        </div>

        {!isEditing ? (
          <button
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
            style={{ flexShrink: 0 }}
          >
            <Edit2 size={16} />
            <span>Edit Profile</span>
          </button>
        ) : (
          <button
            className="btn btn-secondary"
            onClick={() => {
              setIsEditing(false);
              setErrors({});
            }}
            style={{ flexShrink: 0 }}
          >
            Cancel
          </button>
        )}
      </div>

      {saveSuccess && (
        <div style={{
          backgroundColor: 'var(--primary-light)',
          border: '1px solid var(--color-success)',
          color: 'var(--color-success)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={20} />
          <span>Profile updated successfully! Your personalized guidance is active.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="card" style={{ padding: 'clamp(1rem, 4vw, 2rem)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Basic Personal Metrics */}
        <div>
          <h3 className="h3-heading" style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
            Basic Information
          </h3>
          <div className="profile-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">
                Full Name *
              </label>
              <input
                id="profile-name"
                name="name"
                type="text"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g. Jane Doe"
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-age">
                Age (years) *
              </label>
              <input
                id="profile-age"
                name="age"
                type="number"
                className="form-input"
                value={formData.age}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g. 20"
              />
              {errors.age && <span className="form-error">{errors.age}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-height">
                Height (cm) *
              </label>
              <input
                id="profile-height"
                name="height"
                type="number"
                className="form-input"
                value={formData.height}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g. 152"
              />
              {errors.height && <span className="form-error">{errors.height}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-weight">
                Weight (kg) *
              </label>
              <input
                id="profile-weight"
                name="weight"
                type="number"
                className="form-input"
                value={formData.weight}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g. 45"
              />
              {errors.weight && <span className="form-error">{errors.weight}</span>}
            </div>
          </div>
        </div>

        {/* Wellness & Dietary Preferences */}
        <div>
          <h3 className="h3-heading" style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
            Wellness & Lifestyle
          </h3>
          <div className="profile-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="profile-activity">
                Activity Level
              </label>
              <select
                id="profile-activity"
                name="activity_level"
                className="form-select"
                value={formData.activity_level}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="Sedentary">Sedentary (Little or no exercise)</option>
                <option value="Lightly Active">Lightly Active (1-3 days/week)</option>
                <option value="Active">Active (Moderate exercise/sports 3-5 days/week)</option>
                <option value="Very Active">Very Active (Hard exercise/sports 6-7 days/week)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-diet">
                Diet Preference
              </label>
              <select
                id="profile-diet"
                name="diet_preference"
                className="form-select"
                value={formData.diet_preference}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="No Preference">No Preference</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Eggetarian">Eggetarian</option>
                <option value="Keto">Keto</option>
                <option value="Low Carb">Low Carb</option>
              </select>
            </div>
          </div>
        </div>

        {/* Health Conditions & Restrictions */}
        <div>
          <h3 className="h3-heading" style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
            Health Conditions & Restrictions
          </h3>
          <div className="profile-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="profile-allergies">
                Allergies
              </label>
              <input
                id="profile-allergies"
                name="allergies"
                type="text"
                className="form-input"
                value={formData.allergies}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g. Peanuts, Lactose, Gluten (or None)"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-restrictions">
                Dietary Restrictions
              </label>
              <input
                id="profile-restrictions"
                name="dietary_restrictions"
                type="text"
                className="form-input"
                value={formData.dietary_restrictions}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g. Low sodium, sugar free"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label className="form-label" htmlFor="profile-conditions">
              Health Conditions / Relevant Information
            </label>
            <input
              id="profile-conditions"
              name="health_conditions"
              type="text"
              className="form-input"
              value={formData.health_conditions}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="e.g. Diabetes, PCOD, High Blood Pressure (or None)"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profile-notes">
              Additional Notes
            </label>
            <textarea
              id="profile-notes"
              name="additional_notes"
              className="form-textarea"
              rows={3}
              value={formData.additional_notes}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Any additional goals or preferences for your AI wellness guidance..."
            />
          </div>
        </div>

        {/* Form Action */}
        {isEditing && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isSaving}
              style={{ width: '100%' }}
            >
              {isSaving ? (
                <>
                  <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
