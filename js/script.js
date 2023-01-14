

// находим поле ввода, кнопку отправка, кнопку геолокация и поле чата
const varInpt = document.querySelector('.j-inpMess');
const varBtnMess = document.querySelector('.j-btnMess');
const varBtnGeo = document.querySelector('.j-btnGeo');
const varChat =  document.querySelector('.j-chat');

//Выводим сообщения в чат
const writeToScreen = (message, pos="flex-start", links=false) => {
    // создаем ссылку или текстовое для вывода на страницу
    if (links) { 
        dives = `<a class="message j-message"  href="${message}" target="_blank"  style="align-self: flex-end">Гео-локация</a>`; 
    }
	  else {  
        dives = `<p class="message j-message" style="align-self: ${pos}">${message}</p> `;
    }
    // добавляем в чат сообщение
	varChat.insertAdjacentHTML("beforeend", dives) ;
    varChat.scrollTop = varChat.scrollHeight;
    
  }

//создаем соединеие с эхо сервром
let websocket = new WebSocket(" wss://echo-ws-service.herokuapp.com"); 
	websocket.onopen = function(evt) {
		console.log("CONNECTED");
	};

	websocket.onmessage = function(evt) {
        // если не геоданные то выводим сообщения эхо сервера в чат
        if (!(evt.data.includes("GeolocationPosition"))) {writeToScreen(evt.data);}
	};
    // выводим в алерт ошибку от сервера
	websocket.onerror = function(evt) {
		alert (`ошибка сервера: ${evt.data}`);
	};
  
  //вешаем обоаботку кнопки отправить
varBtnMess.addEventListener("click", () => {
    // отпрваляем на эхо сервер введенное сообщение и выводим в чат введенное сообщение
	websocket.send(varInpt.value);
    writeToScreen(varInpt.value, "flex-end");
	varInpt.value = '' ;
  });

  
  //гео-локация.
  // Функция,  об ошибке
const error = () => {
    alert("Не удалось получить данные о Вашем местонахождении")
    };
  // Функция, срабатывающая при успешном получении геолокации
const success = (position) => {
    // отпрваляем на эхо сервер геоданные
    websocket.send(position);
	let latitude  = position.coords.latitude;
	let longitude = position.coords.longitude;
    // готовим ссылку на опенстрит с координатами
	let geoLink = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
	writeToScreen(geoLink ,"flex-end", true );
    };
  //вешаем обоаботку кнопки геолокация
varBtnGeo.addEventListener("click", () => {
	if (!navigator.geolocation) {
	  alert("Геолкация не поддерживается браузером");
	} else {
	  navigator.geolocation.getCurrentPosition(success, error);
	}
});

