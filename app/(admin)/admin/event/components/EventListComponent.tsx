"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import Loading from "@/components/shared/Loading";
import { EventList } from "./EventList";
import { usePromotionStore } from "@/state-stores/admin/adminPromotionStore";
import {
  FetchAllPromotionResponseType,
  PromotionType,
} from "@/types/promotionTypes";
import { getAllPromotions } from "@/services/promotionServices";

export default function EventListComponent() {
  const promotionLists = usePromotionStore((state) => state.promotionLists);
  const setPromotionLists = usePromotionStore(
    (state) => state.setPromotionLists
  );
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [filteredPromotions, setFilteredPromotions] = useState<PromotionType[]>(
    []
  ); // State for filtered products
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for error message

  useEffect(() => {
    const fetchAllPromotions = async () => {
      setLoading(true); // Set loading to true when fetching
      try {
        const promotions: FetchAllPromotionResponseType =
          await getAllPromotions();
        setPromotionLists(promotions.data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching promotions:", error);
        setError("ไม่สามารถโหลดโปรโมชั่นได้"); // Set error message
        setLoading(false); // Set loading to false in case of error
      }
    };
    fetchAllPromotions();
  }, [setPromotionLists]);

  useEffect(() => {
    // Filter products based on the search term
    if (searchTerm && promotionLists) {
      const results = promotionLists.filter((promotion) =>
        promotion.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPromotions(results);
    } else {
      setFilteredPromotions(promotionLists || []); // Set to empty array if undefined
    }
  }, [searchTerm, promotionLists]);

  let component;
  if (loading) {
    component = (
      <div>
        <Loading />
      </div>
    ); // Loading state
  }

  if (error) {
    component = <div className="text-center text-red-500">{error}</div>; // Display error message
  }

  if (searchTerm && filteredPromotions.length === 0) {
    component = <div className="text-center">ไม่พบกิจกรรม</div>; // No promotions found
  }

  return (
    <>
      <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            />
          </div>
        </form>
      </div>
      {component ? (
        component
      ) : (
        <div className="m-0">
          <EventList events={filteredPromotions} />
        </div>
      )}
    </>
  );
}
