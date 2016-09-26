import controllersMap from 'babel-loader?presets[]=es2015!generate-controllers-loader!./item.json';

document.write("It works.");
document.write('<pre>')
document.write(JSON.stringify(controllersMap));
document.write('</pre>')
console.log("test", controllersMap);

