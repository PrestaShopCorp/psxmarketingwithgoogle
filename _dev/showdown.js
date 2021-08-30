/* eslint-disable */
import showdown from 'showdown';

/**
 * Showdown Extension to allow target and class attributes on links in MD
 */

showdown.extension('extended-link', () => [
  {
    type: 'lang',
    regex: /\[(.+?)\]\((.+?)\)\[:(?:(target)=\\?"(.+?)\\?")?\s*(?:(class)=\\?"(.+?)\\?")?\]/g,
    replace(wholematch, linkText, url, firstAttribute, firstAttributeValue, secondAttribute, secondAttributeValue) {
      let result = `<a href="${url}"`;
      let title = undefined;

      if (/^ *$/.test(linkText)) {
        title = linkText.match(/(?<=\s).*/g)[0];
        linkText = linkText.match(/(.*?)(?=\s)/g)[0];
      }

      if (typeof firstAttribute !== 'undefined' && firstAttribute !== '' && firstAttribute !== null) {
        result += ` ${firstAttribute}="${firstAttributeValue}"`;
      }

      if (typeof secondAttribute !== 'undefined' && secondAttribute !== '' && secondAttribute !== null) {
        result += ` ${secondAttribute}="${secondAttributeValue}"`;
      }

      if (typeof title !== 'undefined' && title !== '' && title !== null) {
        result += ` title="${title}"`;
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
