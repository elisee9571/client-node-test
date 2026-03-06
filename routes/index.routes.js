const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {   
     
    res.render("index", {
        title: "Page home",
    });
});

module.exports = router;
