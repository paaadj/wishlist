import { Dispatch, SetStateAction } from "react";
import "./modalWindow.css";
import React from "react";

interface IModalWindow {
  active: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
  onLeaving?: () => void;
  children: React.ReactNode;
}

function ModalWindow(props: IModalWindow) {
  const { active, setActive, children, onLeaving } = props;
  return (
    <div
      className={active ? "modal-window active" : "modal-window"}
      onClick={() => {
        if (onLeaving) {
          onLeaving();
        }
        setActive(false);
      }}
    >
      <div
        className={
          active ? "modal-window__content active" : "modal-window__content"
        }
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default React.memo(ModalWindow);
