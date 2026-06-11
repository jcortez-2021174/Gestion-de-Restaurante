import { getDashboardStats, getReportData } from "./dashboard.service.js";

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

export const getReports = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            data: await getReportData(req.query),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al generar reportes',
            error: error.message,
        });
    }
};
