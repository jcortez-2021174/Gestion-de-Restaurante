import axios from "axios";

const API_URL =
"http://localhost:3020/AureaRestaurant/Admin/v1/dashboard";

export const getDashboardStats = async () => {

    try {

        const response = await axios.get(
            `${API_URL}/stats`
        );

        return response.data;

    } catch (error) {

        console.log(error);

        throw error;
    }
};