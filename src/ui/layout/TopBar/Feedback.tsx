import "./Feedback.css";

export default function Feedback() {
  return (
    <div className="topbar-actions">
      <span className="ta-label">Found this helpful?</span>
      <span className="ta-divider"></span>
      <div className="ta-icons">
        <a href="#" id="feedbackLink" aria-label="Send feedback">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
          </svg>
          <span className="icon-tooltip">Send feedback</span>
        </a>
        <a
          href="https://ko-fi.com/aishaebiotools"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Buy me lunch"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <path d="M18 8h1a3 3 0 010 6h-1" />
            <path d="M2 8h16v6a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
            <path d="M6 2c0 1.1.9 1 .9 2M10 2c0 1.1.9 1 .9 2" />
          </svg>
          <span className="icon-tooltip">Buy me lunch</span>
        </a>
        <a href="#" id="contactLink" aria-label="Contact me">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
          <span className="icon-tooltip">Contact me</span>
        </a>
      </div>
    </div>
  );
}

function initEmailLinks() {
  const user = ["s", "h", "o", "v", "o", "n", "3", "0", "0", "0", "g"].join("");
  const domain = ["gmail", "com"].join(".");

  const contactTag = ["+", "b", "i", "o", "t", "o", "o", "l", "s"].join("");
  const contactLink = document.getElementById("contactLink");
  if (contactLink instanceof HTMLAnchorElement && contactLink)
    contactLink.href = "mailto:" + user + contactTag + "@" + domain;

  const feedbackTag = [
    "+",
    "b",
    "i",
    "o",
    "t",
    "o",
    "o",
    "l",
    "s",
    "+",
    "f",
    "e",
    "e",
    "d",
    "b",
    "a",
    "c",
    "k",
  ].join("");
  const feedbackLink = document.getElementById("feedbackLink");
  if (feedbackLink instanceof HTMLAnchorElement && feedbackLink)
    feedbackLink.href =
      "mailto:" +
      user +
      feedbackTag +
      "@" +
      domain +
      "?subject=" +
      encodeURIComponent("BioTools feedback");
}
initEmailLinks();
