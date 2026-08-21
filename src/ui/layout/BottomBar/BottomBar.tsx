import "./BottomBar.css";

export default function BottomBar() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <span>
          Built by{" "}
          <a
            href="https://www.aishaeportfolio.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Aisha Evering
          </a>
        </span>
        <span className="footer-dot">·</span>
        <a
          href="https://github.com/AishaEvering/BioTools"
          target="_blank"
          rel="noopener noreferrer"
        >
          View source on GitHub
        </a>
        <span className="footer-dot">·</span>
        <a
          href="https://github.com/AishaEvering"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub profile
        </a>
        <span className="footer-dot">·</span>
        <span className="footer-note">No data leaves your browser.</span>
      </div>
    </footer>
  );
}
