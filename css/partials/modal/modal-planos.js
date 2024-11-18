document.addEventListener("DOMContentLoaded", () => {
    const modal = document.querySelector("#modal-planos");
    const tituloModal = document.querySelector("#titulo-modal");
    const numeroModal = document.querySelector("#numero-modal");
    const descricaoModal = document.querySelector("#descricao-modal");
    const precoModal = document.querySelector("#preco-modal");
    const btnFechar = document.querySelector("#btn-fecha-modal");

    document.querySelectorAll(".btn-infos").forEach((button) => {
        button.addEventListener("click", (e) => {
            // Pegando os dados do botão clicado
            const id = button.getAttribute("data-id");
            const nome = button.getAttribute("data-nome");
            const descricao = button.getAttribute("data-descricao");
            const preco = button.getAttribute("data-preco");

            // Inserindo os dados na modal
            numeroModal.textContent = `${id}`;
            tituloModal.textContent = `${nome}`;
            descricaoModal.textContent = `${descricao}`;
            precoModal.textContent = `${preco}`;

            modal.showModal();
        });
    });

    btnFechar.addEventListener("click", () => {
        modal.close();
    });
});