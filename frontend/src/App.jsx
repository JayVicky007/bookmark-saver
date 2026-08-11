// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export default function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // --- STATE FOR DARK MODE TOGGLE ---
  // Defaulting to true since your machine is currently rendering a dark layout
  const [darkMode, setDarkMode] = useState(true);

  // --- API CALLS ---
  const fetchBookmarks = async () => {
    try {
      const response = await axios.get(`${API_BASE}/all/`);
      setBookmarks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch bookmarks. Ensure Django server is running.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API_BASE}/add/`, { url: urlInput });
      setUrlInput(''); 
      await fetchBookmarks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save bookmark. Check URL.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bookmark?')) return;
    try {
      await axios.delete(`${API_BASE}/delete/${id}/`);
      await fetchBookmarks();
    } catch (err) {
      setError('Failed to delete the bookmark item.');
      console.error(err);
    }
  };

  // --- DYNAMIC THEMING VALUES ---
  // These variables automatically shift based on your toggle state switch
  const currentBgColor = darkMode ? '#121212' : '#ffffff';
  const currentTextColor = darkMode ? '#e0e0e0' : '#333333';
  const currentCardBg = darkMode ? '#1e1e1e' : '#ffffff';
  const currentCardBorder = darkMode ? '#2d2d2d' : '#e9ecef';
  const currentTitleColor = darkMode ? '#ffffff' : '#1a1a1a';
  const currentSubtitleColor = darkMode ? '#b0b3b8' : '#666666';
  const currentFormBg = darkMode ? '#1a1a1a' : '#f8f9fa';
  const currentFormBorder = darkMode ? '#2d2d2d' : '#e9ecef';

  return (
    // Apply dynamic body background wrapping
    <div style={{...styles.bodyWrapper, backgroundColor: currentBgColor}}>
      <div style={styles.appContainer}>
        
{/* Header Controls Container */}
<header style={styles.header}>
  <div style={styles.headerControls}>
    {/* FIXED: Removed the stray typo syntax characters */}
    <button 
      onClick={() => setDarkMode(!darkMode)} 
      style={styles.toggleButton}
    >
      {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  </div>
  <h1 style={{...styles.mainTitle, color: currentTitleColor}}>🔖 Bookmark Saver</h1>
  <p style={{...styles.subtitle, color: currentSubtitleColor}}>Scrape and archive web titles instantly.</p>
</header>

        {/* Input Form */}
        <form onSubmit={handleSubmit} style={{...styles.formLayout, backgroundColor: currentFormBg, borderColor: currentFormBorder}}>
          <input
            type="url"
            placeholder="https://github.com"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            required
            disabled={loading}
            style={{...styles.textInputField, backgroundColor: currentCardBg, color: currentTextColor, borderColor: currentCardBorder}}
          />
          <button type="submit" disabled={loading} style={styles.submitButton}>
            {loading ? 'Scraping...' : 'Save Link'}
          </button>
        </form>

        {error && <div style={styles.errorFlash}>{error}</div>}

        {/* Content Render Main Space */}
        <main style={styles.listSection}>
          <h2 style={{...styles.sectionTitle, color: currentSubtitleColor, borderColor: currentCardBorder}}>
            Your Dashboard ({bookmarks.length})
          </h2>
          
          {bookmarks.length === 0 ? (
            <p style={{...styles.emptyState, backgroundColor: currentFormBg, borderColor: currentCardBorder, color: currentSubtitleColor}}>
              No links saved yet. Drop a URL above to start scraping!
            </p>
          ) : (
            <div style={styles.cardsGrid}>
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} style={{...styles.cardItem, backgroundColor: currentCardBg, borderColor: currentCardBorder}}>
                  <div style={styles.cardMainContent}>
                    <a 
                      href={bookmark.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={styles.bookmarkLink}
                    >
                      {bookmark.title || bookmark.url}
                    </a>
                    {bookmark.notes && <p style={{...styles.notesText, color: currentTextColor}}>{bookmark.notes}</p>}
                    <span style={styles.timeTag}>
                      Added: {new Date(bookmark.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDelete(bookmark.id)} 
                    style={styles.deleteButton}
                    title="Remove Bookmark"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// --- CONFIGURATION CSS SCHEMA ---
const styles = {
  bodyWrapper: {
    minHeight: '100vh',
    width: '100%',
    paddingTop: '1px', // Prevents margin collapse bugs
    transition: 'background-color 0.2s ease',
  },
  appContainer: {
    maxWidth: '750px',
    margin: '3rem auto',
    padding: '0 1.5rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: '1.5',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2.5rem',
    position: 'relative',
  },
  headerControls: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '1rem',
  },
  toggleButton: {
    padding: '8px 14px',
    fontSize: '0.85rem',
    fontWeight: '600',
    borderRadius: '20px',
    border: '1px solid #ced4da',
    cursor: 'pointer',
    backgroundColor: '#fff',
    color: '#333',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  mainTitle: {
    fontSize: '2.2rem',
    fontWeight: '800',
    margin: '0 0 0.5rem 0',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  subtitle: {
    margin: 0,
    fontSize: '1.1rem',
  },
  formLayout: {
    display: 'flex',
    gap: '12px',
    marginBottom: '2.5rem',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid',
    transition: 'background-color 0.2s, border-color 0.2s',
  },
  textInputField: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid',
    outline: 'none',
  },
  submitButton: {
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: '#0066cc',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  errorFlash: {
    backgroundColor: '#fff5f5',
    color: '#e53e3e',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '2rem',
    borderLeft: '4px solid #e53e3e',
    fontWeight: '500',
  },
  listSection: {
    marginTop: '1rem',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    marginBottom: '1rem',
    borderBottom: '2px solid',
    paddingBottom: '0.5rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1rem',
    borderRadius: '8px',
    border: '2px dashed #ced4da',
  },
  cardsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cardItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    transition: 'background-color 0.2s, border-color 0.2s',
  },
  cardMainContent: {
    flex: 1,
    paddingRight: '16px',
  },
  bookmarkLink: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#0066cc',
    textDecoration: 'none',
    display: 'inline-block',
    marginBottom: '4px',
  },
  notesText: {
    margin: '4px 0 8px 0',
    fontSize: '0.95rem',
  },
  timeTag: {
    display: 'block',
    fontSize: '0.8rem',
    color: '#adb5bd',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    color: '#adb5bd',
    border: 'none',
    fontSize: '1.1rem',
    padding: '4px 8px',
    cursor: 'pointer',
    borderRadius: '4px',
    alignSelf: 'center',
  },
};
