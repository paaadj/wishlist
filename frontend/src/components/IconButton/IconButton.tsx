import classNames from "classnames";
import styles from "./iconButton.module.css"

interface IIconButton{
    size: number;
    iconSrc: string;
    onClick?: () => void;
};

function IconButton(props: IIconButton) {
    const {size, iconSrc, onClick} = props;
  return (
    <button type="button" onClick={onClick} className={classNames(styles.button, styles[`button-${size}`])}>
      <img src={iconSrc} alt="icon" className={styles.icon} />
    </button>
  );
}

export default IconButton;
