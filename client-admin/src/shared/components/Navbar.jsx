export const Navbar = ({
    notificationCount = 0,
    userName = "Administrador",
    userEmail = "admin@aurea.com"
}) => {
    return (
        <div className="header">

            <div>
                <h2>Bienvenido a Aurea</h2>

                <p>
                    Tradición e innovación en cada plato.
                </p>
            </div>

            <div className="user-box">

                <div className="notification">

                    <i className="ri-notification-3-line"></i>

                    <span className="badge">
                        {notificationCount}
                    </span>

                </div>

                <div className="divider"></div>

                <div className="user">

                    <i className="ri-user-line"></i>

                    <div className="user-info">

                        <span>{userName}</span>

                        <small>{userEmail}</small>

                    </div>

                    <i className="ri-arrow-down-s-line"></i>

                </div>

            </div>

        </div>
    );
};