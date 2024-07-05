import React from 'react';
import clsx from 'clsx';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import { PageMetadata, SkipToContentFallbackId, ThemeClassNames } from '@docusaurus/theme-common';
import { useKeyboardNavigation } from '@docusaurus/theme-common/internal';
import SkipToContent from '@theme/SkipToContent';
import AnnouncementBar from '@theme/AnnouncementBar';
import Navbar from '@theme/Navbar';
import Footer from '@theme/Footer';
import LayoutProvider from '@theme/Layout/Provider';
import ErrorPageContent from '@theme/ErrorPageContent';
import type { Props } from '@theme/Layout';
import { Header } from '@site/src/components/Header';
import useOfficialContentsContext from '@site/src/hooks/useOfficialContentsContext';
import styles from './styles.module.css';

export default function Layout(props: Props): JSX.Element {
  const {
    children,
    noFooter,
    wrapperClassName,
    // Not really layout-related, but kept for convenience/retro-compatibility
    title,
    description,
  } = props;
  const { is_official_domain } = useOfficialContentsContext();

  useKeyboardNavigation();

  return (
    <LayoutProvider>
      <div className={is_official_domain ? '' : 'unofficial-host'}>
        <PageMetadata title={title} description={description} />

        <SkipToContent />

        <AnnouncementBar />
        <Navbar />

        <div
          id={SkipToContentFallbackId}
          className={clsx(ThemeClassNames.wrapper.main, styles.mainWrapper, wrapperClassName)}
        >
          <ErrorBoundary fallback={(params) => <ErrorPageContent {...params} />}>
            {children}
          </ErrorBoundary>
        </div>

        {!noFooter && <Footer />}
      </div>
    </LayoutProvider>
  );
}
