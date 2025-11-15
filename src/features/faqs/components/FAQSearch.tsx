
import React, { useState } from 'react';
import { Input } from '@shared/ui/input';
import { Button } from '@shared/ui/button';
import { Card, CardContent } from '@shared/ui/card';
import { Search } from 'lucide-react';
import { logEvent } from '@shared/analytics/analytics';

interface FAQSearchProps {
  onSearch: (query: string) => void;
}

const FAQSearch = ({ onSearch }: FAQSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchQuery);
    console.log('Searching for:', searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value); 
     if (value.trim()) {
    logEvent("FAQ Search Performed");
  }
  };
  
  return (
    <Card className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 mb-6">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-2">How can we help you?</h2>
          <p className="text-muted-foreground">
            Search our knowledge base for answers to your questions
          </p>
        </div>
        
        <form onSubmit={handleSearch}>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="faq-search"
              name="search"
              placeholder="Search for answers..."
              className="pl-10 h-12 bg-white text-lg"
              value={searchQuery}
              onChange={handleInputChange}
              aria-label="Search FAQ"
              autoComplete="off"
            />
            <Button 
              type="submit" 
              className="absolute right-1 top-1/2 -translate-y-1/2 h-10"
              aria-label="Search"
            >
              Search
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FAQSearch;
