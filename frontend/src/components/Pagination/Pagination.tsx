import React from "react";
import styles from "./Pagination.module.css"

interface IPagination {
  onNextPageClick: () => void;
  onPrevPageClick: () => void;
  disable: { left: boolean; right: boolean };
  nav?: {
    current: number;
    total: number;
  };
}

function Pagination(props: IPagination) {
  const { onNextPageClick, onPrevPageClick, disable, nav = null } = props;
  const handleNextPageClick = () => {
    console.log("Next");
    onNextPageClick();
  };
  const handlePrevPageClick = () => {
    console.log("Prev");
    onPrevPageClick();
  };
  return (
    <div className={styles.paginator}>
      <button
        className={styles.arrow}
        type="button"
        onClick={handlePrevPageClick}
        disabled={disable.left}
      >
        {"<"}
      </button>
      {nav && (
        <span className={styles.navigation}>
          {nav.current} / {nav.total}
        </span>
      )}
      <button
        className={styles.arrow}
        type="button"
        onClick={handleNextPageClick}
        disabled={disable.right}
      >
        {">"}
      </button>
    </div>
  );
}

export default React.memo(Pagination);
