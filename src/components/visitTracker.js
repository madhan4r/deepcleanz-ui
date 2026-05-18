import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TRACKING_API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/v1/tracking`;
const PROJECT_KEY = 'deep-cleanz';
const SESSION_STORAGE_KEY = 'deep-cleanz-tracking-session-id';

function generateSessionId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return `sess_${window.crypto.randomUUID()}`;
  }

  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function getSessionId() {
  const existingSessionId = window.sessionStorage.getItem(SESSION_STORAGE_KEY);

  if (existingSessionId) {
    return existingSessionId;
  }

  const newSessionId = generateSessionId();
  window.sessionStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
  return newSessionId;
}

function getDeviceType() {
  const userAgent = navigator.userAgent.toLowerCase();

  if (/tablet|ipad/.test(userAgent)) {
    return 'tablet';
  }

  if (/mobi|android|iphone|ipod/.test(userAgent)) {
    return 'mobile';
  }

  return 'desktop';
}

function getFormattedDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function VisitTracker() {
  const location = useLocation();

  useEffect(() => {
    const now = new Date();
    const searchParams = new URLSearchParams(location.search);

    const payload = {
      projectKey: PROJECT_KEY,
      sessionId: getSessionId(),
      source: searchParams.get('utm_source') || searchParams.get('source') || '',
      medium: searchParams.get('utm_medium') || searchParams.get('medium') || '',
      campaign: searchParams.get('utm_campaign') || searchParams.get('campaign') || '',
      utmTerm: searchParams.get('utm_term') || '',
      utmContent: searchParams.get('utm_content') || '',
      gclid: searchParams.get('gclid') || '',
      page: `${location.pathname}${location.search}`,
      referrer: document.referrer || '',
      deviceType: getDeviceType(),
      userAgent: navigator.userAgent,
      ip: '',
      date: getFormattedDate(now),
      hour: now.getHours()
    };

    fetch(TRACKING_API_URL, {
      method: 'POST',
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch((error) => {
      // Tracking should never interrupt the user journey.
      console.error('Tracking request failed:', error);
    });
  }, [location.pathname, location.search]);

  return null;
}
