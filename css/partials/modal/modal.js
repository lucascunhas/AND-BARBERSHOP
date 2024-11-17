const btn_modal = document.getElementById("abre-modal")
const modal = document.querySelector("dialog")

const btn_fechar = document.getElementById("btn-fecha-modal")

btn_modal.onclick = function (){
    modal.showModal()
}

btn_fechar.onclick = function () {
    modal.close()
}