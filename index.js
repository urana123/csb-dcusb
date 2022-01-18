let $user;
let $userId;
let theNumberOfSelectedShagai;
let hi = location.search.split("=");
let player1Id;
let player2Id;
let lengthNumber;
let $shots;
let iAmPlayer1 = false;
let $mainBody = document.querySelector(".main-body");

const $shagaiImgArr = [
    "./mori.png",
    "./honi.png",
    "./temee.png",
    "./ymaa.png",
    "./mori.png",
];

inviteFriend();

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        $user = user;
        $userId = user.uid;
        startGame();
    } else {
        location.replace(`./login.html${location.search}`);
    }
});

// console.log(Object.keys(shots.data()).length);
// db.collection("game").doc(id).collection("subCollection").doc("00").get();
// db.collection(`game/${id}/subCollection`).snapshot
// db.doc(`game/${id}/subCollection/00`).get()


function docRefId() {
    db.collection("game").doc(`${hi[1]}`).get().then((shots) => {
        $shots = shots.data();

        if (shots.data().player1 === null) {
            $shots = { ...$shots, player1: $userId };
            db.doc(`game/${hi[1]}`)
                .set({ player1: `${$userId}` }, { merge: true })
                .then(() => {
                    document.querySelector(".invite").style.zIndex = "10";
                });

        } else if (shots.data().player2 === null) {
            if (shots.data().player1 !== $userId) {
                $shots = { player2: $userId };
                db.doc(`game/${hi[1]}`)
                    .set({ player2: `${$userId}` }, { merge: true });
            }
        } else{
            location.replace(`./profile.html`)
        }
        createNewRound();
    });
}

function createNewRound() {
    if ($shots.player1 !== $userId) return;

    db.collection(`game/${hi[1]}/subCollection`).get().then((alim) => {
        lengthNumber = parseInt(alim.size) + 1;
        let docRef = db
            .collection(`game/${hi[1]}/subCollection`)
            .doc(`${lengthNumber}`);
        docRef.set({});
    });
}

db.collection(`game/${hi[1]}/subCollection`).onSnapshot((haaha) => {

    if (haaha.size % 2 !== 0) {
        medque(haaha)
    } else {
        medne(haaha)
    }
});

function medque(par) {

    let mm = Object.keys(par.docs).length - 1
    if (Object.keys(par.docs[mm].data()).length === 2) {

        $mainBody.prepend(guessNumberDraw());
        createNewRound()
    }
}

function medne(par) {
    let jjuse
    let jjuse1
    let mm = Object.keys(par.docs).length - 1

    if (Object.keys(par.docs[mm].data()).length === 2) {
        for (const [key, value] of Object.entries(par.docs[par.size - 2].data())) {
            if (key === $userId) {
                jjuse = value
            } else {
                jjuse1 = value
            }
        }
        $mainBody.prepend(openHandDraw(jjuse1, jjuse));
        createNewRound()
        winningFun(par, jjuse1, jjuse)
    }
}

function winningFun(par, mine, someones) {
    let jj
    let jj1

    for (const [key, value] of Object.entries(par.docs[par.size - 1].data())) {
        if (key === $userId) {
            jj = value
        } else {
            jj1 = value
        }
    }

    console.log(jj, jj1, mine, someones);
    if (jj1 === someones) {
        $mainBody.prepend(winningDraw('ter', $user.displayName));
    }
    if (jj === mine) {
        $mainBody.prepend(winningDraw($user.displayName, 'ter'));
    }
    setTimeout(() => {
        $mainBody.prepend(chooseNumberDraw());
    }, 2000);
}

function startGame() {
    docRefId();
    $mainBody.prepend(chooseNumberDraw());
}

function winningDraw(name1, name2) {
    let winningBody = `
        <p>${name1} Win Yeyy &#127881;</p>
        <p>${name2} Loose </p>
    `;

    const $mainDiv = document.createElement("div");
    $mainDiv.className = "winning row between";
    $mainDiv.style.margin = "5px 0";
    $mainDiv.style.padding = "0px 30px";

    $mainDiv.innerHTML = winningBody;

    return $mainDiv;
}

function openHandDraw(number1, number2) {
    const openHandBody = `
        <div class="flex j-start left-hand" style="height: 162px; position: relative;">
            <img height="100%" src="./leftOpen.png" alt="">
        </div>
        <div class="flex j-end right-hand" style="height: 162px; position: relative;">
            <img height="100%" src="./rightOpen.png" alt="">
        </div>
    `;
    const $mainDiv = document.createElement("div");
    $mainDiv.className = "open-hand column";
    $mainDiv.style.margin = "5px 0";

    $mainDiv.innerHTML = openHandBody;

    const $leftHand = $mainDiv.querySelector(".left-hand");
    helperDrawShagai($leftHand, number1);

    const $rightHand = $mainDiv.querySelector(".right-hand");
    helperDrawShagai($rightHand, number2);

    return $mainDiv;
}

