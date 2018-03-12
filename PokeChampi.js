const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

var prefix = "!";
var pokemonid = fs.readFileSync("pokemong1.txt", "utf-8").split("\r\n");
var pokemonxp = fs.readFileSync("xpg1.txt", "utf-8").split("\r\n");
var lvlup = fs.readFileSync("lvl.txt", "utf-8").split("\r\n");
var evolution = fs.readFileSync("evolg1.txt", "utf-8").split("\r\n");

client.on('ready', () => {
  console.log('Bot ready');
  console.log('Logged as ' + client.user.username)
  console.log('ID : ' + client.user.id)
  console.log('-----------')
});

client.on('message', message => {
  if (!message.guild) return;
  if (message.author.bot) return;

  var aID = message.author.id;

  if (fs.existsSync(aID)) {
    /*try {*/
      var main = fs.readFileSync(aID+"/settings.txt", "utf-8");
      console.log(main)
      var pokemons = fs.readFileSync(aID+"/pokemons.txt", "utf-8").split("\r\n");
      pokemons.pop();
      var mainID = pokemons[main].split(" ")[0];
      var mainLV = parseInt(pokemons[main].split(" ")[1]);
      var mainXP = parseFloat(pokemons[main].split(" ")[2]);
      var multi = parseFloat(pokemonxp[mainID-1]);
      //console.log(mainID)
      //console.log(mainXP)
      //console.log(multi)
      var xp = 20*multi+mainXP;
      //console.log(xp)
      while (xp >= lvlup[mainLV-1]) {
        xp = xp-lvlup[mainLV-1];
        mainLV += 1;
        message.reply("Ton pokémon "+pokemonid[mainID-1]+" est passé au niveau "+mainLV+".");
        if (evolution[mainID-1].startsWith(mainLV+" ")) {
          var newID = evolution[mainID-1].substring(evolution[mainID-1].indexOf(" ")+1);
          message.reply("Ton pokémon "+pokemonid[mainID-1]+" a évolué en "+pokemonid[newID-1]+".");
          mainID = newID;
        }
      }
      pokemons[main] = mainID+" "+mainLV+" "+xp;
      fs.writeFileSync(aID+"/pokemons.txt", pokemons.join("\r\n")+"\r\n");
    /*} catch (error) {
      console.log("Erreur : Xp on message ==> "+error)
    }*/
  }

  if (!message.content.startsWith(prefix)) return;
  var args = message.content.substring(prefix.length).toLowerCase().split(" ");

  switch (args[0].toLowerCase()) {
    case "start":
      message.reply("Choisis ton starter parmis : Carapuce, Bulbizarre, Salamèche");
      message.channel.send("utilise !pick <le nom de ton starter>");
      break;
    
    case "pick":
      if (!args[1]) return;
      if (fs.existsSync(aID)) return;
      if (args[1] == "bulbizarre") {
        fs.mkdirSync(aID);
        fs.appendFileSync(aID+"/pokemons.txt", "1 5 0\r\n");
        fs.appendFileSync(aID+"/settings.txt", "0");
        message.reply("Tu as obtenu ton premier pokémon, un Bulbizarre");
        console.log(message.member.displayName+" a commençé l'aventure avec Bulbizarre (ID:1)")
      }
      if (args[1] == "salamèche") {
        fs.mkdirSync(aID);
        fs.appendFileSync(aID+"/pokemons.txt", "4 5 0\r\n");
        fs.appendFileSync(aID+"/settings.txt", "0");
        message.reply("Tu as obtenu ton premier pokémon, un Salamèche");
        console.log(message.member.displayName+" a commençé l'aventure avec Salamèche (ID:4)")
      }
      if (args[1] == "carapuce") {
        fs.mkdirSync(aID);
        fs.appendFileSync(aID+"/pokemons.txt", "7 5 0\r\n");
        fs.appendFileSync(aID+"/settings.txt", "0");
        message.reply("Tu as obtenu ton premier pokémon, un Carapuce");
        console.log(message.member.displayName+" a commençé l'aventure avec Carapuce (ID:7)")
      }
      break

    case "help":
      message.channel.send("```!start : commence l'aventure\n!pokemons : affiche la liste de tes pokémons\n!select <numéro> : choisis ton main```");

  }
  if (!fs.existsSync(aID)) return; 
  switch (args[0].toLowerCase()) {

    case "pokemons":
      try {
        var pokemons = fs.readFileSync(aID+"/pokemons.txt", "utf-8").split("\r\n");
        pokemons.pop()
        pokemons.forEach(function(pokemon, index) {
          var pokemon = pokemon.split(" ");
          var id = pokemon[0]
          var lvl = pokemon[1]
          message.channel.send("**__"+(index+1)+":__ "+pokemonid[id-1]+"**, niveau **"+lvl+"**");
        });
      } catch (error) {
        console.log("Erreur : Liste des pokémons ==> "+error)
      }
      break;

    case "give":
      try {
        if (!args[2]) return;
        if (aID != "268813812281376769") return;
        var tID = message.mentions.users.first().id;
        if (!fs.existsSync(tID)) return;
        if (args[2] > pokemonid.length) return;
        fs.appendFileSync(tID+"/pokemons.txt", args[2]+" 1 0\r\n");
        message.channel.send("Vous avez donné un "+pokemonid[args[2]-1]+" à "+args[1]+".");
      } catch (error) {
        console.log("Erreur : Distribution de pokémons ==> "+error)
      }
      break;

    case "select":
      try {
        if (!args[1]) return;
        var pokemons = fs.readFileSync(aID+"/pokemons.txt", "utf-8").split("\r\n");
        pokemons.pop()
        if (args[1]>pokemons.length) return;
        if (args[1]<=0) return;
        var pokemon = pokemons[args[1]-1].split(" ");
        var id = pokemon[0];
        var name = pokemonid[id-1];
        fs.writeFileSync(aID+"/settings.txt", args[1]-1);
        message.reply("Votre pokémon n°"+args[1]+", "+name+" a été séléctionné comme pokémon actif");
      } catch (error) {
        console.log("Erreur : Selection du main ==> "+error)
      }
      break;
  }

});

client.login('NDIyMzc5ODA1NzgzMzU5NDg4.DYa7YQ.9Noe2cQVvvvd5MDFj-eTOsgAoBs');