import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";

export const AdminLayout = ({
    children,
    notificationCount = 0
}) => {
    return (
        <div className="container">
            <Sidebar />

            <main className="main">
                <Navbar
                    notificationCount={notificationCount}
                />

                {children}
            </main>
        </div>
    );
};