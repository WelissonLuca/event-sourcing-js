const UserRepository = require("./data/userRepository");
const User = require("./domain/user");
const hash = require("./lib/hasher");

const db = new UserRepository();

function findById(id) {
	const user = db.findById(id);

	if (!user) return null;

	return user;
}

function create(name, email, password) {
	if (findById(hash(email))) throw new Error("User already exists");

	const user = User.create({ name, email, password });

	db.save(user);

	return user;
}

function update(email, name, password) {
	const user = findById(hash(email));

	if (!user) throw new Error("User not found");

	user.update({ name, password });

	db.save(user);

	return user;
}

let Welisson = findById(hash("welissonluca17@gmail.com"));

if (!Welisson)
	Welisson = create("Welisson", "welissonluca17@gmail.com", "123mudar");

console.log(Welisson);

const Luca = Welisson.update({ name: "Luca", password: "123mudar" });

console.log(Luca);
