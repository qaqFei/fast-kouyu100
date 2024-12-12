checker_status = {
    gendu: false,

    _w2m_started: false,
    w2m: false,

    _cpbw_last: -1,
    cpbw: false,
};

function gendu_checker() {
    let popup_ele = document.querySelector(".arivoc-plugin-course-read .read-alert .popup");
    if (!popup_ele) {
        requestAnimationFrame(gendu_checker);
        return;
    }

    let alert_content = popup_ele.querySelector(".alert-content");
    let content_text = alert_content.querySelector("p").innerText;

    if (!content_text.includes("保存记录成功")) {
        requestAnimationFrame(gendu_checker);
        return;
    }

    checker_status.gendu = true;
}

function w2m_checker() {
    if (!checker_status._w2m_started) {
        let start_but = document.querySelector(".arivoc-word-2minutes .w2m-home-page.homework-type .w2m-home-begin .homework .work-starter");
        if (!start_but) {
            requestAnimationFrame(w2m_checker);
            return;
        }

        checker_status._w2m_started = true;
        start_but.click();
        requestAnimationFrame(w2m_checker);
        return;
    }

    let apages = document.querySelectorAll(".w2m-study-after-page");
    for (let apitem of apages) {
        if (apitem.style.display != "none") {
            checker_status.w2m = true;
            return;
        }
    }
    
    requestAnimationFrame(w2m_checker);
}

function cpbw_checker() {
    let wordFlash = document.querySelector("#wordFlash");
    let modeChoosScore = document.querySelector(".modeChoosScore");
    
    if (!wordFlash) {
        requestAnimationFrame(cpbw_checker);
        return;
    }

    if(!checker_status.cpbw && wordFlash.clientWidth == 1) {
        let start_but = document.querySelector(".picChoose_btn img");
        if (!start_but) {
            requestAnimationFrame(cpbw_checker);
            return;
        }

        start_but.click();
        requestAnimationFrame(cpbw_checker);
        return;
    }

    try {
        let rn = parseInt(wordFlash.querySelector(".word-right").innerHTML);
        if (rn < checker_status._cpbw_last) {
            checker_status.cpbw = true;
            return;
        }

        checker_status._cpbw_last = rn;
    }
    catch {}

    let option = wordFlash.querySelector(".arivoc-choose-picture .body .optionA img");
    if (option && wordFlash.clientWidth != 1) {
        option.click();
    }

    if (modeChoosScore.style.display == "none") {
        requestAnimationFrame(cpbw_checker);
        return;
    }

    checker_status.cpbw = true;
}