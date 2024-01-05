import classNames from "classnames";
import styles from "./admin.module.css"
interface ISideMenuItem{
    imagePath: string;
    text: string;
    onClick: () => void;
}
function SideMenuItem(props: ISideMenuItem) {
    const {imagePath, text, onClick} = props;
    return ( <div className={styles.side_menu__item}>
        <img src={imagePath} alt="icon" className={styles.side_menu__icon}/>
        <p className={classNames("page-text", "page-reg-text", styles.side_menu__text)}>{text}</p>
    </div> );
}

export default SideMenuItem;