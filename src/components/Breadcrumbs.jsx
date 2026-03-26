import React from 'react';
import { Link } from 'react-router-dom';
import { Home as House, ChevronRight } from 'lucide-react';

/**
 * Breadcrumbs
 *
 * Props:
 *   items — array of { label: string, href?: string }
 *
 * The first item gets the Home icon. The last item is the current page
 * (non-clickable, darker weight). All other items are links.
 */
const Breadcrumbs = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1 text-sm">
      {items.map((item, index) => {
        const isFirst = index === 0;
        const isLast  = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {/* Separator (not before first item) */}
            {!isFirst && (
              <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
            )}

            {isLast ? (
              /* Current page — not a link */
              <span className="text-gray-900 font-medium flex items-center gap-1">
                {isFirst && <House size={14} className="flex-shrink-0" />}
                {item.label}
              </span>
            ) : item.href ? (
              /* Clickable link */
              <Link
                to={item.href}
                className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
              >
                {isFirst && <House size={14} className="flex-shrink-0" />}
                {item.label}
              </Link>
            ) : (
              /* Has no href — render as plain text */
              <span className="text-gray-500 flex items-center gap-1">
                {isFirst && <House size={14} className="flex-shrink-0" />}
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
