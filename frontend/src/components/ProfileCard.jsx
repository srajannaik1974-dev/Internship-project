import React from 'react';
import { User, Activity, Heart, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStoredUser } from '../services/api';


const ProfileCard = ({ profile }) => {
  const navigate = useNavigate();

  if (!profile) return null;

  const storedUser = getStoredUser();

  const {
    name = profile?.user?.name || storedUser?.name || 'User',
    age = profile?.age || '--',
    height = profile?.height || '--',
    weight = profile?.weight || '--',
    activity_level = profile?.activity_level || profile?.activityLevel || 'Active',
    diet_preference = profile?.diet_preference || profile?.dietaryGoal || 'No Preference'
  } = profile;

  return (
    <div className="card" style={{ padding: '1.25rem', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <User size={18} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {name}
            </h3>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              Wellness Profile Summary
            </p>
          </div>
        </div>

        <button
          className="btn btn-sm btn-secondary"
          onClick={() => navigate('/profile')}
          title="Edit Profile"
          style={{ flexShrink: 0 }}
        >
          <Edit3 size={14} />
          <span>Edit</span>
        </button>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-subtle)',
        padding: '0.85rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div className="profile-stats-grid">
          <div>
            <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600 }}>AGE</p>
            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{age} yrs</p>
          </div>
          <div>
            <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600 }}>HEIGHT</p>
            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{height} cm</p>
          </div>
          <div>
            <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600 }}>WEIGHT</p>
            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{weight} kg</p>
          </div>
          <div className="profile-stat-activity">
            <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVITY</p>
            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>{activity_level}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
