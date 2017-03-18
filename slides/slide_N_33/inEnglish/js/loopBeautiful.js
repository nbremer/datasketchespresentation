
//Small function to loop through different variations of the word beautiful in the text
function loopBeautiful() {
	//Added spaces to words so the total will always be sort of the same, so you don't have jumping texts
	//if it barely fits on 1 line (and sometimes doesn't fit)
	var beauty = [
		{language: "German", word: "schon\u00A0\u00A0\u00A0\u00A0"},
		{language: "Spanish", word: "hermosa\u00A0"},
		{language: "Spanish", word: "hermoso\u00A0"},
		{language: "Spanish", word: "bonito\u00A0\u00A0"},
		{language: "French", word: "beau\u00A0\u00A0\u00A0\u00A0\u00A0"},
		{language: "French", word: "belle\u00A0\u00A0\u00A0\u00A0\u00A0"},
		{language: "Italian", word: "bello\u00A0\u00A0\u00A0\u00A0"},
		{language: "Italian", word: "bella\u00A0\u00A0\u00A0\u00A0"},
		{language: "Japanese", word: "美しい\u00A0\u00A0\u00A0\u00A0"},
		{language: "Dutch", word: "mooi\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"},
		{language: "Polish", word: "piękny\u00A0\u00A0\u00A0"},
		{language: "Polish", word: "piękna\u00A0\u00A0\u00A0"},
		{language: "Portugese", word: "bonito"},
		{language: "Portugese", word: "bonita"},
		{language: "Russian", word: "красивый"},
		{language: "Russian", word: "красивая"},
		{language: "Turkish", word: "güzel\u00A0\u00A0\u00A0"},
	];


	var chosen = 0,
		chosenOld = 0;
		
	//var t = d3.interval(loopBeauty, 4000);
	var loopThroughWords = setInterval(loopBeauty, 4000);

	function loopBeauty() {

		while(chosen === chosenOld) {
			chosen = Math.floor(Math.random()*(beauty.length-1));
		}
		chosenOld = chosen;

		//Change the beautiful word and language
		d3.select("#beautiful-word")
			.transition().duration(500)
			.style("color", "white")
			.on("end", function() {
				d3.select(this)
					.html(beauty[chosen].word)
					.transition().duration(400)
					.style("color", middlegrey);
			});

		d3.select("#beautiful-lang")
			.transition().duration(500)
			.style("color", "white")
			.on("end", function() {
				d3.select(this)
					.text(beauty[chosen].language)
					.transition().duration(400)
					.style("color", middlegrey);
			});

	}//loopBeauty
}//function loopBeautiful
		