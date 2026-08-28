"use client";

import React, { useEffect, useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks/use-debounce";

interface SearchBarProps {
  initialValue?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  isSearching?: boolean;
}

export function SearchBar({
  initialValue = "",
  onSearch,
  placeholder = "ابحث بالاسم، التخصص، العنوان، رقم الهاتف...",
  isSearching = false,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Sync internal state if initialValue changes from URL
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  // Trigger search on debounce change
  useEffect(() => {
    if (debouncedSearch !== initialValue) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch, initialValue]);

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-muted-foreground">
        {isSearching ? (
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        ) : (
          <Search className="w-5 h-5" />
        )}
      </div>

      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 pr-11 pl-11 rounded-2xl bg-card border-border/80 shadow-sm focus-visible:ring-primary text-sm sm:text-base transition-all duration-200"
      />

      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground hover:text-foreground transition-colors p-1"
          aria-label="مسح البحث"
        >
          <div className="p-1 rounded-full hover:bg-muted">
            <X className="w-4 h-4" />
          </div>
        </button>
      )}
    </div>
  );
}
