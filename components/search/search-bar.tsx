"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks/use-debounce";

interface SearchBarProps {
  initialValue?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  isSearching?: boolean;
  className?: string;
}

export function SearchBar({
  initialValue = "",
  onSearch,
  placeholder = "ابحث باسم المستشفى، الطبيب، التخصص، أو العنوان...",
  isSearching = false,
  className,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const debouncedSearch = useDebounce(searchTerm, 250);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastSearchedRef = useRef<string>(initialValue);
  const isInitialMount = useRef(true);

  // Sync state ONLY when external initialValue changes (e.g. filter pills or reset),
  // not while the user is actively typing
  useEffect(() => {
    if (initialValue !== lastSearchedRef.current) {
      setSearchTerm(initialValue);
      lastSearchedRef.current = initialValue;
    }
  }, [initialValue]);

  // Trigger search on debounce change safely
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (debouncedSearch !== lastSearchedRef.current) {
      lastSearchedRef.current = debouncedSearch;
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch]);

  const handleClear = useCallback(() => {
    setSearchTerm("");
    lastSearchedRef.current = "";
    onSearch("");
    inputRef.current?.focus();
  }, [onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div className={`relative w-full group ${className || ""}`}>
      {/* Search / Loading Icon */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground transition-colors group-focus-within:text-primary">
        {isSearching ? (
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        ) : (
          <Search className="w-5 h-5 transition-transform group-focus-within:scale-110" />
        )}
      </div>

      <Input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="بحث في الدليل الطبي"
        className="w-full h-12 sm:h-14 pr-11 pl-11 rounded-2xl bg-card border-border/80 text-foreground placeholder:text-muted-foreground/70 shadow-sm hover:border-border focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/15 text-sm sm:text-base transition-all duration-200"
      />

      {/* Clear Button */}
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground hover:text-foreground transition-colors p-1"
          aria-label="مسح البحث"
          title="مسح البحث (Esc)"
        >
          <div className="p-1 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </div>
        </button>
      )}
    </div>
  );
}
