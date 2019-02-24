const Discord = require('discord.js');
    
            answered = true;
            cAnswer = "";
            userAnswer = "";

            if (answered == false) {
                userAnswer = msg;
                if(userAnswer == cAnswer) {
                    message.reply ("Parabéns!! :hcoin:");
                }
                else {
                    message.reply ("Não foi dessa vez :java:");
                }
                answered = true; cAnswer = ""; userAnswer = "";
            }
    
            if (msg.startsWith(prefix + "quiz")) {
            number = 3;
            var random = Math.floor (Math.random() * (number -1 +1)) + 1;
            switch (random) {
                case 1: message.channel.send ("Qual tag usamos para quebrar linhas usando html5?: /nA ) <P> /nB ) <br> /nC ) <strong> /nD ) <H1>"); cAnswer="b"; break; 
                case 2: message.channel.send ("Em qual tag está presente o corpo do site?: /na ) <body> /nB ) <head> /nC ) <B> /nD ) <i>"); cAnswer="a"; break;
                case 3: message.channel.send ("Em qual ano a primeira publicação HTML foi divlgada?"); cAnswer="1993"; break;
            }
            answered = false;
        
    }        