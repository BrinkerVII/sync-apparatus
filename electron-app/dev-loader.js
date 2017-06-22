let timer = null;

window.onload = () => {
	let target = document.getElementById("target");

	timer = setInterval(() => {
		let image = document.createElement("img");
		image.src = "http://localhost:4200/assets/pixel.png";
		image.onload = (event) => {
			window.location = "http://localhost:4200";
			clearInterval(timer);
		};
		target.appendChild(image);
	}, 200);
}
