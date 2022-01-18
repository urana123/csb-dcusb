const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('login-btn', {
    size: 'invisible',
});

let confirmationResult;
document.querySelector('#login-btn').onclick = (e) => {
    const phone = document.querySelector('#login').value;
    const appVerifier = recaptchaVerifier;

    firebase.auth().signInWithPhoneNumber(`+976${phone}`, appVerifier).then((result) => {
        confirmationResult = result;
    }).catch((error) => {
        console.log(error);
    });
    const c2 = document.querySelector('.c2')
    const c1 = document.querySelector('.c1')
    c2.style.display = 'flex'
    c1.style.display = 'none'
}

document.querySelector('#verify-btn').onclick = () => {
    const code = document.querySelector('#verify-code').value;
    confirmationResult.confirm(code).then((result) => {
        if (location.search) {
            location.replace(`index.html${location.search}`);
        } else {
            location.replace('profile.html');
        }
    }).catch((error) => {
        console.log('Code aldaatai bna')
    });
}