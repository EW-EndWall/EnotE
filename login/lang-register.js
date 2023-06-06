// * get language
const lang = navigator.language.split("-")[0];

switch (lang) {
  case "tr":
    document.title = "EnotE - Kaydol";
    document.getElementById("title").innerText = "Kaydol";
    document.getElementById("txtKadi").placeholder = "Kullanıcı adı";
    document.getElementById("txtMail").placeholder = "E Mail";
    document.getElementById("txtParola").placeholder = "En az 6 karakter";
    document.getElementById("txtKod").placeholder = "6 Rakamlı Güvenlik Kodu";
    document.getElementById("loginBtn").innerText = "Giriş yap";
    document.getElementById("registerBtn").innerText = "Kaydol";

    break;

  default:
    document.title = "EnotE - Register";
    document.getElementById("title").innerText = "Register";
    document.getElementById("txtKadi").placeholder = "User name";
    document.getElementById("txtMail").placeholder = "E Mail";
    document.getElementById("txtParola").placeholder = "Password";
    document.getElementById("txtKod").placeholder = "6 Digit Security Code";
    document.getElementById("loginBtn").innerText = "Login";
    document.getElementById("registerBtn").innerText = "Register";
    break;
}
