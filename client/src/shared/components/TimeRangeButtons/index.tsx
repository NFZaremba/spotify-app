import StyledRangeButtons from "./styles";

interface ITimeRangeButtons {
  activeRange: "short" | "medium" | "long";
  setActiveRange: (arg: "short" | "medium" | "long") => void;
}

const TimeRangeButtons = ({
  activeRange,
  setActiveRange,
}: ITimeRangeButtons) => {
  return (
    <StyledRangeButtons>
      <li>
        <button
          className={activeRange === "short" ? "active" : ""}
          onClick={() => setActiveRange("short")}
        >
          This Month
        </button>
      </li>
      <li>
        <button
          className={activeRange === "medium" ? "active" : ""}
          onClick={() => setActiveRange("medium")}
        >
          Last 6 Months
        </button>
      </li>
      <li>
        <button
          className={activeRange === "long" ? "active" : ""}
          onClick={() => setActiveRange("long")}
        >
          All Time
        </button>
      </li>
    </StyledRangeButtons>
  );
};

export default TimeRangeButtons;
