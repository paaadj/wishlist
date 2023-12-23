import classNames from "classnames";
import styles from "./iconButton.module.css"

interface IIconButton{
    size: 16 | 24 | 32 | 40 | 48;
    iconSrc: string;
    onClick?: () => void;
    className?: string;
};

function IconButton(props: IIconButton) {
    const {size = 32, iconSrc, onClick, className = ""} = props;
  return (
    <button type="button" onClick={onClick} className={classNames(styles.button, styles[`button-${size}`], className)}>
      <img src={iconSrc} alt="icon" className={styles.icon} />
    </button>
  );
}

export default IconButton;
