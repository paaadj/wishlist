import classNames from "classnames";
import styles from "./admin.module.css"

interface IAdminMainView{
    children: React.ReactNode;
}

function AdminMainView(props: IAdminMainView) {
    const {children} = props;
    return ( <main className={classNames(styles.main, styles.main_position)}>
        {children}
    </main> );
}

export default AdminMainView;