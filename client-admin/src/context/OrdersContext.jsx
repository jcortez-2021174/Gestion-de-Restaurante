import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const OrdersContext =
    createContext();

export const OrdersProvider = ({
    children
}) => {

    /* ===================================
       ORDERS
    =================================== */

    const [orders, setOrders] =
        useState(() => {

            const savedOrders =
                localStorage.getItem(
                    "aurea-orders"
                );

            return savedOrders

                ? JSON.parse(savedOrders)

                : [

                    {
                        id:"#AUREA1023",

                        client:
                            "Carlos Cortez",

                        phone:
                            "5555 1234",

                        type:
                            "Domicilio",

                        address:
                            "Zona 10",

                        status:
                            "Nuevo",

                        hour:
                            "19:15",

                        total:
                            "Q320.00",

                        createdAt:
                            "24/05/2025",

                        products:[

                            {
                                nombre:
                                    "Costillas de Cordero",

                                cantidad:1,

                                precio:165,

                                imagen:
                                    "/plato1.jpeg"
                            },

                            {
                                nombre:
                                    "Cheesecake",

                                cantidad:1,

                                precio:65,

                                imagen:
                                    "/plato2.jpeg"
                            }

                        ]
                    },

                    {
                        id:"#AUREA1024",

                        client:
                            "Ana López",

                        phone:
                            "5555 5678",

                        type:
                            "Domicilio",

                        address:
                            "Vista Hermosa III",

                        status:
                            "Nuevo",

                        hour:
                            "19:25",

                        total:
                            "Q285.00",

                        createdAt:
                            "24/05/2025",

                        products:[

                            {
                                nombre:
                                    "Pasta Alfredo",

                                cantidad:2,

                                precio:140,

                                imagen:
                                    "/plato3.jpeg"
                            }

                        ]
                    }

                ];
        });

    /* ===================================
       TOAST
    =================================== */

    const [notification, setNotification] =
        useState(null);

    /* ===================================
       AUDIO ENABLE
    =================================== */

    const [audioEnabled, setAudioEnabled] =
        useState(false);

    /* ===================================
       ENABLE AUDIO AFTER CLICK
    =================================== */

    useEffect(() => {

        const enableAudio = () => {

            setAudioEnabled(true);

            window.removeEventListener(
                "click",
                enableAudio
            );
        };

        window.addEventListener(
            "click",
            enableAudio
        );

        return () => {

            window.removeEventListener(
                "click",
                enableAudio
            );
        };

    }, []);

    /* ===================================
       SAVE LOCALSTORAGE
    =================================== */

    useEffect(() => {

        localStorage.setItem(
            "aurea-orders",
            JSON.stringify(orders)
        );

    }, [orders]);

    /* ===================================
       UPDATE STATUS
    =================================== */

    const updateOrderStatus = (
        id,
        newStatus
    ) => {

        setOrders((prev) =>

            prev.map((order) =>

                order.id === id

                    ? {
                        ...order,
                        status:newStatus
                    }

                    : order
            )
        );
    };

    /* ===================================
       DELETE ORDER
    =================================== */

    const deleteOrder = (
        id
    ) => {

        setOrders((prev) =>

            prev.filter(
                (order) =>
                    order.id !== id
            )
        );
    };

    /* ===================================
       REJECT ORDER
    =================================== */

    const rejectOrder = (
        id
    ) => {

        setOrders((prev) =>

            prev.filter(
                (order) =>
                    order.id !== id
            )
        );
    };

    /* ===================================
       AUTO ORDERS
    =================================== */

    useEffect(() => {

        const interval =
            setInterval(() => {

                const fakeClients = [

                    "Juan Pérez",

                    "María López",

                    "Carlos Méndez",

                    "Andrea Ruiz",

                    "Luis Morales",

                    "Fernanda Castillo"

                ];

                const fakeFoods = [

                    {
                        nombre:
                            "Pizza Gourmet",

                        precio:120,

                        imagen:
                            "/plato1.jpeg"
                    },

                    {
                        nombre:
                            "Pasta Alfredo",

                        precio:140,

                        imagen:
                            "/plato2.jpeg"
                    },

                    {
                        nombre:
                            "Costillas BBQ",

                        precio:180,

                        imagen:
                            "/plato3.jpeg"
                    }

                ];

                const randomClient =

                    fakeClients[
                        Math.floor(
                            Math.random() *
                            fakeClients.length
                        )
                    ];

                const randomFood =

                    fakeFoods[
                        Math.floor(
                            Math.random() *
                            fakeFoods.length
                        )
                    ];

                const newOrder = {

                    id:
                        "#AUREA" +
                        Math.floor(
                            1000 +
                            Math.random() * 9000
                        ),

                    client:
                        randomClient,

                    phone:
                        "5555 1234",

                    type:
                        "Domicilio",

                    address:
                        "Zona 10",

                    status:
                        "Nuevo",

                    hour:
                        new Date()
                        .toLocaleTimeString(
                            [],
                            {
                                hour:"2-digit",
                                minute:"2-digit"
                            }
                        ),

                    total:
                        `Q${randomFood.precio}.00`,

                    createdAt:
                        new Date()
                        .toLocaleDateString(),

                    products:[

                        {
                            nombre:
                                randomFood.nombre,

                            cantidad:1,

                            precio:
                                randomFood.precio,

                            imagen:
                                randomFood.imagen
                        }

                    ]
                };

                /* ADD ORDER */

                setOrders((prev) => [

                    newOrder,

                    ...prev

                ]);

                /* TOAST */

                setNotification({

                    title:
                        "Nuevo Pedido",

                    message:
                        `${randomClient} realizó un pedido`
                });

                /* AUDIO */

                if(audioEnabled){

                    const audio =
                        new Audio(
                            "/notificacion.mp3"
                        );

                    audio.volume = 1;

                    audio.play().catch(() => {

                        console.log(
                            "Audio bloqueado"
                        );

                    });

                }

                /* HIDE TOAST */

                setTimeout(() => {

                    setNotification(null);

                }, 5000);

            }, 25000);

        return () =>
            clearInterval(interval);

    }, [audioEnabled]);

    return (

        <OrdersContext.Provider

            value={{

                orders,

                setOrders,

                updateOrderStatus,

                deleteOrder,

                rejectOrder

            }}

        >

            {
                notification && (

                    <div className="live-toast">

                        <div className="toast-icon">

                            <i className="ri-notification-3-fill"></i>

                        </div>

                        <div>

                            <h4>
                                {
                                    notification.title
                                }
                            </h4>

                            <p>
                                {
                                    notification.message
                                }
                            </p>

                        </div>

                    </div>

                )
            }

            {children}

        </OrdersContext.Provider>
    );
};

export const useOrders =
    () => useContext(
        OrdersContext
    );