import React from "react";
import "./Badge.scss";

const Badge = ({ status }) => {
  let badgeClass = "";

  switch (status) {
    case "upcoming":
      badgeClass = "upcoming";
      break;
    case "success":
      badgeClass = "success";
      break;
    case "failed":
      badgeClass = "failed";
      break;
    default:
      badgeClass = "unknown";
  }

  return <span className={`badge ${badgeClass}`}>{status}</span>;
};

export default Badge;
