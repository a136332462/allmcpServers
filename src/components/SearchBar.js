'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Loader2, Search, X, Clock } from 'lucide-react';

const LOCAL_HISTORY_KEY = 'search_history';
const MAX_HISTORY = 5;

export function SearchBar({ initialQuery = '', className = '' }) {
    const [query, setQuery] = useState(initialQuery);
    const [isSearching, setIsSearching] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState([]);
    const inputRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const his = JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY) || '[]');
        setHistory(his);
    }, []);

    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery]);

    useEffect(() => {
        function handleClick(e) {
            if (!inputRef.current?.contains(e.target)) setShowHistory(false);
        }
        if (showHistory) window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [showHistory]);

    function saveHistory(newQuery) {
        let his = JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY) || '[]');
        his = [newQuery, ...his.filter(q => q !== newQuery)].slice(0, MAX_HISTORY);
        localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(his));
        setHistory(his);
    }

    const handleSearch = (e, value = null) => {
        e?.preventDefault();
        const searchVal = value !== null ? value : query;
        if (searchVal.trim()) {
            setIsSearching(true);
            saveHistory(searchVal.trim());
            setShowHistory(false);
            router.push(`/result?q=${encodeURIComponent(searchVal.trim())}`);
            setTimeout(() => setIsSearching(false), 500);
        }
    };

    const handleHistoryClick = (record) => {
        setQuery(record);
        handleSearch(null, record);
    };

    const clearSearch = () => {
        setQuery('');
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setShowHistory(false);
        }
    };

    return (
        <div className={`relative w-full max-w-2xl mx-auto ${className}`} ref={inputRef}>
            <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <Search className="w-5 h-5" />
                    </div>

                    <input
                        type="text"
                        value={query}
                        ref={inputRef}
                        autoComplete="off"
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setShowHistory(true);
                            setIsSearching(false);
                        }}
                        onFocus={() => setShowHistory(true)}
                        onKeyDown={handleKeyDown}
                        className="block w-full p-4 pl-10 text-sm rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                        placeholder="Search MCP servers by name, description or category..."
                        aria-label="Search MCP servers"
                        required
                    />

                    {query && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-16 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={isSearching || !query.trim()}
                        className="absolute inset-y-0 right-0 flex items-center justify-center bg-primary text-primary-foreground rounded-r-lg px-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all btn-hover"
                        aria-label="Submit search"
                    >
                        {isSearching ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            'Search'
                        )}
                    </button>
                </div>

                {showHistory && history.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-background border border-border rounded-lg shadow-lg z-30 overflow-hidden animate-fadeIn">
                        <div className="py-1">
                            <div className="px-3 py-2 text-xs text-muted-foreground flex items-center">
                                <Clock className="w-3 h-3 mr-2" />
                                Recent searches
                            </div>

                            {history.map((record, idx) => (
                                <button
                                    key={`${record}-${idx}`}
                                    type="button"
                                    onClick={() => handleHistoryClick(record)}
                                    className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors flex items-center"
                                >
                                    <Search className="w-4 h-4 mr-2 text-muted-foreground" />
                                    <span className="truncate">{record}</span>
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={() => {
                                    localStorage.removeItem(LOCAL_HISTORY_KEY);
                                    setHistory([]);
                                    setShowHistory(false);
                                }}
                                className="w-full text-left px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-end"
                            >
                                Clear history
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}