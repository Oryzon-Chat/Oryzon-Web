(function () {
  
  const RepoApp = 'Oryzon-Chat/Oryzon-App';
  const API_URL = `https://api.github.com/repos/${RepoApp}`;

  const Cache_key = 'oryzon_github_stats_cache';
  const Cache_duration_MS = 10 * 60 * 1000; // its 10 min

  const els = {
    forks: document.getElementById('stat-forks'),
    stars: document.getElementById('stat-stars'),
    watchers: document.getElementById('stat-watchers'),
  };

  if (!els.forks && !els.stars && !els.watchers) return;

  function formatNumber(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(n);
  }

  function animateCount(el, target) {
    if (!el) return;
    const duration = 900;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = formatNumber(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatNumber(target);
      }
    }
    requestAnimationFrame(step);
  }

  function applyStats(data) {
    animateCount(els.forks, data.forks ?? 0);
    animateCount(els.stars, data.stars ?? 0);
    animateCount(els.watchers, data.watchers ?? 0);
  }

  function readCache() {
    try {
      const raw = localStorage.getItem(Cache_key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.timestamp > Cache_duration_MS) return null;
      return parsed.data;
    } catch (e) {
      return null;
    }
  }

  function writeCache(data) {
    try {
      localStorage.setItem(
        Cache_key,
        JSON.stringify({ timestamp: Date.now(), data })
      );
    } catch (e) {
    }
  }

  async function fetchStats() {
    const cached = readCache();
    if (cached) {
      applyStats(cached);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        headers: { Accept: 'application/vnd.github+json' },
      });

      if (!response.ok) {
        throw new Error(`GitHub API responded with ${response.status}`);
      }

      const json = await response.json();

      const data = {
        forks: json.forks_count ?? 0,
        stars: json.stargazers_count ?? 0,
        watchers: json.subscribers_count ?? 0, // subscribers count = watch
      };

      writeCache(data);
      applyStats(data);
    } catch (err) {
      console.warn('[Oryzon] Failed to fetch GitHub stats:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchStats);
  } else {
    fetchStats();
  }
})();