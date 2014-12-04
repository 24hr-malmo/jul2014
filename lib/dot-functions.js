var fs = require('fs');
var path = require('path');
var marked = require('marked');
var moment = require('moment');
var config = require("../config-manager");

function importContent(content) {

    // Import directly
    var re = /@import\((.+?)\)/g;
    var match = re.exec(content);

    while(match) {

        var importContent = "";
        try {
            var file = match[1];
            if (file.indexOf(".html")) {
                var fileContent = fs.readFileSync(path.join(__dirname, "../public", file), 'utf-8');
                if (fileContent) {
                    importContent = fileContent; 
                }
            }
        } catch (err) {
            console.log("error in dot-functions", err);
        }

        content = content.replace(match[0], importContent);
        match = re.exec(content);
    }

    // Import with require
    var reRequire = /@require\((.+?)\)/g;
    var matchRequire = reRequire.exec(content);

    while(matchRequire) {

        var requireContent = "";
        var file = matchRequire[1];
        requireContent = '<script type="text/javascript">(function() { window.ozzo = window.ozzo || {}; window.ozzo.extraModules = window.ozzo.extraModules || []; window.ozzo.extraModules.push("' + file + '"); })();</script>';

        content = content.replace(matchRequire[0], requireContent);
        matchRequire = reRequire.exec(content);
    }

    return content;

}



module.exports = {

    load: function(file) {
        return fs.readFileSync(config.views + "/" + file);
    },

    markdown: function(content) {
        var markdownContent = "";
        if (content) {
            markdownContent = marked(content);
            markdownContent = importContent(markdownContent);
        }
        return markdownContent;
    },

    renderFirstImageAsBackground: function(images) {
        var html = "";
        if (images && images.length > 0) {
            html = 'style="background-image: url(' + images[0].image + ');"';
        }
        return html;
    },

    renderFirstImage: function(images) {
        var html = "";
        if (images && images.length > 0) {
            html = '<img src="' + images[0].image + '" alt="" />';
        }
        return html;
    },

    image: function(url, alt, style){

        if(isSvgImage(url)){

            // create path on disk
            var svgpath = path.join(__dirname, '../', url);

            var cleansvg = "";
            if (fs.existsSync(svgpath)) {
                var svg = fs.readFileSync(svgpath, "utf8");
                cleansvg = svg.replace(/(<\?xml.*\?>|<!.*>)/g, "");
            } else {
                cleansvg = "[svg file not found: '" + svgpath + "']";
            }
            return cleansvg;
        }

        var img = '<img src="' + url + '" alt="' + alt + '" />';

        return img;

    },

    age: function() {
        var now = moment();
        var then = moment([1974, 3, 11]);
        return now.diff(then, 'years') 
    },

    version: function() {
        return fs.readFileSync(path.join(__dirname, "..", "version.txt"));
    },

    dump: function(data){
        return JSON.stringify(data, null, "");
    },

    scriptsFolder: function() {
        return config.environment == "production" ? "/scripts-production" : "/scripts";
    },

    analytics: function() {
        var script = "<script>";
        script += "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){";
        script += "(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),";
        script += "m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)";
        script += "})(window,document,'script','//www.google-analytics.com/analytics.js','ga');";
        script += "ga('create', '" + config.analytics + "', '1001.io');";
        script += "ga('send', 'pageview');";
        script += "</script>";
        return config.environment == "production" ? script : "";
    }

};

function isSvgImage(url){

    if(url.indexOf(".svg") == (url.length - 4)){
        return true;
    }

    return false
}


