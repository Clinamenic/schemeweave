import React from 'react';
import { getVersionDisplay } from '../utils/version';

export const StickyFooter: React.FC = () => {
  return (
    <div className="sticky-footer">
      <div className="footer-content">
        <div className="footer-left">
          {/* Empty left side for now */}
        </div>
        
        <div className="footer-right">
          <span className="version-badge">
            {getVersionDisplay()}
          </span>
          <a
            href="https://www.clinamenic.com?ref=schemeweave"
            target="_blank"
            rel="noopener noreferrer"
            className="company-link"
          >
            by Clinamenic LLC
          </a>
        </div>
      </div>
    </div>
  );
};
