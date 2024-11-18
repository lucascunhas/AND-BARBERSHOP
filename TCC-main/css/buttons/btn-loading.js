const btn_google = document.getElementById('btn-google');
const button = document.getElementById('btn-com-loading');

function handleClick(){
    btn_google.classList.add('loading');

    setTimeout(() => {
        btn_google.classList.remove('loading');
    }, 5000)
}

function handClick(){
    button.classList.add('loading');

    setTimeout(() => {
        button.classList.remove('loading');
    }, 4000)
}

