const addInput = document.getElementById("addTodo");
const addButton = document.getElementById("addTodoBtn");
const todoList = document.getElementById("todos");
const mainSelect = document.getElementById("mainSelect");
const inputDate = document.getElementById("datepicker");
const nowDate = document.getElementById("nowDate");
const datepicker = new Datepicker("#datepicker");

const getListItems = () => document.querySelectorAll("#todos > li");

const todoTitle = (text) => {
  const title = document.createElement("span");
  title.classList.add("inner-text");
  title.innerText = text;

  return title;
};

const todoInput = () => {
  const editInput = document.createElement("input");
  editInput.classList.add("editInput");

  return editInput;
};

const dateP = (date) => {
  const dateP = document.createElement("p");
  dateP.classList.add("date-p");
  dateP.innerText = date;

  return dateP;
};
const setupdate = (update) => {
  const setupdate = document.createElement("div");
  setupdate.classList.add("update-div");
  setupdate.innerText = update;

  return setupdate;
};
const createdate = (cdate) => {
  const createdate = document.createElement("div");
  createdate.classList.add("cdate-div");
  createdate.innerText = cdate;

  return createdate;
};

const setColor = (color, el) => {
  el.style.boxShadow = "inset 10px 0px 0px 0px " + color;
};

const todoWrapper = () => {
  const wrapper = document.createElement("li");
  wrapper.classList.add("list");

  function styleVisibility() {
    wrapper.style.opacity = "1";
  }

  const box1 = document.createElement("div");
  box1.classList.add("text");
  wrapper.appendChild(box1);
  const box2 = document.createElement("div");
  box2.classList.add("option");
  wrapper.appendChild(box2);

  setTimeout(styleVisibility, 1);

  return wrapper;
};

const todoCheckbox = (checked) => {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = checked == "true" ? true : false;

  return checkbox;
};

const todoCheckLabel = () => {
  const checkLabel = document.createElement("label");
  const checkSpan = document.createElement("span");
  checkLabel.classList.add("check-container");
  checkSpan.classList.add("checkmark");
  checkLabel.appendChild(checkSpan);

  return checkLabel;
};

const todoItem = ({ text, checked, color, date, update, create }) => {
  const wrapper = todoWrapper();
  const labelContainer = todoCheckLabel();
  const checkbox = todoCheckbox(checked);
  const title = todoTitle(text);
  const edInput = todoInput();
  const btnDiv = buttonsDiv();
  const setDate = dateP(date);
  const updateTime = setupdate(update);
  const createTime = createdate(create);

  const remBtn = rBtn();
  const edbBtn = ebBtn();
  const edBtn = eBtn();
  const okBtn = oBtn();

  wrapper.firstElementChild.appendChild(labelContainer);
  labelContainer.insertBefore(checkbox, labelContainer.children[0]);
  wrapper.firstElementChild.appendChild(title);

  wrapper.lastElementChild.appendChild(setDate);
  wrapper.lastElementChild.appendChild(btnDiv);

  btnDiv.appendChild(remBtn);
  btnDiv.appendChild(edBtn);

  wrapper.lastElementChild.appendChild(createTime);
  wrapper.lastElementChild.appendChild(updateTime);

  //*remove button
  remBtn.addEventListener("click", () => {
    if (confirm("Silmek istediğine eminmisin!") == true) {
      localStorage.removeItem("todo");
      todoList.removeChild(wrapper);
      const create = wrapper.appendChild(createTime).innerHTML;
      saveData([create, "delete"]);
    }
  });

  //*edit back button
  edbBtn.addEventListener("click", () => {
    wrapper.firstElementChild.removeChild(edInput);
    wrapper.firstElementChild.appendChild(title);

    btnDiv.removeChild(okBtn);
    btnDiv.appendChild(edBtn);
    btnDiv.removeChild(edbBtn);
  });

  //*edit button
  edBtn.addEventListener("click", () => {
    edInput.value = title.innerHTML;
    wrapper.firstElementChild.removeChild(title);
    wrapper.firstElementChild.appendChild(edInput);

    edInput.focus();
    btnDiv.appendChild(edbBtn);
    btnDiv.removeChild(edBtn);
    btnDiv.appendChild(okBtn);
  });

  //*edit button ok
  okBtn.addEventListener("click", () => {
    title.innerHTML = edInput.value;
    wrapper.firstElementChild.removeChild(edInput);
    wrapper.firstElementChild.appendChild(title);
    btnDiv.removeChild(okBtn);
    btnDiv.appendChild(edBtn);
    btnDiv.removeChild(edbBtn);

    const create = wrapper.lastElementChild.appendChild(createTime).innerHTML;
    const currenttime = new Date().toLocaleString();

    const localupdatecheck =
      localStorage.todos_update && localStorage.todos_update.length > 2
        ? JSON.parse(localStorage.todos_update).some(function (obj) {
            return (
              obj.create ==
              wrapper.lastElementChild.appendChild(createTime).innerHTML
            );
          })
        : false;
    if (localupdatecheck) {
      saveData([create, "edit", title.innerHTML, currenttime, "new"]);
    } else {
      saveData([create, "edit", title.innerHTML, currenttime]);
    }
    wrapper.lastElementChild.appendChild(updateTime).innerHTML = currenttime;
  });

  const textStyle = () => {
    if (checkbox.checked && checkbox.checked == true) {
      title.style.textDecoration = "line-through";
      title.style.color = "#adb5bd";
    } else {
      title.style.textDecoration = "none";
      // title.style.color = "#343a40";
    }
  };

  checkbox.addEventListener("click", () => {
    textStyle();

    const create = wrapper.appendChild(createTime).innerHTML;
    const currenttime = new Date().toLocaleString();
    const localupdatecheck =
      localStorage.todos_update && localStorage.todos_update.length > 2
        ? JSON.parse(localStorage.todos_update).some(function (obj) {
            return obj.create == wrapper.appendChild(createTime).innerHTML;
          })
        : null;
    if (localupdatecheck) {
      saveData([create, "edit", checkbox.checked, currenttime, "new"]);
    } else {
      saveData([create, "edit", checkbox.checked, currenttime]);
    }

    wrapper.appendChild(updateTime).innerHTML = currenttime;
  });

  textStyle();

  const valueColor = {
    no: () => {
      return wrapper;
    },
    low: () => {
      setColor("#40c057", wrapper);
    },
    middle: () => {
      setColor("#fd7e14", wrapper);
    },
    high: () => {
      setColor("#fa5252", wrapper);
    },
  };

  valueColor[color]();

  wrapper.dataset.priority = color;

  return wrapper;
};

