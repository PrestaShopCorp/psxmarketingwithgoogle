import {Chart, TooltipModel} from 'chart.js';

const getOrCreateTooltip = (chart: Chart) => {
  let tooltipEl: HTMLDivElement|null = chart.canvas.parentNode?.querySelector('div');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.style.background = '#FFFFFF';
    tooltipEl.style.borderRadius = '0';
    tooltipEl.style.color = 'rgb(29, 29, 27)';
    tooltipEl.style.opacity = '1';
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.transform = 'translate(-50%, 0)';
    tooltipEl.style.transition = 'all .1s ease';
    tooltipEl.style.filter = 'drop-shadow(0px 1px 3px rgba(120, 120, 120, 0.25))';

    const table = document.createElement('table');
    table.style.margin = '0px';

    tooltipEl.appendChild(table);
    chart.canvas.parentNode?.appendChild(tooltipEl);
  }

  return tooltipEl;
};

export const externalTooltipHandler = (context: { chart: Chart; tooltip: TooltipModel<'line'> }): void => {
  // Tooltip Element
  const {chart, tooltip} = context;
  const tooltipEl = getOrCreateTooltip(chart);

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map((b) => b.lines);

    const tableHead = document.createElement('thead');

    titleLines.forEach((title) => {
      const tr = document.createElement('tr');
      tr.style.borderWidth = 0;

      const th = document.createElement('th');
      th.style.borderWidth = 0;
      const text = document.createTextNode(title);

      th.appendChild(text);
      tr.appendChild(th);
      tableHead.appendChild(tr);
    });

    const tableBody = document.createElement('tbody');
    bodyLines.forEach((body: string, i) => {
      const [labelText, valueText] = body[0].split('~');
      const colors = tooltip.labelColors[i];

      const icon = document.createElement('span');
      icon.style.background = colors.backgroundColor;
      icon.style.borderColor = colors.borderColor;
      icon.style.borderWidth = '2px';
      icon.style.marginRight = '10px';
      icon.style.height = '10px';
      icon.style.width = '10px';
      icon.style.display = 'inline-block';

      const dataValue = document.createElement('span');
      dataValue.textContent = valueText;
      dataValue.classList.add('ml-auto');
      dataValue.classList.add('pl-4');

      const tr = document.createElement('tr');
      tr.style.backgroundColor = 'inherit';
      tr.style.borderWidth = 0;

      const td = document.createElement('td');
      td.style.borderWidth = 0;
      td.style.display = 'block';
      td.classList.add('d-flex');
      td.classList.add('flex-nowrap');
      td.classList.add('align-items-center');

      const dataLabel = document.createTextNode(labelText);

      td.appendChild(icon);
      td.appendChild(dataLabel);
      td.appendChild(dataValue);
      tr.appendChild(td);
      tableBody.appendChild(tr);
    });

    const tableRoot = tooltipEl.querySelector('table');

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove();
    }

    // Add new children
    tableRoot.appendChild(tableHead);
    tableRoot.appendChild(tableBody);
  }

  const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = `${positionX + tooltip.caretX}px`;
  tooltipEl.style.top = `${positionY + tooltip.caretY}px`;
  tooltipEl.style.font = tooltip.options.bodyFont.string;
  tooltipEl.style.padding = `${tooltip.options.padding}px ${tooltip.options.padding}px`;
};

export default {
  externalTooltipHandler,
};
