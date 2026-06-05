const DashboardHeader = () => {
    return (
        <header className="header">

            <div>
                <h1>Bienvenido a Aurea</h1>
                <p>Gestión del menú en tiempo real.</p>
            </div>

            <div className="user-box">

                <div className="notification">
                    
                    <span className="badge">3</span>
                </div>
                <div className="divider"></div>

                <div className="user">
                    <div className="user-info">
                        <span>Administrador</span>
                        <small>admin@aurea.com</small>
                    </div>
                </div>

            </div>

        </header>
    );
};

export default DashboardHeader;