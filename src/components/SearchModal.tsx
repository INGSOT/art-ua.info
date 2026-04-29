'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchSection from './SearchSection';
import {
  buildSearchUrl,
  getGlobalSearchResults,
  getGlobalSearchSuggestions,
  type GlobalSearchCategoryResult,
  type GlobalSearchSuggestion,
} from '../lib/globalSearch';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function SuggestionsList({
  items,
  onPick,
  listId,
}: {
  items: GlobalSearchSuggestion[];
  onPick: (href: string) => void;
  listId: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className="flex w-full max-w-[600px] flex-col">
      <ul
        id={listId}
        role="listbox"
        aria-label="Підказки пошуку"
        className="font-wix m-0 max-h-[min(360px,42vh)] list-none overflow-y-auto rounded-none border border-[#5a5a5a] bg-[#343434] p-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((s) => (
          <li key={s.id} role="option" className="border-b border-[#4a4a4a] last:border-b-0">
            <button
              type="button"
              className="flex w-full cursor-pointer flex-col items-start gap-0.5 px-4 py-3 text-left text-white transition-colors hover:bg-[#3d3d3d] focus-visible:bg-[#3d3d3d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FECC39] focus-visible:ring-inset"
              onClick={() => onPick(s.href)}
            >
              <span className="text-[15px] leading-snug">{s.primary}</span>
              <span className="text-[12px] text-[#A0A0A0]">{s.categoryLabel}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [categories, setCategories] = useState<GlobalSearchCategoryResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const suggestions = useMemo(() => getGlobalSearchSuggestions(value), [value]);

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

  const openSuggestion = (href: string) => {
    router.push(href);
    onClose();
  };

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

  const searchBlock = (
    <div className="w-full shrink-0 [&_section]:bg-transparent [&_section]:p-0">
      <SearchSection
        placeholder="Пошук учасників, проєктів, послуг, каталогів, новин…"
        value={value}
        onChange={setValue}
        onSearch={runSearch}
        maxWidthPx={600}
      />
    </div>
  );

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
              <div className="mx-auto flex w-full max-w-[600px] flex-col items-center gap-4">
                {searchBlock}
                <SuggestionsList
                  items={suggestions}
                  onPick={openSuggestion}
                  listId="search-modal-suggestions-initial"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="w-full shrink-0 pt-2 [&_section]:bg-transparent [&_section]:p-0">
                <div className="mx-auto flex w-full max-w-[600px] flex-col gap-4">
                  {searchBlock}
                  <SuggestionsList
                    items={suggestions}
                    onPick={openSuggestion}
                    listId="search-modal-suggestions-after"
                  />
                </div>
              </div>

              <div className="mt-4 min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
