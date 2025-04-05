import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import LaunchItem from "../components/LaunchItem";
import Spinner from "../components/Spinner";
import SearchBar from "../components/SearchBar";
import "./LaunchList.scss";

const LIMIT = 10;

const LaunchList = () => {
  const [launches, setLaunches] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredLaunches, setFilteredLaunches] = useState([]);

  const observer = useRef();
  const isSearching = search.trim() !== "";

  // Infinite scroll observer
  const lastLaunchRef = useCallback(
    (node) => {
      if (loading || isSearching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, isSearching]
  );

  // Fetch data based on page number
  useEffect(() => {
    const fetchLaunches = async () => {
      setLoading(true);
      try {
        const offset = page * LIMIT;
        const res = await axios.get(
          `https://api.spacexdata.com/v3/launches?limit=${LIMIT}&offset=${offset}`
        );
        const data = res.data;

        setLaunches((prev) => {
          const existingIds = new Set(prev.map((item) => item.flight_number));
          const newUnique = data.filter(
            (item) => !existingIds.has(item.flight_number)
          );
          return [...prev, ...newUnique];
        });
        if (data.length < LIMIT) setHasMore(false);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!isSearching) {
      fetchLaunches();
    }
  }, [page, isSearching]);

  useEffect(() => {
    if (isSearching) {
      const filtered = launches.filter((launch) =>
        launch.mission_name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredLaunches(filtered);
    } else {
      setFilteredLaunches([]);
    }
  }, [search, launches, isSearching]);

  const displayedLaunches = isSearching ? filteredLaunches : launches;

  return (
    <div className="launch-list-container">
      <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />

      {displayedLaunches.length > 0 ? (
        displayedLaunches.map((launch, index) => {
          const isLast = index === displayedLaunches.length - 1;

          return (
            <LaunchItem
              key={launch.flight_number}
              ref={!isSearching && isLast ? lastLaunchRef : null}
              launch={launch}
            />
          );
        })
      ) : isSearching ? (
        <p>No results found</p>
      ) : null}

      {loading && !isSearching && <Spinner />}
      {!hasMore && !isSearching && <p className="end-message">End of list.</p>}
    </div>
  );
};

export default LaunchList;
