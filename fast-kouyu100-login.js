logined = false; // cannot be const, because this is a global variable to read in python.

function login(domain, un, pwd) {
    jQuery.ajax({
        type: "POST",
        url: "getTokenFromServer.action",
        data: {
            domain: domain,
            userName: un,
            userPwd: hex_md5(pwd),
            password64: new Base64().encode(pwd)
        },
        success: () => {logined = true}
    });
}