const addTodo = (data) => {
  const todo = todoItem(data);
  todoList.appendChild(todo);
};

const buttonsDiv = () => {
  const btnsDiv = document.createElement("div");
  btnsDiv.classList.add("btnsDiv");

  return btnsDiv;
};

const rBtn = () => {
  const removeBtn = document.createElement("button");
  removeBtn.classList.add("removeBtn");
  removeBtn.classList.add("square-btn");
  removeBtn.id = "removeBtn";

  const removeIcon = document.createElement("i");
  removeIcon.classList.add("circle-icon", "far", "fa-trash-alt");
  removeBtn.appendChild(removeIcon);

  return removeBtn;
};

const ebBtn = () => {
  const editbackBtn = document.createElement("button");
  editbackBtn.classList.add("editBtn");
  editbackBtn.classList.add("square-btn");
  editbackBtn.id = "editBtn";

  const editbackIcon = document.createElement("i");
  editbackIcon.classList.add("circle-icon", "fas", "fa-times");
  editbackBtn.appendChild(editbackIcon);

  return editbackBtn;
};

const eBtn = () => {
  const editBtn = document.createElement("button");
  editBtn.classList.add("editBtn");
  editBtn.classList.add("square-btn");
  editBtn.id = "editBtn";

  const editIcon = document.createElement("i");
  editIcon.classList.add("circle-icon", "fas", "fa-pen");
  editBtn.appendChild(editIcon);

  return editBtn;
};

const oBtn = () => {
  const okBtn = document.createElement("button");
  okBtn.classList.add("okBtn");
  okBtn.classList.add("square-btn");
  okBtn.id = "okBtn";

  const okIcon = document.createElement("i");
  okIcon.classList.add("circle-icon", "far", "fa-check-square");
  okBtn.appendChild(okIcon);

  return okBtn;
};

const clear = (anyInput) => {
  anyInput.value = "";
  localStorage;
};

const parseListItem = (item) => {
  const text = item.querySelector("span.inner-text");
  const checkbox = item.querySelector('input[type="checkbox"]');
  const dateText = item.querySelector("p.date-p");

  return {
    text: text.innerText,
    checked: checkbox.checked,
    color: item.dataset.priority,
    date: dateText.innerText,
  };
};

const parseList = (list) => {
  return list.map(parseListItem);
};

