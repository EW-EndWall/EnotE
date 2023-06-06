// * get language
const lang = navigator.language.split("-")[0];

switch (lang) {
  case "tr":
    document.title = "EnotE - Şifre Sıfırla";
    document.getElementById("title").innerText = "Şifre Sıfırla";
    document.getElementById("txtKadi").placeholder = "Kullanıcı adı";
    document.getElementById("txtMail").placeholder = "E Mail";
    document.getElementById("txtParola").placeholder = "En az 6 karakter";
    document.getElementById("txtKod").placeholder = "6 Rakamlı Güvenlik Kodu";
    document.getElementById("loginBtn").innerText = "Giriş Yap";
    document.getElementById("forgetpasswordBtn").innerText = "Sıfırla";

    break;

  default:
    document.title = "EnotE - Reset Password";
    document.getElementById("title").innerText = "Reset Password";
    document.getElementById("txtKadi").placeholder = "User name";
    document.getElementById("txtMail").placeholder = "E Mail";
    document.getElementById("txtParola").placeholder = "Password";
    document.getElementById("txtKod").placeholder = "6 Digit Security Code";
    document.getElementById("loginBtn").innerText = "Login";
    document.getElementById("forgetpasswordBtn").innerText = "Reset";
    break;
}
