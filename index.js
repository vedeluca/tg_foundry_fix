if(typeof actor === "undefined"){
	window.actor = {
		abilities: {
			con: {
				mod: 0
			},
			str: {
				mod: 0
			}
		},
		attributes: {
			spellDC: {
				value: 10
			}
		},
		level: 6
	};
}

if(typeof game === "undefined"){
	window.game = {
		user: {
			_id: 0
		}
	};
}

class TestRoll{
	/**
	* @param {string} dice
	*/
	constructor(dice){
		
	}
	
	/**
	* @returns {Object}
	*/
	async roll(){
		return {
			total: Math.floor(Math.random() * 20) + 1
		};
	}
}

class TestChatMessage{
	/**
	* @param {Object} message
	*/
	static create(message){
		document.getElementById("test").innerHTML = message.content;
	}
	
	/**
	* @param {Object} actor
	* @returns {Object}
	*/
	static getSpeaker(actor){
		return {};
	}
}

/**
* @param {number} map
* @param {Object} roll
* @param {number} conMod
* @param {number} prof
* @returns {HTMLElement}
*/
function mapGenerator(map, roll, conMod, prof){
	const mapDiv = document.createElement("div");
	const mapSpanFront = document.createElement("span");
	mapSpanFront.textContent = `MAP ${map}: `;
	const mapStrong = document.createElement("strong");
	mapStrong.textContent = roll.total + conMod + prof + map;
	const mapSpanBack = document.createElement("span");
	const penalty = (map === 0) ? "" : ` ${map}`;
	mapSpanBack.textContent = ` (${roll.total} + ${conMod} + ${prof}${penalty})`;
	mapDiv.appendChild(mapSpanFront);
	mapDiv.appendChild(mapStrong);
	mapDiv.appendChild(mapSpanBack);
	return mapDiv;
}

async function crabAttackRoll(){
	const conMod = actor.abilities.con.mod;
	const prof = (actor.attributes.spellDC.value - 10 - conMod);
	const roll = (typeof Roll === "function") ? await new Roll("1d20").roll() : await new TestRoll("1d20").roll();
	const attackContainer = document.createElement("div");
	
	const attackHeading = document.createElement("h2");
	attackHeading.textContent = "Attack Roll";
	attackContainer.appendChild(attackHeading);
	const critHeading = document.createElement("h3");
	
	attackContainer.appendChild(critHeading);
	attackContainer.appendChild(mapGenerator(0, roll, conMod, prof));
	attackContainer.appendChild(mapGenerator(-5, roll, conMod, prof));
	attackContainer.appendChild(mapGenerator(-10, roll, conMod, prof));
	
	const strongList = attackContainer.getElementsByTagName("strong");
	if (roll.total === 1) {
		critHeading.style.color = "red";
		critHeading.textContent = "Natural 1!";
		for(let strong of strongList)
			strong.style.color = "red";
	} else if (roll.total === 20) {
		critHeading.style.color = "green";
		critHeading.textContent = "Natural 20!";
		for(let strong of strongList)
			strong.style.color = "green";
	}
	
	const damageHeading = document.createElement("h3");
	damageHeading.textContent = "Damage";
	const damageTypesPar = document.createElement("p");
	damageTypesPar.textContent = "Damage Types:Bludgeoning, Cold, Piercing, Slashing, or Vitality";
	const meleeTraitsPar = document.createElement("p");
	meleeTraitsPar.textContent = "Melee Traits: Agile, Backswing, Forceful, Reach, or Sweep";
	const rangedTraitsPar = document.createElement("p");
	rangedTraitsPar.textContent = "Ranged Traits: Range Increment 100 & Volley 30 ft, Range Increment 50 & Propulsive, Range Increment 20 & Thrown";
	
	attackContainer.appendChild(damageHeading);
	attackContainer.appendChild(damageTypesPar);
	attackContainer.appendChild(meleeTraitsPar);
	attackContainer.appendChild(rangedTraitsPar);

	const dieCount = Math.ceil(actor.level / 4);
	const damageRoll = (typeof Roll === "function") ? await new Roll(`${dieCount}d8`).roll() : await new TestRoll(`${dieCount}d8`).roll();
	
	const oneActionHeading = document.createElement("h4");
	oneActionHeading.textContent = "1 Action";
	const oneMeleePar = document.createElement("p");
	oneMeleePar.textContent = `Melee:  ${damageRoll.total + actor.abilities.str.mod} (Crit: ${2 * (damageRoll.total + actor.abilities.str.mod)})`;
	const oneRangedPar = document.createElement("p");
	oneRangedPar.textContent = `Ranged: ${damageRoll.total} (Crit: ${2*(damageRoll.total)})`;
	const twoActionHeading = document.createElement("h4");
	twoActionHeading.textContent = "2 Action";
	const twoMeleePar = document.createElement("p");
	twoMeleePar.textContent = `Melee:  ${damageRoll.total + actor.abilities.str.mod + actor.abilities.con.mod} 
		(Crit: ${2*(damageRoll.total + actor.abilities.str.mod + actor.abilities.con.mod)})`;
	const twoRangedPar = document.createElement("p");
	twoRangedPar.textContent = `Ranged: ${damageRoll.total+actor.abilities.con.mod} (Crit: ${2*(damageRoll.total + actor.abilities.con.mod)})`;
	
	attackContainer.appendChild(oneActionHeading);
	attackContainer.appendChild(oneMeleePar);
	attackContainer.appendChild(oneRangedPar);
	attackContainer.appendChild(twoActionHeading);
	attackContainer.appendChild(twoMeleePar);
	attackContainer.appendChild(twoRangedPar);

	if(typeof ChatMessage === "function"){
		ChatMessage.create({
			user: game.user._id,
			speaker: ChatMessage.getSpeaker({token: actor}),
			content: attackContainer.innerHTML
		});
	}else{
		TestChatMessage.create({
			user: game.user._id,
			speaker: TestChatMessage.getSpeaker({token: actor}),
			content: attackContainer.innerHTML
		});
	}
}

crabAttackRoll();