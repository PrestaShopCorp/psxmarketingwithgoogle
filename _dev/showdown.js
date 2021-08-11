/* eslint-disable */
import showdown from 'showdown';

/**
 * Showdown Extension to allow target attribute on links in MD
 * Extension found on showdown github repository:
 * https://github.com/showdownjs/showdown/issues/222#issuecomment-234141081
 */
 showdown.extension('targetlink', () => [
  {
    type: 'lang',
    regex: /\[((?:\[[^\]]*]|[^\[\]])*)]\([ \t]*<?(.*?(?:\(.*?\).*?)?)>?[ \t]*((['"])(.*?)\4[ \t]*)?\)\[\:target=((?:&quot;|\\")?["']?)(.*?)\6]/g,
    replace(wholematch, linkText, url, a, b, title, c, target) {
      let result = `<a href="${url}"`;

      if (typeof title !== 'undefined' && title !== '' && title !== null) {
        title = title.replace(/"/g, '&quot;');
        title = showdown.helper.escapeCharacters(title, '*_', false);
        result += ` title="${title}"`;
      }

      if (typeof target !== 'undefined' && target !== '' && target !== null) {
        result += ` target="${target}"`;
      }

      result += `>${linkText}</a>`;
      return result;
    },
  },
]);

showdown.extension('className', () => [
  {
    type: 'lang',
    regex: /\[((?:\[[^\]]*]|[^\[\]])*)]\([ \t]*<?(.*?(?:\(.*?\).*?)?)>?[ \t]*((['"])(.*?)\4[ \t]*)?\)\[\:class=((?:&quot;|\\")?["']?)(.*?)\6]/g,
    replace(wholematch, linkText, url, a, b, title, c, className) {
      let result = `<a href="${url}"`;

      if (typeof className !== 'undefined' && className !== '' && className !== null) {
        result += ` class="${className}"`;
      }

      result += `>${linkText}</a>`;
      return result;
    },
  },
]);

showdown.extension('no-p-tag',  () => [
  {
    type: 'output',
    filter: function (text) {
      // remove paragraphs
      text = text.replace(/<\/?p[^>]*>/g, '');
      return text;
    },
  },
]);
