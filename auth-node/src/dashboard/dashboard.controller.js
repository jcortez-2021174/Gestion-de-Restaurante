import { getDashboardStats } from "./dashboard.service.js";

export const getStats = async (req, res) => {

    try {

        const stats = await getDashboardStats();

        res.status(200).json({
            ok: true,
            stats
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            message: "Error al obtener estadísticas"
        });
    }
};