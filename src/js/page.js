const tableRow = $(".results__body-list");
const headerPrice = $(".results__header-price");
var priceIncrease = true;
sort_rows("results__table", "price", 0, Number);
tableRow.each((ndx, item) => {
  $(item).on("click", () => {
    tableRow.removeClass("active");
    $(item).addClass("active");
  });
});
//-----------------------------------------------------------
// Сортировка строк таблицы
//-----------------------------------------------------------
// id - идентификатор таблицы
// data - атрибут, по которому будут сортироваться строки
// dir - направление сортировки
// type - тип данных для нормализации
//-----------------------------------------------------------
function sort_rows(id, data, dir, type) {
  var tbl = document.getElementById(id);
  var tbodies = tbl.getElementsByTagName("tbody");
  var tmp_trs = tbodies[0].getElementsByTagName("tr");

  var all_trs = new Array();
  var tmp;

  // Проверить и выбрать строки для сортировки
  for (var i = 0; i < tmp_trs.length; i++) {
    tmp = tmp_trs[i].getAttribute("data-" + data);
    if (tmp) {
      // Нормализованное значение для сортировки
      tmp_trs[i].sort_value = type(tmp);
      all_trs.push(tmp_trs[i]);
    }
  }

  // Сортировка массива строк по значениям
  all_trs.sort(function(a, b) {
    if (a.sort_value == b.sort_value) {
      return 0;
    } else {
      return a.sort_value > b.sort_value ? 1 : -1;
    }
  });

  // Изменить порядок сортировки
  if (dir) {
    all_trs.reverse();
  }

  // Добавить отсортированные строки обратно в таблицу
  var current_row;
  var last_row = null;
  for (i = all_trs.length - 1; i > 0; i--) {
    all_trs[i].parentNode.insertBefore(all_trs[i], last_row);
    last_row = all_trs[i];
  }
}
headerPrice.on("click", () => {
  if (priceIncrease === true) {
    priceIncrease = false;
    headerPrice.html("Стоимость &and;");
    sort_rows("results__table", "price", 0, Number);
  } else {
    priceIncrease = true;
    headerPrice.html("Стоимость &or;");
    sort_rows("results__table", "price", 1, Number);
  }
});
// table (sort_rows is not my code, because this function realized with native js )
const filterQuantity = $(".filter__quantity-item");
filterQuantity.each((ndx, item) => {
  $(item).on("click", () => {
    filterQuantity.removeClass("active");
    $(item).addClass("active");
  });
});
function stringToNumber(element) {
  Number.parseInt(element.html().replace(/[\s.]/g, ""));
}

var twobombSlider = (function() {
  var drag = false;
  var values = [];

  $(".filter__slider").each(function(i, e) {
    updateView(e);
  });
  $(
    ".filter__slider>.filter__bar>.filter__lp,.filter__slider>.filter__bar>.filter__rp"
  ).bind("mousedown", function() {
    drag = $(this);
  });
  $(document).bind("mousemove", function(e) {
    if (!drag) return;
    var x =
      (e.pageX -
        $(drag).outerWidth() / 2 -
        $(drag)
          .parent()
          .parent()
          .offset().left) /
      $(drag)
        .parent()
        .parent()
        .outerWidth();
    if (x < 0) x = 0;
    if (x > 1) x = 1;
    var rp = $(drag)
      .parent()
      .find(".filter__rp");
    var lp = $(drag)
      .parent()
      .find(".filter__lp");
    if ($(drag).hasClass("lp") && x > $(rp).attr("data-pos")) {
      $(rp).attr("data-pos", x);
    }
    if ($(drag).hasClass("rp") && x < $(lp).attr("data-pos")) {
      $(lp).attr("data-pos", x);
    }
    $(drag).attr("data-pos", x);
    updateView(
      $(drag)
        .parent()
        .parent()
    );
  });
  $(document).bind("mouseup", function() {
    drag = false;
  });
  function updateView(slider) {
    var startVal = parseInt(
      $(slider)
        .find(".filter__bar")
        .data("start")
    );
    var endVal = parseInt(
      $(slider)
        .find(".filter__bar")
        .data("end")
    );
    if (startVal > endVal) endVal = startVal;
    startVal = startVal || 0;
    endVal = endVal || 100;
    var values = [];
    for (var i = startVal; i <= endVal; i++) values.push(i);
    var l = $(slider)
      .find(".filter__lp")
      .attr("data-pos");
    var r = $(slider)
      .find(".filter__rp")
      .attr("data-pos");
    var x = $(slider).outerWidth() * l;
    var w = (r - l) * $(slider).outerWidth();
    $(slider)
      .find(".filter__bar")
      .css({ left: x + "px", width: w + "px" });
    var index = Math.round(values.length * l);
    if (index >= values.length) index = values.length - 1;
    if ($(slider).parent(".filter__weight")) {
      $(slider)
        .siblings(".filter__values-wrap")
        .children(".filter__value-lp")
        .html(values[index] + "кг");
    }
    if ($(slider).parent(".filter__price")) {
        $(slider)
          .siblings(".filter__values-wrap")
          .children(".filter__value-lp")
          .html(values[index] + "&#8381;");
      }
    index = Math.round(values.length * r);
    if (index >= values.length) index = values.length - 1;
    if ($(slider).parent(".filter__weight")) {
      $(slider)
        .siblings(".filter__values-wrap")
        .children(".filter__value-rp")
        .html(values[index] + "кг");
    }
    if ($(slider).parent(".filter__price")) {
        $(slider)
          .siblings(".filter__values-wrap")
          .children(".filter__value-rp")
          .html(values[index] + "&#8381;");
      }
  }
})();
// filter
