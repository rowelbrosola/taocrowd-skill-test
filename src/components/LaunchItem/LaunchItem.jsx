import React, { forwardRef, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Badge from "../Badge/Badge";
import "./LaunchItem.scss";
dayjs.extend(relativeTime);

const LaunchItem = forwardRef(({ launch }, ref) => {
  const [showDetails, setShowDetails] = useState(false);
  const {
    mission_name,
    upcoming,
    launch_success,
    launch_date_unix,
    launch_date_utc,
    links,
    launch_failure_details,
    details,
  } = launch;

  const relativeDate = dayjs.unix(launch_date_unix).fromNow();
  const exactDate = dayjs(launch_date_utc).format("MMMM D, YYYY");

  const status = upcoming ? "upcoming" : launch_success ? "success" : "failed";

  return (
    <div className="launch-item" ref={ref}>
      <h3>
        {mission_name} <Badge status={status} />
      </h3>

      {showDetails && (
        <div className="launch-details">
          <div className="launch-info">
            <p>{status === "upcoming" ? exactDate : relativeDate}</p>

            {(status === "success" || status === "failed") && (
              <>
                {links.article_link && (
                  <>
                    <span className="separator">|</span>
                    <a
                      href={links.article_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Article
                    </a>
                  </>
                )}

                {links.video_link && (
                  <>
                    <span className="separator">|</span>
                    <a
                      href={links.video_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Video
                    </a>
                  </>
                )}
              </>
            )}
          </div>

          <div className="launch-media">
            {links.mission_patch ? (
              <img
                src={links.mission_patch}
                alt="Mission patch"
                className="launch-image"
                loading="lazy"
              />
            ) : (
              <p>No image yet.</p>
            )}

            <div className="launch-description">
              {status === "failed" ? (
                <p>{launch_failure_details.reason || "No description"}</p>
              ) : (
                <p>{details || "No description"}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <button
        className="view-button"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "HIDE" : "VIEW"}
      </button>
    </div>
  );
});

export default LaunchItem;
