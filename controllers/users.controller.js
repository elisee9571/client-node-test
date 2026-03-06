const axios = require("axios");
require("dotenv").config();

const api = axios.create({ baseURL: process.env.BASE_URL_API });

exports.showProfile = async (req, res) => {
    try {
        const response = await api.get("/users/profile", {
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
            },
        });

        return res.render("users/profile", {
            title: "Profile",
            user: response.data,
        });
    } catch (err) {
        const data = err.response?.data;

        console.error(data);
    }
};
