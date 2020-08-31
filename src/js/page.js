const tableRow = $(".results__body-list");
const headerPrice = $(".results__header-price");
var priceIncrease = true;
sort_rows("results__table", "price", 0, Number);
tableRow.each((ndx, item) => {
  $(item).on("click", () => {
    if ($(item).hasClass("active")) {
      tableRow.removeClass("active");
    } else {
      tableRow.removeClass("active");
      $(item).addClass("active");
    }
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
    if ($(item).hasClass("active")) {
      filterQuantity.removeClass("active");
    } else {
      filterQuantity.removeClass("active");
      $(item).addClass("active");
    }
  });
});
var mouseDownLeft = false;
var mouseDownRight = false;
var md = new MobileDetect(window.navigator.userAgent);
function scrollFilter(parameter, sign) {
  var leftDote = parameter.find(".filter__lp");
  var rightDote = parameter.find(".filter__rp");
  var minText = parameter.find(".filter__value-lp");
  var maxText = parameter.find(".filter__value-rp");
  var doteBar = parameter.find(".filter__bar");
  var max = doteBar.attr("data-max");
  var parameterWidth = parameter.width();
  var positionMin = max * leftDote.attr("data-pos");
  var positionMax = max * rightDote.attr("data-pos");
  positionMin = (positionMin + "").replace(
    /(\d)(?=(\d\d\d)+([^\d]|$))/g,
    "$1 "
  );
  positionMax = (positionMax + "").replace(
    /(\d)(?=(\d\d\d)+([^\d]|$))/g,
    "$1 "
  );
  minText.html(`${positionMin} ${sign}`);
  maxText.html(`${positionMax} ${sign}`);
  positionMin = parameterWidth * leftDote.attr("data-pos");
  positionMax = parameterWidth - parameterWidth * rightDote.attr("data-pos");
  doteBar.css({
    "margin-left": `${positionMin}px`,
    "margin-right": `${positionMax}px`
  });
  var pos = parameter.offset();
  function doteClick(dote) {
    dote.on("mousedown touchstart", () => {
      if (dote === leftDote) {
        mouseDownLeft = true;
      }
      if (dote === rightDote) {
        mouseDownRight = true;
      }
      parameter.on("mousemove touchmove", e => {
        var elem_left = pos.left.toFixed(0);
        var x = event.pageX - elem_left;
        if (md.mobile()) {
          x = event.changedTouches[0].pageX - elem_left;
        }
        x = parseInt(x);
        if (x < 0) {
          x = 0;
        }
        if (x >= parameterWidth) {
          x = parameterWidth;
        }
        if (mouseDownLeft === true) {
          positionMin = x;
          if (positionMin + positionMax < parameterWidth - 10) {
            positionMin = Math.round((positionMin / parameterWidth) * max);
            positionMin = (positionMin + "").replace(
              /(\d)(?=(\d\d\d)+([^\d]|$))/g,
              "$1 "
            );
            minText.html(`${positionMin} ${sign}`);
            positionMin = x;
            doteBar.css({
              "margin-left": `${positionMin}px`
            });
          }
        }
        if (mouseDownRight === true) {
          positionMax = parameterWidth - x;
          if (positionMin + positionMax < parameterWidth - 10) {
            positionMax = Math.round(
              ((parameterWidth - positionMax) / parameterWidth) * max
            );
            positionMax = (positionMax + "").replace(
              /(\d)(?=(\d\d\d)+([^\d]|$))/g,
              "$1 "
            );
            maxText.html(`${positionMax} ${sign}`);
            positionMax = parameterWidth - x;
            doteBar.css({
              "margin-right": `${positionMax}px`
            });
          }
        }
      });
    });
  }
  doteClick(leftDote);
  doteClick(rightDote);
  $("body").on("touchend mouseup", () => {
    mouseDownLeft = false;
    mouseDownRight = false;
  });
}
scrollFilter($(".filter__weight"), "кг");
scrollFilter($(".filter__price"), "&#8381");
// filter
