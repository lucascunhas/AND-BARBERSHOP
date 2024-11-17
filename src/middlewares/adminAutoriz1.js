function adminAut(req, res, next) {
    if (req.session.barbeiro != undefined) {
        next()
    }else{
        res.redirect("/logincliente")
    }
}

module.exports = adminAut;