const axios = require("axios");
const sanitizeHtml = require("sanitize-html");
require("dotenv").config();

const api = axios.create({ baseURL: process.env.BASE_URL_API });

exports.posts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    try {
        const response = await api.get("/posts", {
            params: {
                page: page,
                size: size,
            },
        });

        return res.render("posts/index", {
            title: "Posts",
            posts: response.data.data,
            meta: response.data.meta,
        });
    } catch (err) {
        const data = err.response?.data;

        console.error(data);
    }
};

exports.post = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await api.get(`/posts/${id}`);

        return res.render("posts/show", {
            title: response.data.post.title,
            post: response.data.post,
            comments: response.data.comments,
            fieldErrors: {},
            values: {},
        });
    } catch (err) {
        const data = err.response?.data;

        console.error(data);
    }
};

exports.newPostForm = (req, res) => {
    return res.render("posts/new", {
        title: "New post",
        fieldErrors: {},
        values: {},
    });
};

exports.editPostForm = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await api.get(`/posts/${id}`);

        return res.render("posts/edit", {
            title: "Edit post",
            fieldErrors: {},
            values: response.data.post,
        });
    } catch (err) {
        const data = err.response?.data;

        console.error(data);
    }
};

exports.newPost = async (req, res) => {
    const { title, content, status } = req.body;

    try {
        const clean = sanitizeHtml(req.body.content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                "img", "h1", "h2", "h3", "pre", "code",
            ]),
            allowedAttributes: {
                a: ["href", "name", "target"],
                img: ["src", "alt"],
            },
        });

        const response = await api.post("/posts/new", {
            title,
            content: clean,
            status,
        }, {
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
            },
        });

        return res.redirect(`/posts/${response.data.post._id}`);
    } catch (err) {

        const data = err.response?.data;

        const fieldErrors = {};
        const validations = data.error?.validations || [];

        for (const v of validations) {
            if (v.field) {
                fieldErrors[v.field] = v.message;
            }
        }

        return res.render("posts/new", {
            title: "New post",
            fieldErrors,
            values: { title, content, status },
        });
    }
};

exports.editPost = async (req, res) => {
    const { id } = req.params;
    const { title, content, status } = req.body;

    try {
        const clean = sanitizeHtml(req.body.content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                "img", "h1", "h2", "h3", "pre", "code",
            ]),
            allowedAttributes: {
                a: ["href", "name", "target"],
                img: ["src", "alt"],
            },
        });

        const response = await api.patch(`/posts/${id}`, {
            title,
            content: clean,
            status,
        }, {
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
            },
        });

        return res.redirect(`/posts/${response.data.post._id}`);
    } catch (err) {

        const data = err.response?.data;

        const fieldErrors = {};
        const validations = data.error?.validations || [];

        for (const v of validations) {
            if (v.field) {
                fieldErrors[v.field] = v.message;
            }
        }

        return res.render("posts/new", {
            title: "New post",
            fieldErrors,
            values: { title, content, status },
        });
    }
};
