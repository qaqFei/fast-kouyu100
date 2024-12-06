homework = null; // connot be const

function gethw() { // only get the first one
    let hw = document.querySelectorAll(".hjzy");
    if (!hw) return "nohw";
    for (let i of hw) {
        let zzy_ele = i.querySelector(".zzy");
        if (getComputedStyle(zzy_ele, ":after").getPropertyValue("content").includes("现在做训练")) {
            zzy_ele.click();
            return "hashw";
        }
    }
    return "nohw";
}

function gethw_items() {
    let dds = document.querySelectorAll(".synchro-home-list dd");
    if (dds.length == 0) {
        requestAnimationFrame(gethw_items); // wait for the page to load
        return;
    }

    let result = [];

    for (let i of dds) {
        let dd_left = i.querySelector(".dd-left");
        let p = dd_left.childNodes[0];
        let title = p.querySelector("b").innerHTML;

        let dd_center = i.querySelector(".dd-center");
        let successed = dd_center.querySelector("div").innerHTML.includes("已完成");

        console.log(successed);
        if (successed) continue;

        let dd_right = i.querySelector(".dd-right");
        let goto_a = dd_right.querySelector("a");

        result.push([title, goto_a.href]);
    }

    console.log(result, dds);

    homework = result;
}