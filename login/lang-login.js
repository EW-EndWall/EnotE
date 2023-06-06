// * get language
const lang = navigator.language.split("-")[0];

switch (lang) {
  case "tr":
    document.title = "EnotE - Giriş Yap";
    document.getElementById("title").innerText = "Giriş";
    document.getElementById("rememberBtn").innerText = "Beni hatırla";
    document.getElementById("loginBtn").innerText = "GİRİŞ YAP";
    document.getElementById("registerBtn").innerText = "Kaydol";
    document.getElementById("forgetpasswordBtn").innerText =
      "~ Şifremi Unuttum ~";
    break;

  default:
    document.title = "EnotE - Login";
    document.getElementById("title").innerText = "Login";
    document.getElementById("rememberBtn").innerText = "Remember me";
    document.getElementById("loginBtn").innerText = "Login";
    document.getElementById("registerBtn").innerText = "Register";
    document.getElementById("forgetpasswordBtn").innerText =
      "~ Forgot Password ~";
    break;
}