const saveData = (x) => {
  if (Array.isArray(x)) {
    const status = x[1];
    const localupdate = localStorage.todos_update
      ? JSON.parse(localStorage.todos_update)
      : [];
    const localupdatecheck = localupdate.some(
      (element) => element["create"] == x[0]
    );
    if (localupdatecheck) {
      if (status == "delete") {
        const status = localupdate.filter(function (obj) {
          return obj.create == x[0];
        });
        if (status[0].status == "new") {
          const update = localupdate.filter(function (obj) {
            return obj.create != x[0];
          });
          localStorage.setItem("todos_update", JSON.stringify(update));
        } else {
          localupdate.reduce(function (acc, obj) {
            acc.push(
              obj.create == x[0]
                ? Object.assign(obj, {
                    update: new Date().toLocaleString(),
                    status: "delete",
                  })
                : obj
            );
            return acc;
          }, []);
          localStorage.setItem("todos_update", JSON.stringify(localupdate));
        }
      } else if (status == "edit") {
        if (typeof x[2] == "boolean") {
          localupdate.reduce(function (acc, obj) {
            acc.push(
              obj.create == x[0]
                ? Object.assign(obj, {
                    update: x[3],
                    status: x[4] == "new" ? "new" : "edit",
                    checked: x[2],
                  })
                : obj
            );
            return acc;
          }, []);
          localStorage.setItem("todos_update", JSON.stringify(localupdate));
        } else {
          localupdate.reduce(function (acc, obj) {
            acc.push(
              obj.create == x[0]
                ? Object.assign(obj, {
                    update: x[3],
                    status: x[4] == "new" ? "new" : "edit",
                    text: x[2],
                  })
                : obj
            );
            return acc;
          }, []);
          localStorage.setItem("todos_update", JSON.stringify(localupdate));
        }
      }
    } else if (localStorage.todos) {
      //* local kaydı işliyoruz
      const local = JSON.parse(localStorage.todos);
      const localup = local;
      //*--
      const localok = local.filter(function (obj) {
        return obj.create !== x[0];
      });
      localStorage.setItem("todos", JSON.stringify(localok));
      //* local update ekliyoz
      if (status == "delete") {
        const update = localup
          .filter(function (obj) {
            return obj.create == x[0];
          })
          .reduce(function (acc, obj) {
            acc.push(
              obj.create == x[0]
                ? Object.assign(obj, { status: "delete" })
                : obj
            );
            return acc;
          }, [])[0];
        localStorage.setItem(
          "todos_update",
          JSON.stringify(localupdate.concat([update]))
        );
      } else if (status == "edit") {
        if (typeof x[2] == "boolean") {
          const update = localup
            .filter(function (obj) {
              return obj.create == x[0];
            })
            .reduce(function (acc, obj) {
              acc.push(
                obj.create == x[0]
                  ? Object.assign(obj, {
                      update: x[3],
                      status: "edit",
                      checked: x[2],
                    })
                  : obj
              );
              return acc;
            }, [])[0];
          localStorage.setItem(
            "todos_update",
            JSON.stringify(localupdate.concat([update]))
          );
        } else {
          const update = localup
            .filter(function (obj) {
              return obj.create == x[0];
            })
            .reduce(function (acc, obj) {
              acc.push(
                obj.create == x[0]
                  ? Object.assign(obj, {
                      update: x[3],
                      status: "edit",
                      text: x[2],
                    })
                  : obj
              );
              return acc;
            }, [])[0];
          localStorage.setItem(
            "todos_update",
            JSON.stringify(localupdate.concat([update]))
          );
        }
      }
    }
  } else {
    const local = localStorage.todos_update;
    const data = local ? JSON.parse(local).concat([x]) : [x];
    localStorage.setItem("todos_update", JSON.stringify(data));
    addTodo(x);
  }
  senkData();
};

const loadData = async () => {
  todosClear();
  const data = await localStorage.todos;
  const update = await localStorage.todos_update;

  if (data && update) {
    const datapars = await JSON.parse(await data);
    const updatepars = await JSON.parse(await update);
    const dataok = datapars.filter(function (obj) {
      const c = updatepars.some(function (data) {
        return data.create == obj.create;
      });
      if (!c) return obj;
    });
    const parsedData = dataok.concat(updatepars).filter(function (obj) {
      return obj.status !== "delete";
    });
    parsedData.forEach(addTodo);
  } else if (data) {
    const parsedData = JSON.parse(data);
    parsedData.forEach(addTodo);
  } else if (update) {
    const parsedData = JSON.parse(update).filter(function (obj) {
      return obj.status !== "delete";
    });
    parsedData.forEach(addTodo);
  }
};

addButton.addEventListener("click", () => {
  if (!addInput.value.trim()) {
    return false;
  }

  const time = new Date().toLocaleString();

  const data = {
    text: addInput.value,
    checked: false,
    color: mainSelect.options[mainSelect.selectedIndex].value,
    date: inputDate.value,
    status: "new",
    update: "",
    create: "" + time + "",
  };

  saveData(data);
  document.getElementById("mainSelect").value = "no";
  clear(addInput);
  clear(inputDate);
});

