
const lang = BJSpell('https://rawcdn.githack.com/maheshmurag/bjspell/master/dictionary.js/en_US.js', function() {
	enterButton.disabled = false;
});
  

let wordsUsed = new Trie();

const inputBox = document.querySelector("#user-input");
const enterButton = document.querySelector("#submit-button");
const themeToggle = document.querySelector("#theme-toggle")
const messageDisplay = document.querySelector("#message-display");
const recentWords = document.querySelector("#recent-words");
const scoreDisplay = document.querySelector("#score-display");
const highscoreDisplay = document.querySelector("#highscore");

let score = 0;

var storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
if (storedTheme) {
    document.documentElement.setAttribute('data-theme', storedTheme);
}

if (localStorage.getItem('highscore')) {
	highscoreDisplay.textContent = localStorage.getItem('highscore');
}

enterButton.addEventListener("click", handleInput);
inputBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { handleInput() }
});
themeToggle.addEventListener("click", switchTheme);

function switchTheme() {
	var currentTheme = document.documentElement.getAttribute("data-theme");
    var targetTheme = "light";

    if (currentTheme === "light") {
        targetTheme = "dark";
    }

    document.documentElement.setAttribute('data-theme', targetTheme)
    localStorage.setItem('theme', targetTheme);
}

function handleInput() {
	const input = inputBox.value.toLowerCase();
	clearInputField();

	if (isValidWord(input)) {
		const word = input;
		
		if (wordsUsed.contains(word)) {
			sendMessage("Duple! That was a great run. Try again!");
			updateHighScore();
			score = 0;
			clearRecents();
			wordsUsed = new Trie();
		}
		else if (lang.check(word)) {
			wordsUsed.insert(word);
			sendMessage("Woah, nice word!");
			const pointsEarned = word.length;
			updateRecents(word);
			updateScore(pointsEarned);
		}
		else {
			const suggestion = lang.suggest(word,1);

			if (suggestion.length == 0) {
				sendMessage("I have no clue what that word is.")
			}
			else {
				sendMessage(`Typo! Did you mean: ${suggestion}?`);
			}
		}
	} 
	else {
		if (input.length > 16) {
			sendMessage('That\'s too long');
		}
		else {
			sendMessage("That's not even a word man.");
		}
	}

	function clearRecents() {
		recentWords.replaceChildren();
	}

	function updateRecents(word) {
		const newWord = document.createElement("p");
		newWord.textContent = word;

		if (recentWords.children.length == 2) {
			let lastChild = recentWords.children[1];
			recentWords.removeChild(lastChild);
		}
		recentWords.prepend(newWord);
	}

	function isValidWord(input) {
		let res = true;

		if (input === "") {
			res = false;
		}

		else if (input.length > 16) {
			res = false;
		}

		else {
			Array.from(input).forEach((char) => {
				const A_ASCII_CODE = 97;
				const Z_ASCII_CODE = 122;
				if (
					!(
						char.charCodeAt(0) >= A_ASCII_CODE &&
						char.charCodeAt(0) <= Z_ASCII_CODE
					)
				) {
					res = false;
				}
			});
		}

		return res;
	}

	function updateHighScore() {
		if (!("highscore" in localStorage)) {
			localStorage.setItem('highscore', score);
			console.log('set high score for the first time.');
		}
		else {
			if (score > localStorage.getItem('highscore')) {
				localStorage.setItem('highscore', score);
				console.log('set new high score.')
			}
		}
		highscoreDisplay.textContent = localStorage.getItem('highscore');
	}

	function updateScore(pointsToAdd) {
		score += pointsToAdd;
		scoreDisplay.textContent = `Score: ${score}`;
	}

	function clearInputField() {
		inputBox.value = "";
	}

	function sendMessage(message) {
		messageDisplay.textContent = message;
	}
}

// Trie data structure implementation
function TrieNode(key) {
	this.key = key;
	this.parent = null;
	this.children = {};
	this.end = false;
	this.getWord = function () {
		let output = [];
		let node = this;

		while (node !== null) {
			output.unshift(node.key);
			node = node.parent;
		}

		return output.join("");
	};
}

function Trie() {
	this.root = new TrieNode(null);

	this.insert = function (word) {
		let node = this.root;

		for (let i = 0; i < word.length; i++) {
			if (!node.children[word[i]]) {
				node.children[word[i]] = new TrieNode(word[i]);
				node.children[word[i]].parent = node;
			}

			node = node.children[word[i]];

			if (i == word.length - 1) {
				node.end = true;
			}
		}
	};

	this.contains = function (word) {
		let node = this.root;

		for (let i = 0; i < word.length; i++) {
			if (node.children[word[i]]) {
				node = node.children[word[i]];
			} else {
				return false;
			}
		}

		return node.end;
	};
}
