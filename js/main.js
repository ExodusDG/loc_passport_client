/* АВТОРИЗАЦІЯ */

$('.button_send').click(function() {
    var is_remember;

    if ($('.checkbox-active').hasClass('check-active')) {
        is_remember = true;
    } else {
        is_remember = true;
    }


    var loginData = {
        login: $('#login1').val(),
        password: $('#password').val(),
        is_remember: is_remember
    }

    $.ajax({
        url: 'https://exo-loc-passport-server.herokuapp.com/auth',
        method: 'get',
        dataType: 'json',
        async: false,
        data: loginData,
        success: function(data) {
            $('.login__status').text(data.status);

            if (data.status == 'Дані введені правильно!') {
                setTimeout(() => {
                    var url = "/";
                    $(location).attr('href', url);
                }, 700);

            }
        }
    });
})

$('.checkbox').click(function() {
    $(this).find('.checkbox-active').toggleClass('check-active')
})

/* ПЕРЕВІРКА АВТОРИЗАЦІЇ КОРИСТУВАЧА В ПАНЕЛІ */

if ($('body').attr('id') == 'index') {
    $.ajax({
        url: 'https://exo-loc-passport-server.herokuapp.com/',
        method: 'get',
        dataType: 'json',
        async: false,
        data: 'get data',
        success: function(data) {
            if (data.UserAuth == 'false') {
                $(location).attr('href', '/login.html');
            } else {
                $.ajax({
                    url: 'https://exo-loc-passport-server.herokuapp.com/getlocomotivelist',
                    method: 'get',
                    dataType: 'json',
                    async: false,
                    data: 'get data',
                    success: function(data) {

                        $.each(data, function(key, value) {
                            $('.admin__loc_list').append($("<div class='admin__loc_item'>").append("<span>" + data[key].name + ' (' + data[key].unique_number + ')' + '</span>').attr('loc-number', data[key].unique_number))
                        });
                    }
                });
            }
        }
    });
}

/* ВИХІД З АДМІН - ПАНЕЛІ */

$('.exit__button').click(function() {
    $.ajax({
        url: 'https://exo-loc-passport-server.herokuapp.com/signout',
        method: 'get',
        dataType: 'json',
        async: false,
        data: 'User Sign Out',
        success: function(data) {
            if (data.status == 'deautorized') {
                $(location).attr('href', '/login.html');
            }
        }
    });
})

/* Вибір локомотива */

var locomotiveStats = [];

$('.admin__loc_button').click(function() {
    var selectedLocomotive = {
        number: $('.admin__selected_locomotive').attr('locomotive-number'),
        selectedStat: $('.button__selected').attr('id')
    }

    $.ajax({
        url: 'https://exo-loc-passport-server.herokuapp.com/selectedlocomotive',
        method: 'get',
        dataType: 'json',
        async: false,
        data: selectedLocomotive,
        success: function(data) {
            locomotiveStats = data;
            refreshFrontData()
        }
    });
})


function refreshFrontData() {

    var expStats = [];
    var elecStats = [];
    var dieselStats = [];
    var supStats = [];
    $.each(locomotiveStats, (key, value) => {
        if (key == 'exp_speed') {
            $('#locomotive__speed').text(value)
        } else if (key == 'exp_fuel') {
            $('#locomotive__fuel').text(value)
        } else if (key == 'exp_temp') {
            $('#locomotive__temp').text(value)
        } else if ($('.button__selected').attr('id') == 'exp_stats') {
            $('.info__stats_list').append("<p>" + 'Значення з БД: ' + value + "</p>")
        }
    })
}




/* FRONT END */

$('.admin__menu_locomotive').click(function() {
    $('.admin__loc_list').toggleClass('loc_list_show')
})

$('.admin__menu_item').click(function() {
    $('.admin__menu_item').find('.admin__menu_line').removeClass('line_visible')
    $(this).find('.admin__menu_line').addClass('line_visible')
})

$('.info__stats_button').click(function() {
    $('.info__stats_button').removeClass('button__selected')
    $(this).addClass('button__selected')
})

$('.admin__loc_item').click(function() {
    $('.admin__loc_item').removeClass('loc-selected')
    $(this).addClass('loc-selected')

    $('.admin__selected_locomotive').text($(this).find('span').text());
    $('.admin__selected_locomotive').attr('locomotive-number', $('.loc-selected').attr('loc-number'))
})