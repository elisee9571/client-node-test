const axios = require("axios");
require("dotenv").config();

const api = axios.create({ baseURL: process.env.BASE_URL_API });

exports.showRegister = (req, res) => {
    return res.render("auth/register", {
        title: "Sign up",
        fieldErrors: {},
        values: {},
    });
};

exports.showLogin = (req, res) => {
    return res.render("auth/login", {
        title: "Sign in",
        error: null,
        values: { },
    });
};

exports.signUp = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        await api.post("/auth/register", { name, email, password });

        return res.redirect("/login");
    } catch (err) {
        const data = err.response?.data;

        const fieldErrors = {};
        const validations = data.error?.validations || [];

        for (const v of validations) {
            if (v.field) {
                fieldErrors[v.field] = v.message;
            }
        }

        if (data?.error?.code === "EMAIL_ALREADY_EXISTS") {
            fieldErrors.email = data.error?.message;
        }

        return res.render("auth/register", {
            title: "Registration",
            fieldErrors,
            values: { name, email },
        });
    }
};

exports.signIn = async (req, res) => {
    try {
        const response = await api.post("/auth/login", req.body);

        req.session.accessToken = response.data.accessToken;
        req.session.userId = response.data.user._id.toString();

        const redirectTo = req.session.returnTo || "/";
        delete req.session.returnTo;

        return res.redirect(redirectTo);

    } catch (err) {
        const data = err.response?.data;

        return res.render("auth/login", {
            title: "Sign in",
            error: data.error?.message,
            values: { email: req.body.email },
        });
    }
};

exports.logout = async (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};
