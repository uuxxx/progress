export default `
  .circular-progress {
    --half-size: calc(var(--size) / 2);
    --radius: calc((var(--size) - var(--stroke-width)) / 2);
    --circumference: calc(var(--radius) * 3.14 * 2);
    --dash: calc((var(--progress) * var(--circumference)) / 100);
  }

  .circular-progress circle {
    cx: var(--half-size);
    cy: var(--half-size);
    r: var(--radius);
    stroke-width: var(--stroke-width);
    fill: none;
    stroke-linecap: round;
  }

  .circular-progress circle.bg {
    stroke: var(--bg-color);
  }

  .circular-progress circle.fg {
    -webkit-transform: rotate(-90deg);
    transform: rotate(-90deg);
    -webkit-transform-origin: var(--half-size) var(--half-size);
    -ms-transform-origin: var(--half-size) var(--half-size);
    transform-origin: var(--half-size) var(--half-size);
    stroke-dasharray: var(--dash) calc(var(--circumference) - var(--dash));
    -webkit-transition: stroke-dasharray 0.3s linear 0s;
    -o-transition: stroke-dasharray 0.3s linear 0s;
    transition: stroke-dasharray 0.3s linear 0s;
    stroke: var(--fg-color);
  }

  .animated {
    animation: rotation 3s linear infinite;
  }


  @-webkit-keyframes rotation {
    from {
      -webkit-transform: rotate(-90deg);
      transform: rotate(-90deg);
    }

    to {
      -webkit-transform: rotate(270deg);
      transform: rotate(270deg);
    }
  }

  @keyframes rotation {
    from {
      -webkit-transform: rotate(-90deg);
      transform: rotate(-90deg);
    }

    to {
      -webkit-transform: rotate(270deg);
      transform: rotate(270deg);
    }
  }
`;
