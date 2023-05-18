window.addEventListener(
  "load",
  function () {
    if (window.location.protocol != "https:") {
      window.location.href = "https:" + "//" + window.location.hostname;
    }
    const username = ("; " + document.cookie)
      .split(`; username=`)
      .pop()
      .split(";")[0];
    const userhashCoolie = ("; " + document.cookie)
      .split(`; userhash=`)
      .pop()
      .split(";")[0];
    //* --------------
    const location = window.location.pathname.split("/").filter((s) => s != "");
    const reqGET = (function (a) {
      if (a == "") return {};
      var b = {};
      for (var i = 0; i < a.length; ++i) {
        var p = a[i].split("=", 2);
        if (p.length == 1) b[p[0]] = "";
        else b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
      }
      return b;
    })(window.location.search.substr(1).split("&"));
    //* --------------
    const version = ("; " + document.cookie)
      .split(`; eVersion=`)
      .pop()
      .split(";")[0];
    if (!version) {
      $.ajax({
        url:
          window.location.protocol + "//" + window.location.hostname + "/api/",
        type: "get",
      });
      setTimeout(function () {
        window.location.reload();
      }, 500);
    } else if (location[0] == "login" || location[0] == null) {
      document.getElementById("eversion").innerText = version;
    }
    //* --------------
    //* LOGİN PAGE
    if (reqGET.result == "error" && location[0] == "login") {
      const data = reqGET.data;
      const txtKadi = reqGET.txtKadi ? reqGET.txtKadi : "";
      const txtMail = reqGET.txtMail ? reqGET.txtMail : "";
      if (txtKadi) {
        document.getElementById("txtKadi").value = txtKadi;
      }
      if (txtMail) {
        document.getElementById("txtMail").value = txtMail;
      }

      if (location[0] == "login" && location[1] == "register") {
        switch (data) {
          case "0":
            document.getElementById("message").innerText =
              "Boş Yerleri Doldurunuz.";
            break;

          case "1":
            document.getElementById("message").innerText =
              "Zaten Böyle Bir Kullanıcı Adı veya Eposta kayıtlı.";
            break;

          default:
            document.getElementById("message").innerText = "Bilinmeyen Hata";
            break;
        }
      } else if (location[0] == "login" && location[1] == "forgetpassword") {
        switch (data) {
          case "0":
            document.getElementById("message").innerText =
              "Boş Yerleri Doldurunuz.";
            break;

          case "1":
            document.getElementById("message").innerText =
              "Hatalı Bilgler veya Aynı Şifre!";
            break;

          default:
            document.getElementById("message").innerText = "Bilinmeyen Hata";
            break;
        }
      } else if (location[0] == "login") {
        switch (data) {
          case "0":
            document.getElementById("message").innerText =
              "Boş Yerleri Doldurunuz.";
            break;

          case "1":
            document.getElementById("message").innerText = "Hatalı Şifre!";
            break;

          case "2":
            document.getElementById("message").innerText =
              "Böle Bir Kullanıcı Bulunamadı.";
            break;

          default:
            document.getElementById("message").innerText = "Bilinmeyen Hata";
            break;
        }
      }
    }
    //* -------------
    try {
      if (location[0] != "login") {
        if (!username && !userhashCoolie) {
          localStorage.clear();
          window.location.href =
            window.location.protocol +
            "//" +
            window.location.hostname +
            "/login/";
        }
        $.ajax({
          url:
            window.location.protocol +
            "//" +
            window.location.hostname +
            "/api/",
          type: "get",
          //   data: "a=b",
          statusCode: {
            403: function (response) {
              localStorage.clear();
              window.location.href =
                window.location.protocol +
                "//" +
                window.location.hostname +
                "/login/";
            },
          },
        });
      } else {
      }
    } catch (e) {
      // console.log(e);
    }
  },
  false
);
