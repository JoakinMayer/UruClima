$(document).ready(iniciar);

function iniciar() {
    $('#select_city').change(cambiarCiudad);

    if (!!window.cordova) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onDeviceReady();
    }
}

function onDeviceReady() {
    navigator.geolocation.getCurrentPosition(function (position) {

        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        $.ajax({
            url: "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude,
            dataType: "json",
            beforeSend: mostrarLoader,
            success: function (ubicacion) {
                var city = ubicacion.results[0].address_components[2].long_name;

                $('#select_city option').each(function () {
                    if ($(this).val() === city) {
                        $(this).attr('selected', 'selected');
                        $('#select_city').val(city);
                    }
                });

                cargarClimaCiudad();
            }
        });
    });
}

function cambiarCiudad() {
    if ($('#select_city').val() !== "") {
        cargarClimaCiudad(); // Cargo clima de esa ciudad
    }
}

function cargarClimaCiudad() {
    var ciudad = $('#select_city').val();

    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + ciudad + ",uy&units=metric&cnt=7&appid=e62b2530fdb5f4ba3559c07c8634e5c7&lang=es",
        dataType: "json",
        beforeSend: mostrarLoader,
        success: mostrarClimaCiudad
    });
}
function mostrarLoader() {
    $('#page_loader').fadeIn();
}
function mostrarClimaCiudad(datos) {
    
    $('#page_loader').fadeOut();
    
    var weather_icon_code = datos.list[0].weather[0].icon;
    var weather_icon = getIconWeather(weather_icon_code);

    var fecha = new Date();

    var dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"];
    var dia_actual = fecha.getDate();
    var dia_semana_actual = dias[fecha.getDay()];
    var mes_actual = meses[fecha.getMonth()];


    $("#weather_icon").removeClass('wi-na').addClass(weather_icon);

    var hora_actual = (new Date()).getHours();
    var temp_actual;
    var bg_class;

    if (hora_actual >= 0 && hora_actual <= 5) {
        temp_actual = parseInt(datos.list[0].temp.night);
        bg_class = 'bg-night';
    } else if (hora_actual > 5 && hora_actual <= 9) {
        temp_actual = parseInt(datos.list[0].temp.morn);
        bg_class = 'bg-morning';
    } else if (hora_actual > 9 && hora_actual <= 13) {
        temp_actual = parseInt(datos.list[0].temp.day);
        bg_class = 'bg-day';
    } else if (hora_actual > 13 && hora_actual <= 19) {
        temp_actual = parseInt(datos.list[0].temp.eve);
        bg_class = 'bg-evening';
    } else if (hora_actual > 19 && hora_actual <= 23) {
        temp_actual = parseInt(datos.list[0].temp.night);
        bg_class = 'bg-night';
    }

    $('#weather_temp').html(temp_actual + " ºC");

    $("#weather_description").html(datos.list[0].weather[0].description);

    $("#weather_city").html(datos.city.name);

    $("#weather_temp_max_actual").html(parseInt(datos.list[0].temp.max) + "ºC");
    $("#weather_temp_min_actual").html(parseInt(datos.list[0].temp.min) + "ºC");
    $("#weather_humidity_actual").html(datos.list[0].humidity + "%");
    $("#weather_clouds_actual").html(datos.list[0].clouds + "%");


    $("#weather_week").empty();

    var posicion_dia_semana_actual = dias.indexOf(dia_semana_actual);

    for (var i = 1; i < 7; i++) {
        var dia_semana_index = parseInt(posicion_dia_semana_actual + i);
        // Necesitamos el resto de ese numero entre %7 cuando sea 7%7 nos va a dar 0

        // Icono del clima
        var weather_icon_code = datos.list[i].weather[0].icon;
        var weather_icon = getIconWeather(weather_icon_code);

        $('#weather_week').append('\
            <hr><div class="ui-grid-b list-week">\n\
                <div class="ui-block-a">\n\
                    <p class="week-day">\n\
                        <strong>' + dias[dia_semana_index % 7] + '</strong>\n\
                    </p>\n\
                    <p class="week-date">' + parseInt(dia_actual + i) + ' ' + mes_actual.substr(0, 3) + '.</p>\n\
                </div>\n\
                            <div class="ui-block-b week-temperature center">\n\
                        <p><i class="wi wi-direction-up"></i>' + parseInt(datos.list[i].temp.max) + ' / <i class="wi wi-direction-down"></i>' + parseInt(datos.list[i].temp.min) + '</p>\n\
                    </div>\n\
                <div class="ui-block-c center weather-icon"><i class="wi ' + weather_icon + ' week-weather"></i></div>\n\
                </div>');
    }
}

function getIconWeather(weather_icon_code) {
    var weather_icon;

    // Actualizo el ícono del clima de acuerdo al codigo de la api
    switch (weather_icon_code) {
        case "01d":
            weather_icon = "wi-day-sunny";
            break;
        case "02d":
            weather_icon = "wi-day-cloudy";
            break;
        case "03d":
            weather_icon = "wi-cloud";
            break;
        case "04d":
            weather_icon = "wi-cloudy";
            break;
        case "09d":
            weather_icon = "wi-rain";
            break;
        case "10d":
            weather_icon = "wi-day-showers";
            break;
        case "11d":
            weather_icon = "wi-thunderstorm";
            break;
        case "13d":
            weather_icon = "wi-snow";
            break;
        case "50d":
            weather_icon = "wi-day-light-wind";
            break;
        case "50n":
            weather_icon = "wi-windy";
            break;
        case "01n":
            weather_icon = "wi-night-clear";
            break;
        case "02n":
            weather_icon = "wi-night-alt-cloudy";
            break;
        case "03n":
            weather_icon = "wi-night-cloudy";
            break;
        case "04n":
            weather_icon = "wi-night-cloudy";
            break;
        case "09n":
            weather_icon = "wi-night-rain-wind";
            break;
        case "10n":
            weather_icon = "wi-night-alt-rain";
            break;
        case "11n":
            weather_icon = "wi-night-lightning";
            break;
        case "13n":
            weather_icon = "wi-night-snow";
            break;
    }
    return weather_icon;
}