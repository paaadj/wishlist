import classNames from "classnames";
import styles from "./admin.module.css"


interface IAdminSideMenu{
    active: boolean;
    children?: React.ReactNode
};

function AdminSideMenu(props: IAdminSideMenu) {
    const {children, active} = props;

    return ( <aside className={classNames(styles.side_menu, styles.side_menu_position, { [styles.active]: active })}>
    {children}</aside> );
}

export default AdminSideMenu;