import React from "react";

import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import { MenuProvider }
from "../context/MenuContext";

import { OrdersProvider }
from "../context/OrdersContext";

import { ReservationsProvider }
from "../context/ReservationsContext";

ReactDOM.createRoot(
    document.getElementById("root")
).render(

    <React.StrictMode>

        <MenuProvider>

            <OrdersProvider>

                <ReservationsProvider>

                    <App />

                </ReservationsProvider>

            </OrdersProvider>

        </MenuProvider>

    </React.StrictMode>

);