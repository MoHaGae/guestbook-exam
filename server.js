const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const connection = mysql.createConnection({
	host: "db host",
	user: "db username",
	password: "db password",
	database: "db database",
});

connection.connect();

const app = express();
const PORT = 8080;

app.use(bodyParser.json());
app.use("/static", express.static("static"));

app.get("/", (req, res) => {
	res.send("test");
});

app.get("/api/guestbook", (req, res) => {
	connection.query("SELECT * FROM guestbook", (err, result) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ isSuccess: false });
		}
		console.log(result);
		res.json({ isSuccess: true, result });
	});
});

app.post("/api/guestbook", (req, res) => {
	const { name, content } = req.body;
	console.log(name, content);
	// validation
	if (!name || !content) {
		return res.status(400).json({ isSuccess: false, message: "Bad Request" });
	}

	connection.query(
		`INSERT INTO guestbook(name, content) values('${name}', '${content}')`,
		(err, _) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ isSuccess: false });
			}
			connection.query("SELECT * FROM guestbook", (err, result) => {
				if (err) {
					console.error(err);
					return res.status(500).json({ isSuccess: false });
				}
				console.log(result);
				res.json({ isSuccess: true, result });
			});
		}
	);
});

app.listen(PORT, () => {
	console.log(`✅ Server Listen : http://localhost:${PORT}`);
});
