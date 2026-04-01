import { useEffect, useRef } from 'react';
import { NumberParam, useQueryParams, withDefault } from 'use-query-params';

import { useExecutionScope } from './ExecutionScope';
import {
  DisplayLayerCellIdxQueryParam,
  DisplayLayerSectionBibliography,
  DisplayLayerSectionParam,
} from '../../constants/globalConstants';
import { asEnumParam } from '../../logic/params';
import { useArticleStore } from '../../store';


const SCROLL_OFFSET = 150;
const MAX_SCROLL_ATTEMPTS = 50;
const SCROLL_RETRY_DELAY = 200;
const STABLE_THRESHOLD = 3; // number of consecutive stable readings before we stop


/**
 * Waits for two animation frames to let layout/paint settle before measuring
 * and retrying the scroll position.
 */
function waitForNextPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    })
  })
}


/**
 * Keeps article navigation state (query params + store selection) in sync with
 * viewport scrolling.
 *
 * Behavior:
 * - Scrolls immediately when the selected cell in the store changes.
 * - On initial load or query-param navigation, retries scrolling until the
 *   target element is present and async content (Suspense, images, iframes)
 *   is considered ready.
 * - Applies a final corrective scroll once content has stabilized.
 */
const ArticleScrollTo = () => {

  const articleReady = useExecutionScope((state) => state.ready);
  const selectedCellIdxFromStore = useArticleStore((state) => state.selectedCellIdx);
  const timerRef = useRef(null);

  const [
    { [DisplayLayerCellIdxQueryParam]: selectedCellIdx, [DisplayLayerSectionParam]: sectionName },
    setQuery,
  ] = useQueryParams({
    [DisplayLayerCellIdxQueryParam]: withDefault(NumberParam, -1),
    [DisplayLayerSectionParam]: asEnumParam([DisplayLayerSectionBibliography]),
  });

  /**
   * Scrolls to the element matching a cell index (or section token) if present.
   * Returns true when a target element was found and scrolled to.
   */
  const moveTo = (idx) => {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return false;
    }

    const element = document.querySelector(`[data-cell-idx='${idx}']`);

    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
      window.scrollTo({ top, behavior: 'auto' });
      return true;
    }

    return false;
  }

  useEffect(() => {
    if (selectedCellIdxFromStore !== -1 && selectedCellIdxFromStore !== selectedCellIdx) {
      moveTo(selectedCellIdxFromStore);
      setQuery({ [DisplayLayerCellIdxQueryParam]: selectedCellIdxFromStore });
    }
  }, [selectedCellIdxFromStore, selectedCellIdx, setQuery]);

  useEffect(() => {
    if (!articleReady || typeof window === 'undefined') {
      return undefined;
    }

    const scrollTarget = sectionName || (selectedCellIdx !== -1 ? selectedCellIdx : null);
    if (scrollTarget === null) {
      return undefined;
    }

    let cancelled = false;

    /**
     * Retries scrolling until the target element's position has stabilized,
     * meaning no layout shift has moved it for STABLE_THRESHOLD consecutive
     * readings. This handles late-loading content (images, iframes, Thebe
     * outputs, Suspense fallbacks) without relying on resource-level checks.
     */
    const scrollWhenReady = async () => {
      let attempts = 0;
      let lastTop = null;
      let stableCount = 0;

      while (!cancelled && attempts < MAX_SCROLL_ATTEMPTS) {
        await waitForNextPaint();

        const element = document.querySelector(`[data-cell-idx='${scrollTarget}']`);
        if (!element) {
          attempts += 1;
          await new Promise((resolve) => {
            timerRef.current = window.setTimeout(resolve, SCROLL_RETRY_DELAY);
          });
          continue;
        }

        const currentTop = element.getBoundingClientRect().top + window.scrollY;

        if (lastTop !== null && Math.abs(currentTop - lastTop) < 2) {
          stableCount += 1;
        } else {
          stableCount = 0;
        }

        lastTop = currentTop;
        moveTo(scrollTarget);

        if (stableCount >= STABLE_THRESHOLD) {
          return;
        }

        attempts += 1;
        await new Promise((resolve) => {
          timerRef.current = window.setTimeout(resolve, SCROLL_RETRY_DELAY);
        });
      }

      if (!cancelled) {
        moveTo(scrollTarget);
      }
    }

    scrollWhenReady();

    return () => {
      cancelled = true;
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    }
  }, [articleReady, selectedCellIdx, sectionName]);

  return null;
}

export default ArticleScrollTo;
