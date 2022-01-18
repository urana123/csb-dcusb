let $nameP = document.querySelector('.name')
let $hiddenFile = document.getElementById('hidden-file')
let $image = document.getElementById('image')
let $picCon = document.querySelector('.pic-con')
let $inp = document.getElementById('inp')
let $user

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        $user = user
        if (user.photoURL) {
            console.log(user.photoURL);
            $image.src = user.photoURL
        }
        if (user.displayName) {
            $nameP.innerHTML = user.displayName
        }

    }
})

let save = () => {

    const imageRef = firebase.storage().ref().child(`profiles/${$user.uid}.png`);
    imageRef.put($hiddenFile.files[0]).then(() => {
        imageRef.getDownloadURL().then((url) => {
            firebase.auth().currentUser.updateProfile({
                photoURL: url,
                displayName: $inp.value,
            }).then(() => {
                console.log('success');
            })
        });
    }).catch((e) => {
        console.log('error', e);
    });
};


$hiddenFile.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        $picCon.innerHTML = ''
        $photo = reader.result
        $picCon.style.backgroundImage = `url(${reader.result})`;
    }
}


function profile() {
    $hiddenFile.click();
}

function gotogame() {
    const docRef = db.collection("game");
    docRef.add({
        player1: null,
        player2:null,
    }).then((res) => {
        const { id } = res;
        db.collection("game").doc(res.id).set({
            player1: null,
            player2: null,
        });
        location.replace(`./index.html?chuluuTaah-Id=${id}`)
    })
}
// db.collection("game").doc(res.id).collection("subCollection").doc('1').set({

// db.collection("game").doc(id).collection("subCollection").doc("00").get();
// db.collection(`game/${id}/subCollection`).snapshot()
// db.doc(`game/${id}/subCollection/00`).get()