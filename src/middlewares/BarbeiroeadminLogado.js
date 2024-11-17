function checkBarberType(req, res, next) {
    if (req.session && req.session.barbeiro && req.session.barbeiro.tipo === 1) {
        next();
    } else {
        res.redirect('/painelbarb');
    }
}

module.exports = checkBarberType;
