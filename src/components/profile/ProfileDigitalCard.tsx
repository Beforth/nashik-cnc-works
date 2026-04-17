'use client';

import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { COMPANY } from '@/src/constants';
import { HOW_WE_WORK_ROWS, SPECIALITIES } from '@/src/components/profile/profile-data';
import { profileTopBarKicker } from '@/src/lib/profile-top-bar-kicker';
import type { ProfileCmsPayload } from '@/src/types/profile-cms';
import { isValidEmailFormat } from '@/src/lib/email-format';
import { indianMobileDigitsForWaMe, parseIndianMobile10 } from '@/src/lib/indian-mobile-wa';

const RATINGS = ['Excellent', 'Very Good', 'Average', 'Poor', 'Terrible'] as const;

export default function ProfileDigitalCard({
  cms,
  initialOrigin = '',
}: {
  cms: ProfileCmsPayload;
  /** Set on the server so share URL / QR work on first paint (no client round-trip). */
  initialOrigin?: string;
}) {
  const { settings, services: cmsServices, galleryImages } = cms;
  const phoneDigits10 = indianMobileDigitsForWaMe(settings.phone);
  const waMeNational = `91${phoneDigits10}`;
  const topKicker = profileTopBarKicker(settings.companyName, settings.address);

  const profileWaHref = useCallback(
    (text: string) => `https://wa.me/${waMeNational}?text=${encodeURIComponent(text)}`,
    [waMeNational],
  );
  const [origin, setOrigin] = useState(initialOrigin);
  const [viewCountLabel, setViewCountLabel] = useState('…');
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [fbName, setFbName] = useState('');
  const [fbText, setFbText] = useState('');
  const [fbSubmitting, setFbSubmitting] = useState(false);
  const [fbSuccess, setFbSuccess] = useState(false);
  const [copyToast, setCopyToast] = useState(false);
  const [enqName, setEnqName] = useState('');
  const [enqPhone, setEnqPhone] = useState('');
  const [enqEmail, setEnqEmail] = useState('');
  const [enqService, setEnqService] = useState('');
  const [enqMsg, setEnqMsg] = useState('');
  const [enqSubmitting, setEnqSubmitting] = useState(false);
  const [enqSuccess, setEnqSuccess] = useState(false);
  const [enqError, setEnqError] = useState<string | null>(null);
  const [enqWarning, setEnqWarning] = useState<string | null>(null);
  const [waNumber, setWaNumber] = useState('');

  const profileUrl = origin ? `${origin}/profile` : '';

  useEffect(() => {
    if (initialOrigin) return;
    if (typeof window === 'undefined') return;
    setOrigin(window.location.origin);
  }, [initialOrigin]);

  useEffect(() => {
    if (!origin) return;
    setViewCountLabel('…');
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      fetch('/api/profile-view', { method: 'POST', headers: { Accept: 'application/json' } })
        .then((res) =>
          res.text().then((t) => {
            if (cancelled) return;
            let d: { count?: number } = {};
            try {
              d = t ? (JSON.parse(t) as { count?: number }) : {};
            } catch {
              d = {};
            }
            if (res.ok && typeof d.count === 'number') {
              try {
                setViewCountLabel(Number(d.count).toLocaleString('en-IN'));
              } catch {
                setViewCountLabel(String(d.count));
              }
            } else {
              setViewCountLabel('—');
            }
          }),
        )
        .catch(() => {
          if (!cancelled) setViewCountLabel('—');
        });
    };
    const idle = typeof requestIdleCallback !== 'undefined' ? requestIdleCallback(run, { timeout: 2000 }) : null;
    const t = idle == null ? window.setTimeout(run, 1) : null;
    return () => {
      cancelled = true;
      if (idle != null) cancelIdleCallback(idle);
      if (t != null) window.clearTimeout(t);
    };
  }, [origin]);

  const copyProfile = useCallback(() => {
    const url = profileUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/profile`;
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(url).catch(() => {});
    } else {
      const t = document.createElement('textarea');
      t.value = url;
      document.body.appendChild(t);
      t.select();
      try {
        document.execCommand('copy');
      } catch {
        /* ignore */
      }
      document.body.removeChild(t);
    }
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  }, [profileUrl]);

  const shareProfileWhatsApp = () => {
    const msg = `${settings.companyName} — profile: ${profileUrl || window.location.origin + '/profile'}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  const downloadQR = () => {
    const u = profileUrl || `${window.location.origin}/profile`;
    const a = document.createElement('a');
    a.href = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(u)}&color=E65C00`;
    a.download = 'karan-engineers-profile-qr.png';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  };

  const shareToNumber = () => {
    const num = waNumber.trim();
    if (num.length < 10) {
      window.alert('Please enter a valid 10-digit number.');
      return;
    }
    const text = `${settings.companyName} — ${profileUrl || window.location.origin + '/profile'}`;
    window.open(`https://wa.me/91${num}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const submitFeedback = () => {
    if (!selectedRating) {
      window.alert('Please select a rating.');
      return;
    }
    const name = fbName.trim();
    const text = fbText.trim();
    if (!name) {
      window.alert('Please enter your name.');
      return;
    }
    setFbSubmitting(true);
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: selectedRating, name, message: text }),
    })
      .then((res) =>
        res.text().then((t) => {
          let data: { error?: string } = {};
          try {
            data = t ? (JSON.parse(t) as { error?: string }) : {};
          } catch {
            data = {};
          }
          if (!res.ok) {
            throw new Error(data.error || `Could not save (${res.status}).`);
          }
          setFbSuccess(true);
          setFbName('');
          setFbText('');
          setSelectedRating(null);
          setTimeout(() => setFbSuccess(false), 4000);
        }),
      )
      .catch((err: Error) => {
        window.alert(err.message || 'Could not save feedback.');
      })
      .finally(() => setFbSubmitting(false));
  };

  const submitEnquiry = (e?: React.FormEvent) => {
    e?.preventDefault();
    const name = enqName.trim();
    const phoneRaw = enqPhone.trim();
    const email = enqEmail.trim();
    const service = enqService.trim();
    const msg = enqMsg.trim();
    const phoneDigits = parseIndianMobile10(phoneRaw);

    setEnqSuccess(false);
    setEnqWarning(null);

    if (!name) {
      setEnqError('Please enter your name.');
      return;
    }
    if (name.length < 2) {
      setEnqError('Please enter your name (at least 2 characters).');
      return;
    }
    if (!phoneDigits) {
      setEnqError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!email) {
      setEnqError('Please enter your email address.');
      return;
    }
    if (!isValidEmailFormat(email)) {
      setEnqError('Please enter a valid email address.');
      return;
    }

    setEnqError(null);
    setEnqSubmitting(true);

    const material = service || 'General enquiry';
    const requirements = ['Source: Digital profile (/profile)', msg].filter(Boolean).join('\n\n');

    fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone: phoneDigits,
        email,
        material,
        qty: '',
        requirements,
      }),
    })
      .then((res) =>
        res.text().then((t) => {
          let data: { error?: string; warning?: string } = {};
          try {
            data = t ? (JSON.parse(t) as { error?: string; warning?: string }) : {};
          } catch {
            data = {};
          }
          if (!res.ok) {
            throw new Error(typeof data.error === 'string' ? data.error : 'Could not save your enquiry.');
          }
          setEnqError(null);
          if (typeof data.warning === 'string' && data.warning.length > 0) {
            setEnqWarning(data.warning);
          }
          setEnqSuccess(true);
          setEnqName('');
          setEnqPhone('');
          setEnqEmail('');
          setEnqService('');
          setEnqMsg('');
          window.setTimeout(() => {
            setEnqSuccess(false);
            setEnqWarning(null);
          }, 6000);
        }),
      )
      .catch((err: Error) => {
        setEnqError(err.message || 'Could not save your enquiry. Try again or call us.');
      })
      .finally(() => setEnqSubmitting(false));
  };

  const qrSrc =
    profileUrl.length > 0
      ? `https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(profileUrl)}&color=E65C00`
      : '';

  return (
    <div className="vcard-scope">
      <div className={`copy-toast${copyToast ? ' is-visible' : ''}`} id="copyToast" aria-live="polite">
        Profile link copied!
      </div>

      <div className="page">
        <div className="top-bar">
          GST <strong>{settings.gstin}</strong> · {topKicker}
        </div>

        <div className="hero" id="home-section">
          <div className="hero-logo">
            <img
              src="/logo.png"
              width={96}
              height={64}
              alt={settings.companyName}
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <h1>{settings.companyName}</h1>
          <p className="tagline">{COMPANY.listingSummary}</p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <span
              className="views-badge"
              id="profileViewsWrap"
              role="status"
              aria-live="polite"
              aria-atomic="true"
              title="How many times this profile page was opened"
            >
              <svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                style={{ flexShrink: 0, opacity: 0.95 }}
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span id="profileViewCount">{viewCountLabel}</span> views
            </span>
          </div>
        </div>

        <div className="actions">
          <a className="act-btn" href={`tel:+91${phoneDigits10}`}>
            <div className="act-icon">
              <svg width={18} height={18} fill="none" stroke="#E65C00" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
              </svg>
            </div>
            <span className="act-label">Call Me</span>
          </a>
          <a
            className="act-btn"
            href={profileWaHref(`Hello, I would like to get a quote from ${settings.companyName}.`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="act-icon">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="#E65C00">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <span className="act-label">Whatsapp</span>
          </a>
          <a className="act-btn" href={settings.googleMapsUrl} target="_blank" rel="noopener noreferrer">
            <div className="act-icon">
              <svg width={18} height={18} fill="none" stroke="#E65C00" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <span className="act-label">Direction</span>
          </a>
          <a className="act-btn" href={`mailto:${settings.email}`} rel="noopener noreferrer">
            <div className="act-icon">
              <svg width={18} height={18} fill="none" stroke="#E65C00" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <span className="act-label">Mail</span>
          </a>
        </div>

        <div className="contact-strip">
          <div className="cinfo-row">
            <div className="cinfo-icon">
              <svg width={16} height={16} fill="none" stroke="#E65C00" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="cinfo-text">
              <a href={settings.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                {settings.address}
              </a>
            </div>
          </div>
          <div className="cinfo-row">
            <div className="cinfo-icon">
              <svg width={16} height={16} fill="none" stroke="#E65C00" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div className="cinfo-text">
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </div>
          </div>
          <div className="cinfo-row">
            <div className="cinfo-icon">
              <svg width={16} height={16} fill="none" stroke="#E65C00" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
              </svg>
            </div>
            <div className="cinfo-text">
              <a href={`tel:+91${phoneDigits10}`}>{settings.phoneFormatted}</a>
            </div>
          </div>
        </div>

        <Link className="save-card-btn" href="/">
          Visit full website
        </Link>

        <div className="section" id="about-us-section">
          <div className="section-title">About Us</div>
          <table className="about-table">
            <tbody>
              <tr>
                <td>Business Name :</td>
                <td>{settings.companyName}</td>
              </tr>
              <tr>
                <td>Nature Of Business :</td>
                <td>{COMPANY.natureOfBusiness}</td>
              </tr>
              <tr>
                <td>GST Number :</td>
                <td>{settings.gstin}</td>
              </tr>
              <tr>
                <td>GST Registration :</td>
                <td>{COMPANY.gstRegistrationDate}</td>
              </tr>
              <tr>
                <td>Contact Person :</td>
                <td>{settings.contactName}</td>
              </tr>
            </tbody>
          </table>
          <p className="spec-heading">Our Specialities</p>
          <ul className="spec-list">
            {SPECIALITIES.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="about-desc">
            <strong>{settings.companyName}</strong> — job work, machined components, turning, milling &amp; CNC (GST{' '}
            <strong>{settings.gstin}</strong>). Based in <strong>{settings.address}</strong>, we supply high-precision
            job work and machined parts for the <strong>power sector, automobile industry</strong>, and general
            engineering.
            <br />
            <br />
            Share your drawing via WhatsApp, email, or the enquiry form on our website — we review
            scope, quote, manufacture to agreed drawings, then inspect, pack, and dispatch.
          </p>
        </div>

        <div className="section" id="products-services-section">
          <div className="section-title">Our Services</div>
          <div className="services-list">
            {cmsServices.map((s) => (
              <div key={s.id} className="service-card">
                <div className="service-card-inner">
                  <img
                    className="service-img"
                    src={s.imageUrl}
                    alt={s.name}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                  <div className="service-info">
                    <div>
                      <p className="service-name">{s.name}</p>
                      <p className="service-desc">{s.description}</p>
                    </div>
                    <a
                      className="enq-btn"
                      href={profileWaHref(`Hello, I would like to get a quote for ${s.name}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Enquiry
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section" id="how-we-work-section">
          <div className="section-title">How we work</div>
          <table className="about-table">
            <tbody>
              {HOW_WE_WORK_ROWS.map((row) => (
                <tr key={row.left}>
                  <td>{row.left}</td>
                  <td>{row.right}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 12, color: 'var(--subtext)', marginTop: 12, lineHeight: 1.6 }}>
            UPI, bank transfer, and invoicing details are shared when you confirm an order — contact us on{' '}
            <a href={`tel:+91${phoneDigits10}`} style={{ color: 'var(--orange)' }}>
              {settings.phoneFormatted}
            </a>{' '}
            or WhatsApp.
          </p>
        </div>

        <div className="section" id="gallery-section">
          <div className="section-title">Gallery</div>
          <div className="gallery-grid">
            {galleryImages.map((g, i) => (
              <img
                key={`${g.src}-${g.alt}-${i}`}
                className="gal-img"
                src={g.src}
                alt={g.alt}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
        </div>

        <div className="section" id="feedback-section">
          <div className="section-title">Feedbacks</div>
          <div className="feedback-form">
            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 4 }}>Give Feedback</p>
            <div className="rating-row" id="ratingRow">
              {RATINGS.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`rating-opt${selectedRating === r ? ' active' : ''}`}
                  onClick={() => setSelectedRating(r)}
                >
                  {r}
                </button>
              ))}
            </div>
            <input
              className="fb-name"
              type="text"
              placeholder="Your Name"
              id="fbName"
              value={fbName}
              onChange={(e) => setFbName(e.target.value)}
            />
            <textarea
              className="fb-input"
              placeholder="Write your feedback here..."
              id="fbText"
              value={fbText}
              onChange={(e) => setFbText(e.target.value)}
            />
            <button type="button" className="fb-submit" id="fbSubmitBtn" onClick={submitFeedback} disabled={fbSubmitting}>
              {fbSubmitting ? 'Submitting…' : 'Submit Feedback'}
            </button>
            <div className={`fb-success${fbSuccess ? ' is-visible' : ''}`} id="fbSuccess">
              ✔ Success: Feedback Given Successfully.
            </div>
          </div>
        </div>

        <div className="section" id="enquiry-section">
          <div className="section-title">Enquiry Form</div>
          <form className="enq-form" onSubmit={submitEnquiry} noValidate>
            <input
              type="text"
              placeholder="Your Name *"
              id="enqName"
              name="enqName"
              value={enqName}
              onChange={(e) => {
                setEnqName(e.target.value);
                setEnqError(null);
              }}
              autoComplete="name"
              maxLength={200}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number * (10 digits)"
              id="enqPhone"
              name="enqPhone"
              value={enqPhone}
              onChange={(e) => {
                setEnqPhone(e.target.value);
                setEnqError(null);
              }}
              autoComplete="tel"
              maxLength={40}
              inputMode="numeric"
              required
            />
            <input
              type="email"
              placeholder="Email Address *"
              id="enqEmail"
              name="enqEmail"
              value={enqEmail}
              onChange={(e) => {
                setEnqEmail(e.target.value);
                setEnqError(null);
              }}
              autoComplete="email"
              maxLength={254}
              required
            />
            <select
              id="enqService"
              name="enqService"
              value={enqService}
              onChange={(e) => {
                setEnqService(e.target.value);
                setEnqError(null);
              }}
            >
              <option value="" disabled>
                Select Service...
              </option>
              {cmsServices.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
            <textarea
              placeholder="Describe your requirements..."
              id="enqMsg"
              name="enqMsg"
              value={enqMsg}
              onChange={(e) => {
                setEnqMsg(e.target.value);
                setEnqError(null);
              }}
              maxLength={10_000}
            />
            {enqError ? (
              <p className="enq-error is-visible" role="alert">
                {enqError}
              </p>
            ) : null}
            {enqWarning ? (
              <p className="enq-warning" role="status">
                {enqWarning}
              </p>
            ) : null}
            {enqSuccess ? (
              <p className={`enq-success${enqSuccess ? ' is-visible' : ''}`} role="status">
                Thank you — your enquiry was received. We will get back to you soon.
              </p>
            ) : null}
            <button type="submit" className="enq-submit" disabled={enqSubmitting}>
              {enqSubmitting ? 'Sending…' : 'Send'}
            </button>
          </form>
        </div>

        <div className="section" id="share-section">
          <div className="section-title">Share</div>
          <div className="share-url-box" id="shareUrl">
            {profileUrl || 'Loading…'}
          </div>
          <div className="share-btns">
            <button type="button" className="share-btn share-btn-primary" onClick={copyProfile}>
              Copy Profile Link
            </button>
            <button type="button" className="share-btn share-btn-outline" onClick={shareProfileWhatsApp}>
              Share on WhatsApp
            </button>
          </div>
          <div className="qr-wrap">
            {qrSrc ? (
              <img
                id="qrImg"
                src={qrSrc}
                alt="QR Code for this profile page"
                loading="lazy"
                decoding="async"
              />
            ) : null}
            <p className="qr-label">Scan QR to open profile</p>
            <button
              type="button"
              className="share-btn share-btn-outline"
              style={{ marginTop: 8, width: 'auto', padding: '8px 20px', fontSize: 12 }}
              onClick={downloadQR}
            >
              Save QR
            </button>
          </div>
          <p style={{ fontSize: 12, color: 'var(--subtext)', marginTop: 16, marginBottom: 6 }}>
            Share profile to any WhatsApp number:
          </p>
          <div className="whatsapp-share">
            <div className="wa-prefix">+91</div>
            <input
              className="wa-input"
              type="tel"
              placeholder="Enter number"
              id="waNumber"
              maxLength={10}
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
            />
            <button type="button" className="wa-send" onClick={shareToNumber}>
              Share
            </button>
          </div>
        </div>

        <div className="footer">
          © 2026 <Link href="/">Website home</Link>
        </div>
      </div>

      <nav className="bottom-nav" aria-label="Profile sections">
        <a className="nav-item" href="#home-section">
          <span className="nav-icon" aria-hidden>
            <svg viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </span>
          HOME
        </a>
        <a className="nav-item" href="#about-us-section">
          <span className="nav-icon" aria-hidden>
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </span>
          ABOUT US
        </a>
        <a className="nav-item" href="#products-services-section">
          <span className="nav-icon" aria-hidden>
            <svg viewBox="0 0 24 24">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.76z" />
            </svg>
          </span>
          SERVICES
        </a>
        <a className="nav-item" href="#how-we-work-section">
          <span className="nav-icon" aria-hidden>
            <svg viewBox="0 0 24 24">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </span>
          WORK
        </a>
        <a className="nav-item" href="#gallery-section">
          <span className="nav-icon" aria-hidden>
            <svg viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </span>
          GALLERY
        </a>
        <a className="nav-item" href="#feedback-section">
          <span className="nav-icon" aria-hidden>
            <svg viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          FEEDBACK
        </a>
        <a className="nav-item" href="#enquiry-section">
          <span className="nav-icon" aria-hidden>
            <svg viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          </span>
          ENQUIRY
        </a>
        <a className="nav-item" href="#share-section">
          <span className="nav-icon" aria-hidden>
            <svg viewBox="0 0 24 24">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </span>
          SHARE
        </a>
      </nav>
    </div>
  );
}
