const Discord = require('discord.js');
const { prefix, cssQuestions } = require('./config.json');
const client = new Discord.Client();

const cssQuestionsActivity = {
	'started': false,
	'time': 0,
	'answer': null,
	'currentChannel': null,
};

const possibleAnswers = ['a', 'b', 'c', 'd', 'e'];
let triviaTimer;

client.once('ready', () => {
	console.log('bot running...');
});
function cssTriviaTimer() {
	cssQuestionsActivity.time++;
	if(cssQuestionsActivity.time >= 30) {
		client.channels.get(cssQuestionsActivity.currentChannel).send('TIMES UP.  How disappointing.');
		endCssTrivia();
	}
}
function endCssTrivia() {
	cssQuestionsActivity.started = false;
	cssQuestionsActivity.answer = null;
	cssQuestionsActivity.time = 0;
	cssQuestionsActivity.currentChannel = null;
	clearInterval(triviaTimer);
}

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	if(message.content === prefix) {
		message.channel.send(`Hello ${message.author.username.toLowerCase()}, ready for some css questions?`);
		return;
	}
	const args = message.content.slice(prefix.length).split(' ');
	const command = args[1].toLowerCase();

	if(cssQuestionsActivity.started && possibleAnswers.includes(command)) {
		if(cssQuestionsActivity.answer === command) {
			message.channel.send(`Correct! well done ${message.author.username}.`);
			endCssTrivia();
		}
		else {
			message.channel.send(`WRONG ${message.author.username}.`);
			return ;
		}
	}
	if (command === 'css-questions') {
		if(cssQuestionsActivity.started) {
			return message.channel.send(`We're still playing ${message.author.username}, theres ${30 - cssQuestionsActivity.time} seconds left`);
		}
		const question = Math.floor(Math.random() * cssQuestions.length);
		cssQuestionsActivity.answer = cssQuestions[question].answer;
		cssQuestionsActivity.started = true;
		cssQuestionsActivity.currentChannel = message.channel.id;
		message.channel.send(`CSS Question Time!\n You have 30 seconds to answer. Here is the question\n ${cssQuestions[question].question}`);
		triviaTimer = setInterval(cssTriviaTimer, 1000);
	}
});


client.login(process.env.BOT_TOKEN);
