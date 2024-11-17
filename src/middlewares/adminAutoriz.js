function adminAut(req, res, next) {
    if (req.session.cliente != undefined) {
        next()
    }else{
        res.redirect("/logincliente")
    }
}
module.exports = adminAut;
