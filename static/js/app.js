const App = {
	_guestbookList: document.querySelector(".guestbook__list"),
	_template: document.querySelector("#guestbook-template"),
	_form: document.querySelector(".guestbook__form"),
	renderGuestbook() {
		HttpRequest.get("http://localhost:8080/api/guestbook", (response) => {
			console.log(response);
			let text = "";
			response.result.forEach((article) => {
				text += this._template.innerHTML
					.replace("{{name}}", article.name)
					.replace("{{content}}", article.content)
					.replace("{{createAt}}", article.createAt);
			});
			this._guestbookList.innerHTML += text;
		});
	},
	init() {
		this.renderGuestbook();
		this._form.addEventListener("submit", (event) => {
			event.preventDefault();
			HttpRequest.post(
				"http://localhost:8080/api/guestbook",
				(response) => {
					let text = "";
					response.result.forEach((article) => {
						text += this._template.innerHTML
							.replace("{{name}}", article.name)
							.replace("{{content}}", article.content)
							.replace("{{createAt}}", article.createAt);
					});
					this._guestbookList.innerHTML = text;
				},
				{
					name: event.currentTarget.name.value,
					content: event.currentTarget.content.value,
				},
				{
					"Content-Type": "application/json",
				}
			);
		});
	},
};

const HttpRequest = {
	requestAsAjax(url, method, body, header, callback) {
		const xhr = new XMLHttpRequest();
		xhr.addEventListener("loadend", () => {
			if (xhr.status === 200) {
				callback(JSON.parse(xhr.responseText));
			}
		});
		xhr.open(method, url);
		if (header) {
			for (key in header) {
				xhr.setRequestHeader(key, header[key]);
			}
		}
		if (method === "POST" || method === "PUT") {
			xhr.send(JSON.stringify(body));
		} else if (method === "GET" || method === "DELETE") {
			xhr.send();
		}
	},
	get(url, callback, header) {
		this.requestAsAjax(url, "GET", null, header, callback);
	},
	post(url, callback, body, header) {
		this.requestAsAjax(url, "POST", body, header, callback);
	},
};

App.init();
