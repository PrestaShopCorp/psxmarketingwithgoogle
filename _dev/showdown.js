import showdown from "showdown";

/**
 * Showdown Extension to allow target attribute on links in MD
 * Extension found on showdown github repository:
 * https://github.com/showdownjs/showdown/issues/222#issuecomment-234141081
 */
showdown.extension("targetlink", function () {
  return [
    {
      type: "lang",
      regex: /\[((?:\[[^\]]*]|[^\[\]])*)]\([ \t]*<?(.*?(?:\(.*?\).*?)?)>?[ \t]*((['"])(.*?)\4[ \t]*)?\)\{\:target=(["'])(.*?)\6}/g,
      replace: function (wholematch, linkText, url, a, b, title, c, target) {
        var result = '<a href="' + url + '"';

        if (typeof title != "undefined" && title !== "" && title !== null) {
          title = title.replace(/"/g, "&quot;");
          title = showdown.helper.escapeCharacters(title, "*_", false);
          result += ' title="' + title + '"';
        }

        if (typeof target != "undefined" && target !== "" && target !== null) {
          result += ' target="' + target + '"';
        }

        result += ">" + linkText + "</a>";
        return result;
      },
    },
  ];
});
