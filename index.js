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
			total: 10
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

async function crabAttackRoll(){
	const ConMod = actor.abilities.con.mod;
	const Prof = (actor.attributes.spellDC.value - 10 - ConMod);
	let roll = (typeof Roll === "function") ? await new Roll("1d20").roll() : await new TestRoll("1d20").roll();
	let attack_results_html = ``;

	if (roll.total === 1) {
		attack_results_html = `<h2>Attack Roll</h2><h3 style='color:red'>Natural 1!</h3>MAP 0: <strong style='color:red'>${roll.total + ConMod + Prof}</strong> (${roll.total} + ${ConMod} + ${Prof})<br>MAP -5: <strong style='color:red'>${roll.total + ConMod + Prof - 5}</strong> (${roll.total} + ${ConMod} + ${Prof} - 5)<br>MAP -10: <strong style='color:red'>${roll.total + ConMod + Prof - 10}</strong> (${roll.total} + ${ConMod} + ${Prof} - 10)`;
	} else if (roll.total === 20) {
		attack_results_html = `<h2>Attack Roll</h2><h3 style='color:green'>Natural 20!</h3>MAP 0: <strong style='color:green'>${roll.total + ConMod + Prof}</strong> (${roll.total} + ${ConMod} + ${Prof})<br>MAP -5: <strong style='color:green'>${roll.total + ConMod + Prof - 5}</strong> (${roll.total} + ${ConMod} + ${Prof} - 5)<br>MAP -10: <strong style='color:green'>${roll.total + ConMod + Prof - 10}</strong> (${roll.total} + ${ConMod} + ${Prof} - 10)`;
	} else {
		attack_results_html = `<h2>Attack Roll</h2>MAP 0: <strong>${roll.total + ConMod + Prof}</strong> (${roll.total} + ${ConMod} + ${Prof})<br>MAP -5: <strong>${roll.total + ConMod + Prof - 5}</strong> (${roll.total} + ${ConMod} + ${Prof} - 5)<br>MAP -10: <strong>${roll.total + ConMod + Prof - 10}</strong> (${roll.total} + ${ConMod} + ${Prof} - 10)`;
	}

	let damage_foreward_html = `<h3>Damage</h3>Damage Types:Bludgeoning, Cold, Piercing, Slashing, or Vitality<br> Melee Traits: Agile, Backswing, Forceful, Reach, or Sweep <br>Ranged Traits: Range Increment 100 & Volley 30 ft, Range Increment 50 & Propulsive, Range Increment 20 & Thrown<br>`;
	let dieCount = 0;

	if (actor.level < 5) {
		dieCount = 1;
	} else if (actor.level < 9) {
		dieCount = 2;
	} else if (actor.level < 13) {
		dieCount = 3;
	} else if (actor.level < 17) {
		dieCount = 4;
	} else {
		dieCount = 5;
	}

	let damageRoll = (typeof Roll === "function") ? await new Roll(`${dieCount}d8`).roll() : await new TestRoll(`${dieCount}d8`).roll();
	let damage_results_html = `<br>
	<h4>1 Action</h4>
	Melee:  ${damageRoll.total+actor.abilities.str.mod} (Crit: ${2*(damageRoll.total+actor.abilities.str.mod)})
	<br>
	Ranged: ${damageRoll.total} (Crit: ${2*(damageRoll.total)})
	<h4>2 Actions</h4>
	Melee:  ${damageRoll.total+actor.abilities.str.mod+actor.abilities.con.mod} (Crit: ${2*(damageRoll.total+actor.abilities.str.mod+actor.abilities.con.mod)})
	<br>
	Ranged: ${damageRoll.total+actor.abilities.con.mod} (Crit: ${2*(damageRoll.total+actor.abilities.con.mod)})`;
	

	if(typeof ChatMessage === "function"){
		ChatMessage.create({
			user: game.user._id,
			speaker: ChatMessage.getSpeaker({token: actor}),
			content: attack_results_html + damage_foreward_html + damage_results_html
		});
	}else{
		TestChatMessage.create({
			user: game.user._id,
			speaker: TestChatMessage.getSpeaker({token: actor}),
			content: attack_results_html + damage_foreward_html + damage_results_html
		});
	}
}

crabAttackRoll();