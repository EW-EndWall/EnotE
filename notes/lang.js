// * get language
const lang = navigator.language.split("-")[0];

switch (lang) {
  case "tr":
    document.title = "EnotE";
    document.getElementById("menuBtn").innerText = "Menu";
    document.getElementById("secBtn").innerText = "Senkronize Et";
    document.getElementById("priority").innerText = "Oncelik : ";
    document.getElementById("null").innerText = "Yok";
    document.getElementById("low").innerText = "Dusuk";
    document.getElementById("normal").innerText = "Normal";
    document.getElementById("high").innerText = "Acil";
    document.getElementById("date").innerText = "Tarih : ";
    document.getElementById("title").innerText = "BASLIK : ";
    document.getElementById("addNote").placeholder = "Başlık..";
    document.getElementById("note").innerText = "NOTE : ";
    document.getElementById("addNoteArea").placeholder = "Not..";
    break;

  default:
    document.title = "EnotE";
    document.getElementById("menuBtn").innerText = "Menu";
    document.getElementById("secBtn").innerText = "Sync";
    document.getElementById("priority").innerText = "Priority : ";
    document.getElementById("null").innerText = "None";
    document.getElementById("low").innerText = "Low";
    document.getElementById("normal").innerText = "Normal";
    document.getElementById("high").innerText = "High";
    document.getElementById("date").innerText = "Date : ";
    document.getElementById("title").innerText = "TITLE : ";
    document.getElementById("addNote").placeholder = "Title..";
    document.getElementById("note").innerText = "NOTE : ";
    document.getElementById("addNoteArea").placeholder = "Note..";
    break;
}
