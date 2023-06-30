var scriptElement = document.createElement("script");
scriptElement.type = "text/javascript";
scriptElement.src = import.meta.url.replace('app.js', 'psxmarketingwithgoogle-ui.js');
scriptElement.type = 'module';
document.head.append(scriptElement);
