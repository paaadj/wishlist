import React from "react";
import styles from "./Pagination.module.css";
import { Flex, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

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
    onNextPageClick();
  };
  const handlePrevPageClick = () => {
    onPrevPageClick();
  };
  return (
    <Flex align="center" justify="center">
      <IconButton
        aria-label="To the next page"
        icon={<ChevronLeftIcon w="70%" h="70%"/>}
        onClick={handlePrevPageClick}
        isDisabled={disable.left}
        mr={5}
        boxSize={8}
      />

      {nav && (
        <span className={styles.navigation}>
          {nav.current} / {nav.total}
        </span>
      )}
      <IconButton
        boxSize={8}
        aria-label="To the next page"
        icon={<ChevronRightIcon w="70%" h="70%" />}
        onClick={handleNextPageClick}
        isDisabled={disable.right}
        ml={5}
      />
    </Flex>
  );
}

export default React.memo(Pagination);
