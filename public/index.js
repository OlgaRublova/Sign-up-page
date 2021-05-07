const btnCreateAccount = document.querySelector('.btn-create');
const footer = document.querySelector('.signup__footer');
const btnSignUp = document.querySelector('.btn-signup');
const regBtns = document.querySelector('.registration-btns');

console.log(regBtns)

btnCreateAccount.addEventListener('click', showCreateAccountForm);

function showCreateAccountForm(){
    btnSignUp.style.display = 'none';
    footer.classList.add('show');
    regBtns.style.display = 'block';
    btnCreateAccount.textContent = "Confirm"

}