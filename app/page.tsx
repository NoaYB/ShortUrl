'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortUrl('');
    setCopied(false);

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl: url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error creating short link (check if the URL is valid)');
      }

      // Construct the new URL to display to the user
      const fullShortUrl = `${window.location.origin}/${data.shortId}`;
      setShortUrl(fullShortUrl);
      setUrl('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="container">
      <h1>AppReel URL Shortener</h1>
      <p className="subtitle">Enter a long URL and get a short, clean, and easy-to-share link.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="https://example.com/very/long/url..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {shortUrl && (
        <div className="success">
          <p className="success-title">Here is your ready link!</p>
          <div className="short-link-container">
            <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="short-link">
              {shortUrl}
            </a>
            <button
              onClick={copyToClipboard}
              className="copy-btn"
            >
              {copied ? '√ Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
