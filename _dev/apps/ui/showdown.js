/* eslint-disable */
import showdown from 'showdown';

/**
 * Showdown Extension to allow target and class attributes on links in MD
 */

showdown.extension('extended-link', () => [
  {
    type: 'lang',
    regex: /\[(.+?)\]\((.+?)\)\[:(?:(target)=(?:(?:&quot;|\\")?["']?)(.+?)(?:(?:&quot;|\\")?["']?))?\s*(?:(class)=(?:(?:&quot;|\\")?["']?)(.+?)(?:(?:&quot;|\\")?["']?))?\]/g,
    replace(wholematch, linkText, url, firstAttribute, firstAttributeValue, secondAttribute, secondAttributeValue, ) {
      let title = undefined;

      if (url.indexOf(' ') >= 0) {
        title = url.slice(url.indexOf(' ') + 1).replace(/"/g, '');
        url = url.match(/(.*?)(?=\s)/g)[0];
      }

      let result = `<a href="${url}"`;

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


showdown.extension('extended-b-link', () => [
  {
    type: 'lang',
    regex: /\[(.+?)\]\((.+?)\)\[:(?:(target)=(?:(?:&quot;|\\")?["']?)(.+?)(?:(?:&quot;|\\")?["']?))?\s*(?:(class)=(?:(?:&quot;|\\")?["']?)(.+?)(?:(?:&quot;|\\")?["']?))?\]/g,
    replace(wholematch, linkText, url, firstAttribute, firstAttributeValue, secondAttribute, secondAttributeValue, ) {
      let title = undefined;
      if (url.indexOf(' ') >= 0) {
        title = url.slice(url.indexOf(' ') + 1).replace(/"/g, '');
        url = url.match(/(.*?)(?=\s)/g)[0];
      }

      let result = `<b-link href="${url}"`;

      if (typeof firstAttribute !== 'undefined' && firstAttribute !== '' && firstAttribute !== null) {
        result += ` ${firstAttribute}="${firstAttributeValue}"`;
      }

      if (typeof secondAttribute !== 'undefined' && secondAttribute !== '' && secondAttribute !== null) {
        result += ` ${secondAttribute}="${secondAttributeValue}"`;
      }

      if (typeof title !== 'undefined' && title !== '' && title !== null) {
        result += ` title="${title}"`;
      }

      result += `>${linkText}</b-link>`;

      return result;
    },
  },
]);
