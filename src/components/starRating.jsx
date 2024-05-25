import { useState } from "react";
import PropTypes from "prop-types";

const starRatingContainer = {
  display: "flex",
  gap: "15px",
  alignItems: "center",
};

const starRatingStyle = {
  display: "flex",
  gap: "1px",
};

StarRating.propTypes = {
  maxRating: PropTypes.number,
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
  message: PropTypes.array,
  defaultRate: PropTypes.number,
  setRate: PropTypes.func,
};

function StarRating({
  maxRating = 5,
  size = 20,
  color = "#fa5252",
  className = "",
  message = [],
  defaultRate,
  setRate,
}) {
  const [rating, setRating] = useState(defaultRate);
  const [tempRating, setTempRating] = useState(0);

  const starStyle = {
    width: `${size}px`,
    height: `${size}px`,
    cursor: "pointer",
    color,
    fontSize: `${size / 1.5}px`,
  };
  return (
    <div style={starRatingContainer} className={className}>
      <div style={starRatingStyle}>
        {Array.from({ length: maxRating }, function (_, i) {
          return (
            <Rate
              key={i}
              onClick={() => {
                setRating(i + 1);
                setRate(i + 1);
              }}
              full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
              HoverOut={() => setTempRating(0)}
              HoverIn={() => setTempRating(i + 1)}
              starStyle={starStyle}
            />
          );
        })}
      </div>
      <p>
        {message && message.length === maxRating
          ? message[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ""}
      </p>
    </div>
  );
}

function Rate({ starStyle, onClick, full, HoverOut, HoverIn }) {
  return (
    <span
      style={starStyle}
      onClick={onClick}
      onMouseLeave={HoverOut}
      onMouseEnter={HoverIn}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={starStyle.color}
          stroke={starStyle.color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={starStyle.color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}

export default StarRating;
