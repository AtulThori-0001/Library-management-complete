
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiUser, FiLock, FiSave } from 'react-icons/fi';
import { updateMyProfile, changePassword } from '../services/userService';
import { getInitials } from '../utils/helpers';

export default function Profile() {
  const { user, login } = useAuth();
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState({ firstName:'', lastName:'', phone:'', address:'', email:'', department:'', semester:'' });
  const [passwords, setPasswords] = useState({ currentPassword:'', newPassword:'', confirmPassword:'' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setProfile({ firstName:user.firstName||'', lastName:user.lastName||'', phone:user.phone||'', address:user.address||'', email:user.email||'', department:user.department||'', semester:user.semester||'' });
  }, [user]);

  const handleProfileSave = async e => {
    e.preventDefault();
    setLoading(true);
    try { await updateMyProfile(profile); toast.success('Profile updated!'); }
    catch (err) { toast.error(err?.response?.data?.message || 'Update failed'); }
    setLoading(false);
  };

  const handlePasswordSave = async e => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try { await changePassword(passwords); toast.success('Password changed!'); setPasswords({ currentPassword:'', newPassword:'', confirmPassword:'' }); }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed'); }
    setLoading(false);
  };

  const inputStyle = { width:'100%', border:'1px solid var(--border-color)', borderRadius:8, padding:'9px 12px', background:'var(--input-bg)', color:'var(--text-primary)', outline:'none', fontSize:14 };
  const labelStyle = { display:'block', fontSize:13, fontWeight:500, color:'var(--text-secondary)', marginBottom:5 };

  return (
    <div style={{ maxWidth:680 }}>
      <div style={{ marginBottom:24 }}>
        <h4 style={{ fontWeight:700, margin:0 }}>Profile</h4>
        <p style={{ color:'var(--text-secondary)', fontSize:14, marginTop:4 }}>Manage your account settings</p>
      </div>

      <div className="content-card" style={{ marginBottom:20, padding:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:'#2563eb', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:700 }}>{getInitials(user?.firstName, user?.lastName)}</div>
          <div>
            <div style={{ fontWeight:700, fontSize:18 }}>{user?.firstName} {user?.lastName}</div>
            <div style={{ color:'var(--text-secondary)', fontSize:13 }}>@{user?.username} · {user?.email}</div>
            <span className={`badge-custom badge-${user?.role==='ROLE_ADMIN'?'info':'success'}`} style={{ marginTop:6, display:'inline-flex' }}>{user?.role==='ROLE_ADMIN'?'Administrator':'Student'}</span>
          </div>
        </div>
      </div>

      <div style={{ display:'flex', gap:4, marginBottom:16 }}>
        {[{id:'profile',label:'Profile Info',icon:FiUser},{id:'password',label:'Change Password',icon:FiLock}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:'9px 18px', borderRadius:8, border:'1px solid var(--border-color)', background: tab===t.id ? 'var(--primary)' : 'var(--bg-card)', color: tab===t.id ? 'white' : 'var(--text-primary)', cursor:'pointer', fontWeight:600, fontSize:14, display:'flex', alignItems:'center', gap:6 }}><t.icon size={15} />{t.label}</button>
        ))}
      </div>

      <div className="content-card" style={{ padding:24 }}>
        {tab === 'profile' ? (
          <form onSubmit={handleProfileSave}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
              {[['firstName','First Name'],['lastName','Last Name'],['phone','Phone'],['email','Email'],['department','Department'],['semester','Semester']].map(([n,l]) => (
                <div key={n} style={{ marginBottom:14 }}>
                  <label style={labelStyle}>{l}</label>
                  <input name={n} value={profile[n]} onChange={e => setProfile(p => ({...p,[n]:e.target.value}))} style={inputStyle} />
                </div>
              ))}
              <div style={{ gridColumn:'1/-1', marginBottom:14 }}>
                <label style={labelStyle}>Address</label>
                <textarea value={profile.address} onChange={e => setProfile(p => ({...p,address:e.target.value}))} rows={2} style={{...inputStyle, resize:'vertical'}} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary-custom"><FiSave /> {loading ? 'Saving...' : 'Save Changes'}</button>
          </form>
        ) : (
          <form onSubmit={handlePasswordSave}>
            {[['currentPassword','Current Password'],['newPassword','New Password'],['confirmPassword','Confirm New Password']].map(([n,l]) => (
              <div key={n} style={{ marginBottom:16 }}>
                <label style={labelStyle}>{l}</label>
                <input name={n} type="password" value={passwords[n]} onChange={e => setPasswords(p => ({...p,[n]:e.target.value}))} required style={inputStyle} />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary-custom"><FiLock /> {loading ? 'Changing...' : 'Change Password'}</button>
          </form>
        )}
      </div>
    </div>
  );
}
