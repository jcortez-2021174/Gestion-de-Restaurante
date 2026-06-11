import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const ReservationsContext =
    createContext();

export const ReservationsProvider = ({
    children
}) => {

    /* ===================================
       RESERVATIONS
    =================================== */

    const [reservations, setReservations] =
        useState(() => {

            const savedReservations =
                localStorage.getItem(
                    "aurea-reservations"
                );

            return savedReservations

                ? JSON.parse(savedReservations)

                : [

                    {
                        id:"#RES1001",

                        client:
                            "Carlos Cortez",

                        phone:
                            "5555 1234",

                        date:
                            "24/05/2025",

                        hour:
                            "19:00",

                        people:
                            4,

                        table:
                            "Mesa #5",

                        status:
                            "Confirmada",

                        notes:
                            "Celebración de aniversario.",

                        createdAt:
                            "22/05/2025"
                    },

                    {
                        id:"#RES1002",

                        client:
                            "Ana López",

                        phone:
                            "5555 5678",

                        date:
                            "24/05/2025",

                        hour:
                            "20:00",

                        people:
                            2,

                        table:
                            "Mesa #8",

                        status:
                            "Pendiente",

                        notes:
                            "Mesa cerca de ventana.",

                        createdAt:
                            "22/05/2025"
                    }

                ];
        });

    /* ===================================
       TOAST
    =================================== */

    const [notification, setNotification] =
        useState(null);

    /* ===================================
       AUDIO
    =================================== */

    const [audioEnabled, setAudioEnabled] =
        useState(false);

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
       SAVE
    =================================== */

    useEffect(() => {

        localStorage.setItem(

            "aurea-reservations",

            JSON.stringify(
                reservations
            )

        );

    }, [reservations]);

    /* ===================================
       UPDATE STATUS
    =================================== */

    const updateReservationStatus = (
        id,
        newStatus
    ) => {

        setReservations((prev) =>

            prev.map((reservation) =>

                reservation.id === id

                    ? {

                        ...reservation,

                        status:newStatus

                    }

                    : reservation
            )
        );
    };

    /* ===================================
       DELETE
    =================================== */

    const deleteReservation = (
        id
    ) => {

        setReservations((prev) =>

            prev.filter(

                (reservation) =>

                    reservation.id !== id
            )
        );
    };

    /* ===================================
       AUTO RESERVATIONS
    =================================== */

    useEffect(() => {

        const interval =
            setInterval(() => {

                const fakeClients = [

                    "Juan Pérez",

                    "María López",

                    "Luis Morales",

                    "Andrea Ruiz",

                    "Fernanda Castillo"

                ];

                const randomClient =

                    fakeClients[
                        Math.floor(
                            Math.random() *
                            fakeClients.length
                        )
                    ];

                const people =
                    Math.floor(
                        Math.random() * 6
                    ) + 2;

                const table =
                    Math.floor(
                        Math.random() * 15
                    ) + 1;

                const newReservation = {

                    id:
                        "#RES" +
                        Math.floor(
                            1000 +
                            Math.random() * 9000
                        ),

                    client:
                        randomClient,

                    phone:
                        "5555 1234",

                    date:
                        new Date()
                        .toLocaleDateString(),

                    hour:
                        "20:00",

                    people,

                    table:
                        `Mesa #${table}`,

                    status:
                        "Pendiente",

                    notes:
                        "Reserva automática.",

                    createdAt:
                        new Date()
                        .toLocaleDateString()
                };

                setReservations((prev) => [

                    newReservation,

                    ...prev

                ]);

                /* TOAST */

                setNotification({

                    title:
                        "Nueva Reserva",

                    message:
                        `${randomClient} realizó una reservación`
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

            }, 30000);

        return () =>
            clearInterval(interval);

    }, [audioEnabled]);

    return (

        <ReservationsContext.Provider

            value={{

                reservations,

                setReservations,

                updateReservationStatus,

                deleteReservation

            }}

        >

            {
                notification && (

                    <div className="live-toast">

                        <div className="toast-icon">

                            <i className="ri-calendar-check-fill"></i>

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

        </ReservationsContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useReservations =
    () => useContext(
        ReservationsContext
    );