function guessNumberDraw() {
    const guessNumberBody = `
        <div class="flex j-start">
            <img src="./leftHand.png" alt="">
        </div>
        <div class="flex between" style="padding-left: 30px;">
            <div class="choose-shagai row">
                <img width="40px" class="shagai" id="mori" style="opacity: 0.4;" src="./mori.png" alt="">
                <img width="40px" class="shagai" id="temee" style="opacity: 0.4;" src="./temee.png" alt="">
                <img width="40px" class="shagai" id="ymaa" style="opacity: 0.4;" src="./ymaa.png" alt="">
                <img width="40px" class="shagai" id="honi" style="opacity: 0.4;" src="./honi.png" alt="">
                <img width="40px" class="shagai" id="mori1" style="opacity: 0.4;" src="./mori.png" alt="">
                <div class="check flex center check-not" id='checkingSecondOwn'>
                    <i class="fa fa-check" style="font-size:13px;"></i>
                </div>
            </div>
            <img src="./rightHand.png" alt="">
        </div>
        <div class="flex j-end" style="padding: 0 30px;">
            <div class="loader-border">
                <div class="loader"></div>
                <div class="check flex center check-not" id="chackingSecondOpposite">
                    <i class="fa fa-check" style="font-size:13px;"></i>
                </div>
            </div>
        </div>
    `;
    const $mainDiv = document.createElement("div");
    $mainDiv.className = "guess number column";
    $mainDiv.style.margin = "5px 0";

    $mainDiv.innerHTML = guessNumberBody;
    const shagaiArr = $mainDiv.querySelectorAll(".shagai");
    for (let shagai of shagaiArr) {
        shagai.onclick = chooseNumber;
    }
    let matar = $mainDiv.querySelector("#checkingSecondOwn");
    matar.onclick = () => checkingDoneOrNot(matar);

    return $mainDiv;
}

function chooseNumberDraw() {
    const chooseNumberBody = `
    <div class="flex j-start">
        <div class="loader-border">
            <div class="loader"></div>
            <div class="check flex center check-not" id="checkingOpposite">
                <i class="fa fa-check" style="font-size:13px;"></i>
            </div>
        </div>
    </div>
    <div class="flex j-end">
        <div class="choose-shagai row">
            <img width="40px" id="mori" class="shagai" style="opacity: 0.4;" src="./mori.png" alt="">
            <img width="40px" id="temee" class="shagai" style="opacity: 0.4;" src="./temee.png" alt="">
            <img width="40px" id="ymaa" class="shagai" style="opacity: 0.4;" src="./ymaa.png" alt="">
            <img width="40px" id="honi" class="shagai" style="opacity: 0.4;" src="./honi.png" alt="">
            <img width="40px" id="mori1" class="shagai" style="opacity: 0.4;" src="./mori.png" alt="">
            <div class="check flex center check-not" id="checkingOwn">
                <i class="fa fa-check" style="font-size:13px;"></i>
            </div>
        </div>
    </div>
    `;
    const $mainDiv = document.createElement("div");
    $mainDiv.className = "choose-number column";
    $mainDiv.style.padding = `0px 30px`;
    $mainDiv.style.margin = "20px 0";

    $mainDiv.innerHTML = chooseNumberBody;
    const shagaiArr = $mainDiv.querySelectorAll(".shagai");
    for (let shagai of shagaiArr) {
        // shagai.dataset.index = shagaiArr[shagai]

        shagai.onclick = chooseNumber;
    }
    let matar = $mainDiv.querySelector("#checkingOwn");
    matar.onclick = () => checkingDoneOrNot(matar);

    return $mainDiv;
}

function checkingDoneOrNot(par) {
    if (par.className === "check flex center check-not") {
        par.className = "check flex center check-done";
    } else {
        return;
    }
    let SizeOfDoc;

    db.collection(`game/${hi[1]}/subCollection`)
        .get()
        .then((alim) => {
            SizeOfDoc = parseInt(alim.size);
            let docRef = db
                .collection(`game/${hi[1]}/subCollection`)
                .doc(`${SizeOfDoc}`);

            docRef
                .set({
                    [$userId]: theNumberOfSelectedShagai,
                }, { merge: true })
                .then((res) => {
                    console.log("success");
                });
        });
}

function chooseNumber(e) {
    for (let i = 0; i < 5; i++) {
        e.target.parentElement.children[i].style.opacity = "0.4";
    }

    if (e.target.id === "mori") {
        theNumberOfSelectedShagai = 1;
    } else if (e.target.id === "temee") {
        theNumberOfSelectedShagai = 2;
    } else if (e.target.id === "ymaa") {
        theNumberOfSelectedShagai = 3;
    } else if (e.target.id === "honi") {
        theNumberOfSelectedShagai = 4;
    } else if (e.target.id === "mori1") {
        theNumberOfSelectedShagai = 5;
    }

    for (let i = 0; i < theNumberOfSelectedShagai; i++) {
        e.target.parentElement.children[i].style.opacity = "1";
    }
}

function helperDrawShagai(par, number) {
    const div = document.createElement("div");
    div.style.width = "8%";
    div.style.height = "50%";
    if (par.className === "flex j-start left-hand") {
        div.className = "number-of-shagai-left flex center";
    } else {
        div.className = "number-of-shagai-right flex center";
    }

    for (let i = 0; i < number; i++) {
        const img = document.createElement("img");
        img.src = $shagaiImgArr[i];
        img.style.width = "45%";
        div.append(img);
    }
    par.append(div);
}

function inviteFriend() {
    let $invitation = document.getElementById("invitation");
    $invitation.innerHTML = location.href;
}

function done() {
    document.querySelector(".invite").style.zIndex = "-1";
}

function copyFunction() {
    let copyText = document.getElementById("invitation").innerText;
    navigator.clipboard.writeText(copyText);

    document.getElementById("copyIcon").style.display = "none";
    document.getElementById("checkIcon").style.display = "flex";
}