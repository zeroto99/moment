window.onload = function() {
	/* greeting */
	const loginForm = document.querySelector("#login-form");
	const loginInput = document.querySelector("#login-form input");
	const greeting = document.querySelector("#greeting");

	/* to do 여기서도 필요해서 위로 미리 올림 */
	const todoForm = document.getElementById('todo-form');
	const todoInput = todoForm.querySelector("input");
	const todoList = document.getElementById('todo-list');

	const HIDDEN_CLASSNAME = "hidden";
	const USERNAME_KEY = "username";

	function onLoginSubmit(event) {
		event.preventDefault();
		loginForm.classList.add(HIDDEN_CLASSNAME);
		const username = loginInput.value;
		localStorage.setItem(USERNAME_KEY, username)
		console.log(username);
		paintGreetings(username);
	}

	function handleLinkClick(event) {
		event.preventDefault();
		console.dir(event);
		alert('hi');
	}

	function paintGreetings (username) {
		greeting.innerText = "Hello, " + username;
		greeting.classList.remove(HIDDEN_CLASSNAME);
		todoForm.classList.remove(HIDDEN_CLASSNAME);
		todoList.classList.remove(HIDDEN_CLASSNAME);
	}

	const savedUsername = localStorage.getItem(USERNAME_KEY);
	//console.log(savedUsername);

	if(savedUsername === null) {
		loginForm.classList.remove(HIDDEN_CLASSNAME);
		loginForm.addEventListener("submit", onLoginSubmit);
	} else {
		paintGreetings(savedUsername);
	}

	/* clock */
	const clock = document.querySelector("#clock");

	function getClock() {
		const date = new Date();
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		const seconds = String(date.getSeconds()).padStart(2, "0");
		clock.innerText = hours + ":" + minutes + ":" + seconds;
	}

	getClock()
	setInterval(getClock, 1000);

	/* quote */
	const quotes = [
		{
			quote: "The unexamined life is not worth living.",
			author: "Socrates"
		},
		{
			quote: "Well done is better than well said.",
			author: "Benjamin Franklin"
		},
		{
			quote: "He who can, does. He who cannot, teaches.",
			author: "George Bernard Shaw"
		},
		{
			quote: "What is a friend? A single soul dwelling in two bodies.",
			author: "Aristotle"
		},
		{
			quote: "Regret for wasted time is more wasted time.",
			author: "Mason Cooley"
		},
		{
			quote: "Never bend your head. Hold it high. Look the world straight in the eye.",
			author: "Helen Keller"
		},
		{
			quote: "Failure is defined by our reaction to it.",
			author: "Oprah Winfrey"
		},
		{
			quote: "Always do what you are afraid to do.",
			author: "Ralph Waldo Emerson"
		},
		{
			quote: "The most courageous act is still to think for yourself. Aloud.",
			author: "Gabriel Coco Chanel"
		},
		{
			quote: "Success has nothing to do with perfection.",
			author: "Michelle Obama"
		},
	];

	const quote = document.querySelector("#quote p:first-child");
	const author = document.querySelector("#quote p:last-child");
	
	const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

	quote.innerText = `"${randomQuote.quote}"`;
	author.innerText = randomQuote.author;

	/* random background image */
	const images = ["01.jpg", "02.jpg", "03.jpg","04.jpg", "05.jpg", "06.jpg", "07.jpg", "08.jpg", "09.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg"]

	const randomImage = images[Math.floor(Math.random() * images.length)];

	const bgImage = document.createElement("img");
	bgImage.src = "img/" + randomImage;
	//console.log(bgImage);

	document.body.appendChild(bgImage);

	/* to do */
	const TODOARRAY_KEY = "todoArray";

	let todoArray = [];

	function saveTodo() {
		localStorage.setItem(TODOARRAY_KEY, JSON.stringify(todoArray));
	}

	function deleteToDo(event) {
		//console.dir(event.target.parentElement.localName);
		const parent = event.target.parentElement;
		//console.log(parent);
		if(event.target.parentElement.localName == "li") {
			parent.remove();
			todoArray = todoArray.filter(toDo => toDo.id !== parseInt(parent.id));
		} else {
			parent.parentElement.remove();
			console.log(parent.parentElement);
			todoArray = todoArray.filter(toDo => toDo.id !== parseInt(parent.parentElement.id));
		}		
		saveTodo()
	}

	function paintToDo(newTodo) {
		const li = document.createElement("li");
		li.id = newTodo.id;
		const span = document.createElement("span");
		span.innerText = newTodo.text;
		const btn = document.createElement("button");
		btn.innerHTML = '<i class="far fa-trash-alt"></i>';
		btn.addEventListener("click", deleteToDo);
		li.appendChild(span);
		li.appendChild(btn);
		todoList.appendChild(li);
	}

	function handleToDoSubmit(event) {
		event.preventDefault();
		const newTodo = todoInput.value;
		todoInput.value = "";
		const newTodoObj = {
			text: newTodo,
			id: Date.now(),
		};
		todoArray.push(newTodoObj);
		paintToDo(newTodoObj);
		saveTodo();
	}

	todoForm.addEventListener("submit", handleToDoSubmit);

	const savedToDos = localStorage.getItem(TODOARRAY_KEY);
	//console.log(savedToDos);

	if(savedToDos !== null) {
		const parsedToDos = JSON.parse(savedToDos);
		todoArray = parsedToDos;
		parsedToDos.forEach(paintToDo);
	}

	/* weather */
	const API_KEY = "680a9ede4db0fbae4964f4f2a758ad8a";

	function onGeoOk(position) {
		const lat = position.coords.latitude;
		const lon = position.coords.longitude;
		//console.log(lat, lon);
		const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
		fetch(url)
			.then(response => response.json())
			.then(data => {
				const weather = document.querySelector("#weather span:first-child");
				const city = document.querySelector("#weather span:last-child");
				city.innerText = data.name
				weather.innerText = `${data.weather[0].main} / ${data.main.temp}°`;
			});
	}
	function onGeoError() {
		alert("위치를 찾지 못했습니다. 날씨를 제공하지 못합니다.")
	}

	navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);


}
