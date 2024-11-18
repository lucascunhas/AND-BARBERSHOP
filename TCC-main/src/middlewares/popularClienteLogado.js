function popularClienteLogado(req, res, next) {
    if (req.session.cliente != undefined) {
      req.user = { id_cliente: req.session.cliente.id_cliente }; // Garantindo que req.user seja populado
    }
    next();
  }
  
module.exports = popularClienteLogado;