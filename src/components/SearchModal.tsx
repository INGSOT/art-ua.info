'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchSection from './SearchSection';
import {
  buildSearchUrl,
  getGlobalSearchResults,
  type GlobalSearchCategoryResult,
} from '../lib/globalSearch';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [categories, setCategories] = useState<GlobalSearchCategoryResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setValue('');
    setSubmittedQuery('');
    setCategories([]);
    setHasSearched(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const runSearch = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setHasSearched(false);
      setSubmittedQuery('');
      setCategories([]);
      return;
    }

    const results = getGlobalSearchResults(trimmed);
    const withHits = results.filter((r) => r.count > 0);

    if (withHits.length === 1) {
      router.push(buildSearchUrl(withHits[0].href, trimmed));
      onClose();
      return;
    }

    setCategories(results);
    setSubmittedQuery(trimmed);
    setHasSearched(true);
  };

  if (!isOpen) return null;

  const withHits = categories.filter((c) => c.count > 0);
  const nothingFound = hasSearched && withHits.length === 0 && submittedQuery;

  return (
    <div className="fixed inset-0 z-[1000]">
      <div
        className="absolute inset-0 bg-black/60"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      />

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#414141] w-[min(1000px,calc(100vw-32px))] h-[740px] max-h-[calc(100vh-24px)] flex flex-col p-[30px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-modal-title"
      >
        <div className="flex shrink-0 items-start justify-between gap-4">
          <div
            id="search-modal-title"
            className="font-bold text-white text-[18px] font-[family-name:var(--font-unbounded)]"
          >
            Пошук
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex shrink-0 items-center justify-center"
            aria-label="Закрити"
          >
            <img src="/yellow_cross.svg" alt="Закрити" className="w-8 h-8 md:w-9 md:h-9" />
          </button>
        </div>

        <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden">
          {!hasSearched ? (
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-0 py-2">
              <div className="w-full shrink-0 [&_section]:bg-transparent [&_section]:p-0">
                <SearchSection
                  placeholder="Пошук учасників, проєктів, послуг, каталогів, новин…"
                  value={value}
                  onChange={setValue}
                  onSearch={runSearch}
                  maxWidthPx={600}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="w-full shrink-0 pt-2 [&_section]:bg-transparent [&_section]:p-0">
                <SearchSection
                  placeholder="Пошук учасників, проєктів, послуг, каталогів, новин…"
                  value={value}
                  onChange={setValue}
                  onSearch={runSearch}
                  maxWidthPx={600}
                />
              </div>

              <div className="mt-6 min-h-0 flex-1 overflow-y-auto">
                {nothingFound && (
                  <p className="font-wix text-center text-white text-[16px] leading-relaxed px-2">
                    За запитом «{submittedQuery}» нічого не знайдено. Спробуйте інші ключові слова.
                  </p>
                )}

                {hasSearched && withHits.length > 1 && (
                  <div className="flex flex-col gap-3 px-1">
                    <p className="font-wix text-[#FECC39] text-[14px] font-semibold mb-1">
                      Оберіть розділ з результатами:
                    </p>
                    <ul className="flex flex-col gap-2 list-none p-0 m-0">
                      {withHits.map((cat) => (
                        <li key={cat.id}>
                          <Link
                            href={buildSearchUrl(cat.href, submittedQuery)}
                            onClick={onClose}
                            className="font-wix flex items-center justify-between gap-4 rounded-none border border-[#5a5a5a] bg-[#343434] px-4 py-3 text-white transition-colors hover:border-[#FECC39] hover:bg-[#3d3d3d]"
                          >
                            <span>{cat.label}</span>
                            <span className="shrink-0 text-[#FECC39] tabular-nums">{cat.count}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {hasSearched && withHits.length > 1 && (
                  <p className="font-wix mt-4 text-center text-[#A0A0A0] text-[13px] px-2">
                    Результати на відповідній сторінці з’являться після переходу за посиланням.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