const getDate = () => {
  var months = new Array(13);

  var time = new Date();
  var date = time.getDate();
  var thisyear = time.getFullYear();
  var day = time.getDay() + 1;

  if (thisyear < 2000) thisyear = thisyear + 1900;
  // * get language
  const lang = navigator.language.split("-")[0];
  if (lang == "tr") {
    months[1] = "Ocak";
    months[2] = "Şubat";
    months[3] = "Mart";
    months[4] = "Nisan";
    months[5] = "Mayıs";
    months[6] = "Haziran";
    months[7] = "Temmuz";
    months[8] = "Ağustos";
    months[9] = "Eylül";
    months[10] = "Ekim";
    months[11] = "Kasım";
    months[12] = "Aralık";
    if (day == 1) DayofWeek = "Pazar";
    if (day == 2) DayofWeek = "Pazartesi";
    if (day == 3) DayofWeek = "Salı";
    if (day == 4) DayofWeek = "Çarşamba";
    if (day == 5) DayofWeek = "Perşembe";
    if (day == 6) DayofWeek = "Cuma";
    if (day == 7) DayofWeek = "Cumartesi";
  } else {
    months[1] = "January";
    months[2] = "February";
    months[3] = "March";
    months[4] = "April";
    months[5] = "May";
    months[6] = "June";
    months[7] = "July";
    months[8] = "August";
    months[9] = "September";
    months[10] = "October";
    months[11] = "November";
    months[12] = "December";
    if (day == 1) DayofWeek = "Sunday";
    if (day == 2) DayofWeek = "Monday";
    if (day == 3) DayofWeek = "Tuesday";
    if (day == 4) DayofWeek = "Wednesday";
    if (day == 5) DayofWeek = "Thursday";
    if (day == 6) DayofWeek = "Friday";
    if (day == 7) DayofWeek = "Saturday";
  }
  var thismonth = months[time.getMonth() + 1];

  nowDate.innerHTML =
    "<span>" + date + " " + thismonth + "</span>" + "<br>" + DayofWeek;
};
function todosClear() {
  document.getElementById("todos").innerHTML = "";
}

getDate();

//* date only number jquery
$("input[id='datepicker']").on("input", function (e) {
  $(this).val(
    $(this)
      .val()
      .replace(/[^0-9]/g, "")
  );
});

//* api
function senkData() {
  if (localStorage.todos_update && localStorage.todos_update.length > 2) {
    const local =
      localStorage.todos > 2 ? JSON.parse(localStorage.todos) : false;
    const localupdate = JSON.parse(localStorage.todos_update);
    for (const data in localupdate) {
      const localup = JSON.parse(localStorage.todos_update);
      const e = localupdate[data];
      const status = (function () {
        let tmp = null;
        $.post(
          {
            async: false,
            url:
              window.location.protocol +
              "//" +
              window.location.hostname +
              "/api/",
          },
          {
            formid: "todo",
            data: e,
          },
          function (data) {
            data == "success" ? (tmp = "success") : (tmp = "fail");
          }
        );
        return tmp;
      })();
      // * get language
      const lang = navigator.language.split("-")[0];
      if (status == "fail") {
        if ($("#senk span").length == 0) {
          if (lang == "tr") {
            $("#senk").append(
              '<span class="error">Senkronizasyon Hatalı</span>'
            );
          } else {
            $("#senk").append('<span class="error">Sync Incorrect</span>');
          }
        }
        getTodos();
        break;
      } else {
        if ($("#senk span").length == 0) {
          if (lang == "tr") {
            $("#senk").append(
              '<span class="succes">Senkronizasyon Başarılı</span>'
            );
          } else {
            $("#senk").append('<span class="error">Sync Successful</span>');
          }
        }
        const localok = localup.filter(function (obj) {
          return obj.create != e.create;
        });
        localStorage.setItem("todos_update", JSON.stringify(localok));
        localStorage.setItem(
          "todos",
          JSON.stringify(local ? local.concat([e]) : [e])
        );
        getTodos();
      }
    }
    setTimeout(function () {
      $("#senk").html("");
    }, 2000);
  } else {
    getTodos();
  }
}
async function getTodos() {
  try {
    await $.get(
      {
        async: false,
        url:
          window.location.protocol + "//" + window.location.hostname + "/api/",
      },
      {
        formid: "todo",
      },
      function (x, status) {
        if (status == "success" && x) {
          const data = "[" + JSON.parse(x) + "]";
          localStorage.setItem("todos", data);
          loadData();
        } else {
          loadData();
        }
      }
    );
  } catch (e) {
    loadData();
  }
}
window.onload = function () {
  senkData();
};
