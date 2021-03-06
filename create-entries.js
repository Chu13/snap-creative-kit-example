var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var Mustache = require("mustache");
const shortid = require('shortid');

try {
  var startTime = Date.now();
  console.log("š    Create (Scrapbook) Entries v1.0.0\n");

  console.log("š    Reading templates...");
  const gridTemplate = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'templates/grid-template.html'), 'utf8'));
  const entryTemplate = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'templates/entry-template.html'), 'utf8'));

  console.log("š    Reading contents...");
  const contents = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'contents.yaml'), 'utf8'));

  if (contents["entries"]) {
    for (entry in contents["entries"]) {
      contents["entries"][entry]["id"] = "z" + shortid.generate();
    }

    console.log("š    Writing index...");
    fs.writeFileSync(path.join(__dirname, 'index.html'), Mustache.render(gridTemplate, contents));

    console.log("š    Writing entries...");
    for (entry in contents["entries"]) {
      fs.writeFileSync(
        path.join(__dirname, encodeURI(contents["entries"][entry]["id"]) + '.html'),
        Mustache.render(entryTemplate, {
          firstName: contents["firstName"],
          ...contents["entries"][entry]
        })
      );
    }
    fs.writeFileSync(path.join(__dirname, 'index.html'), Mustache.render(gridTemplate, contents));
  } else {
    console.log("ā ļø    No entries found!");
  }

  console.log("\nāØ    Done in " + ((Date.now()-startTime) / 1000).toFixed(2) + "s.");
} catch (e) {
  console.log("ā ļø    Encountered an error!");
  console.log(e);
  console.log("\nā¹ļø    Done in " + ((Date.now()-startTime) / 1000).toFixed(2) + "s.");
}
