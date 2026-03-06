const axios = require("axios");
require("dotenv").config();

const api = axios.create({ baseURL: process.env.BASE_URL_API });

exports.createComment = async (req, res) => {
    const { postId } = req.params;
    const { message } = req.body;

    try {
        await api.post(
            `/comments/posts/${postId}`,
            { message },
            {
                headers: {
                    Authorization: `Bearer ${req.session.accessToken}`,
                },
            },
        );

        return res.redirect(`/posts/${postId}`);
    } catch (err) {
        const data = err.response?.data;

        const fieldErrors = {};
        const validations = data?.error?.validations || [];

        for (const v of validations) {
            if (v.field) {
                fieldErrors[v.field] = v.message;
            }
        }

        try {
            const response = await api.get(`/posts/${postId}`);

            return res.status(err.response?.status || 400).render("posts/show", {
                title: response.data.post.title,
                post: response.data.post,
                comments: response.data.comments,
                fieldErrors,
                values: { message },
            });
        } catch (fetchErr) {
            console.error(fetchErr.response?.data || fetchErr);
            
            return res.redirect(`/posts/${postId}`);
        }
    }
};
