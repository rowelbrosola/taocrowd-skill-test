import React from "react";
import "./SearchBar.scss";

const SearchBar = ({ value, onChange }) => {
  return (
    <input
      type="text"
      className="search-bar"
      placeholder="Search..."
      value={value}
      onChange={onChange}
    />
  );
};

export default SearchBar;
