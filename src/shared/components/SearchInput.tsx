import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from "@shared/ui/input";
import { Card, CardContent } from "@shared/ui/card";
import { Search, Loader2 } from "lucide-react";
import { useDebounce } from '@shared/hooks/useDebounce';

interface SearchResult {
  id: string | number;
  label: string;
  [key: string]: any;
}

interface SearchInputProps {
  placeholder?: string;
  minSearchLength?: number;
  onSearch: (searchTerm: string) => Promise<SearchResult[]>;
  onSelect: (result: SearchResult) => void;
  renderResult?: (result: SearchResult) => React.ReactNode;
  className?: string;
  inputClassName?: string;
  debounceMs?: number;
}

export function SearchInput({
  placeholder = "Search...",
  minSearchLength = 3,
  onSearch,
  onSelect,
  renderResult,
  className = "",
  inputClassName = "",
  debounceMs = 300
}: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const isSelectingRef = useRef(false);

  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  useEffect(() => {
    const handleLoadingStart = (event: CustomEvent<{ method: string; url?: string }>) => {
      if (event.detail.url?.toLowerCase().includes('search')) {
        setIsLoading(true);
      }
    };

    const handleLoadingEnd = () => {
      setIsLoading(false);
    };

    window.addEventListener('api-loading-start', handleLoadingStart as EventListener);
    window.addEventListener('api-loading-end', handleLoadingEnd as EventListener);

    return () => {
      window.removeEventListener('api-loading-start', handleLoadingStart as EventListener);
      window.removeEventListener('api-loading-end', handleLoadingEnd as EventListener);
    };
  }, []);

  useEffect(() => {
    console.log('Debounced search term changed:', debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const handleSearch = useCallback(async (term: string) => {
    if (term.length < minSearchLength) {
      console.log('Search term too short:', term);
      setResults([]);
      setIsOpen(false);
      return;
    }

    setError(null);
    try {
      console.log('Searching for term:', term);
      const searchResults = await onSearch(term);
      console.log('Search results:', searchResults);
      setResults(searchResults);
      setIsOpen(true);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
      setResults([]);
    }
  }, [minSearchLength, onSearch]);

  useEffect(() => {
    // Skip search if we're in the middle of selecting
    if (isSelectingRef.current) {
      console.log('🚫 Skipping search - currently selecting, isSelectingRef:', isSelectingRef.current);
      return;
    }

    // Only search if the search term is long enough
    if (debouncedSearchTerm.length >= minSearchLength) {
      console.log('🔍 Calling handleSearch with debounced term:', debouncedSearchTerm, 'isSelectingRef:', isSelectingRef.current);
      handleSearch(debouncedSearchTerm);
    } else {
      console.log('📝 Search term too short, clearing results:', debouncedSearchTerm);
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedSearchTerm, handleSearch, minSearchLength]);

  const handleSelect = (result: SearchResult) => {
    console.log('=== SELECTION STARTED ===');
    console.log('Setting isSelectingRef to true');
    // Set flag to prevent search from re-triggering
    isSelectingRef.current = true;
    
    console.log('Calling onSelect with:', result);
    onSelect(result);
    
    console.log('Setting isOpen to false, clearing results');
    setIsOpen(false);
    setResults([]);
    
    console.log('Setting searchTerm to:', result.label);
    setSearchTerm(result.label);
    
    // Reset the flag after a delay longer than the debounce to prevent re-search
    setTimeout(() => {
      console.log('Resetting isSelectingRef to false');
      isSelectingRef.current = false;
    }, debounceMs + 50); // Use debounceMs + buffer instead of fixed 100ms
    console.log('=== SELECTION COMPLETED ===');
  };

  // Add method to clear search from parent component if needed
  const clearSearch = useCallback(() => {
    isSelectingRef.current = true;
    setSearchTerm("");
    setResults([]);
    setIsOpen(false);
    setTimeout(() => {
      isSelectingRef.current = false;
    }, 100);
  }, []);

  const defaultRenderResult = (result: SearchResult) => (
    <div className="p-3 hover:bg-blue-50 cursor-pointer rounded border-l-4 border-transparent hover:border-blue-400 transition-all">
      <div className="font-medium text-gray-900">{result.label}</div>
      {result.description && (
        <div className="text-sm text-gray-600">{result.description}</div>
      )}
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            // Reset selecting flag when user types
            isSelectingRef.current = false;
            setSearchTerm(e.target.value);
          }}
          placeholder={placeholder}
          className={`pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-200 bg-white ${inputClassName}`}
        />
        {isLoading && (
          <div className="absolute right-3 top-3">
            <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
          </div>
        )}
      </div>

      {isOpen && (isLoading || results.length > 0 || error) && (
        <Card className="absolute w-full z-10 mt-1 border-blue-200 shadow-lg">
          <CardContent className="p-2">
            {isLoading ? (
              <div className="p-4 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                <span className="ml-2 text-sm text-gray-600">Searching...</span>
              </div>
            ) : error ? (
              <div className="p-3 text-sm text-red-600">{error}</div>
            ) : (
              results.map((result) => (
                <div
                  key={result.id}
                  onClick={() => handleSelect(result)}
                >
                  {renderResult ? renderResult(result) : defaultRenderResult(result)}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}