var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);

rl.prompt();

rl.on('line', function(line) {
    console.log("입력");
    switch(line.trim()) {
        case 'hello':
            console.log('world!');
            break;
        case "99":
          rl.close();
          break;
        default:
            console.log('Say what? I might have heard `' + line.trim() + '`');
        break;
    }
    rl.prompt();
}).on('close', function() {
    console.log('Have a great day!');
    process.exit(0);
});
