import classNames from "classnames";
import styles from "./admin.module.css"
import { Icon } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import { IconType } from "react-icons";
interface ISideMenuItem{
    icon: IconType;
    text: string;
    onClick: () => void;
}
function SideMenuItem(props: ISideMenuItem) {
    const {icon, text, onClick} = props;
    return ( <div className={styles.side_menu__item} onClick={onClick}>
        <Icon as={icon} boxSize={5} color="white"/>
        <p className={classNames("page-text", "page-reg-text", styles.side_menu__text)}>{text}</p>
    </div> );
}

export default SideMenuItem;