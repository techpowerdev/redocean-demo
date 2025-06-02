"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type Props = {
  onSearch: (keyword: string) => void;
  placeHolder?: string;
  buttonText?: string;
};

export default function SearchForm({
  onSearch,
  placeHolder = "",
  buttonText = "ค้นหา",
}: Props) {
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    onSearch(keyword.trim());
  };

  return (
    <div className="w-full flex items-center gap-2">
      <Input
        placeholder={placeHolder}
        className="w-full"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />
      <Button variant="outline" onClick={handleSearch}>
        <Search className="mr-2 h-4 w-4" />
        {buttonText}
      </Button>
    </div>
  );
}
