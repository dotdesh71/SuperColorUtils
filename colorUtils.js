// SuperColorUtils Library

var SuperColorUtils = (function () {
  // Private helper function to ensure the RGB values are within the valid range [0, 255]
  function clamp(value) {
    return Math.min(255, Math.max(0, value));
  }

  // Private helper function to convert an RGB object to a CSS color string
  function rgbToCssString(rgb) {
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }

  // Public API
  return {
    // Convert HEX color to RGB
    hexToRgb: function (hex) {
      hex = hex.replace(/^#/, '');
      var bigint = parseInt(hex, 16);
      var r = (bigint >> 16) & 255;
      var g = (bigint >> 8) & 255;
      var b = bigint & 255;
      return { r: r, g: g, b: b };
    },

    // Convert RGB color to HEX
    rgbToHex: function (r, g, b) {
      r = clamp(r);
      g = clamp(g);
      b = clamp(b);
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },

    // Generate a random HEX color
    randomHexColor: function () {
      var randomColor = Math.floor(Math.random() * 16777215).toString(16);
      return '#' + randomColor;
    },

    // Darken a HEX color by a specified percentage
    darkenHexColor: function (hex, percentage) {
      var rgb = this.hexToRgb(hex);
      var factor = 1 - percentage / 100;
      rgb.r = Math.round(rgb.r * factor);
      rgb.g = Math.round(rgb.g * factor);
      rgb.b = Math.round(rgb.b * factor);
      return this.rgbToHex(rgb.r, rgb.g, rgb.b);
    },

    // Lighten a HEX color by a specified percentage
    lightenHexColor: function (hex, percentage) {
      var rgb = this.hexToRgb(hex);
      var factor = 1 + percentage / 100;
      rgb.r = Math.round(clamp(rgb.r * factor));
      rgb.g = Math.round(clamp(rgb.g * factor));
      rgb.b = Math.round(clamp(rgb.b * factor));
      return this.rgbToHex(rgb.r, rgb.g, rgb.b);
    },

    // Blend two HEX colors with a specified weight
    blendHexColors: function (hex1, hex2, weight) {
      var rgb1 = this.hexToRgb(hex1);
      var rgb2 = this.hexToRgb(hex2);
      var blendedRgb = {
        r: Math.round((1 - weight) * rgb1.r + weight * rgb2.r),
        g: Math.round((1 - weight) * rgb1.g + weight * rgb2.g),
        b: Math.round((1 - weight) * rgb1.b + weight * rgb2.b),
      };
      return this.rgbToHex(blendedRgb.r, blendedRgb.g, blendedRgb.b);
    },

    // Invert a HEX color
    invertHexColor: function (hex) {
      var rgb = this.hexToRgb(hex);
      rgb.r = 255 - rgb.r;
      rgb.g = 255 - rgb.g;
      rgb.b = 255 - rgb.b;
      return this.rgbToHex(rgb.r, rgb.g, rgb.b);
    },

    // Generate a gradient between two HEX colors
    generateGradient: function (hex1, hex2, steps) {
      var gradient = [];
      for (var i = 0; i <= steps; i++) {
        var weight = i / steps;
        var blendedColor = this.blendHexColors(hex1, hex2, weight);
        gradient.push(blendedColor);
      }
      return gradient;
    },

    // Convert HEX color to HSL
    hexToHsl: function (hex) {
      var rgb = this.hexToRgb(hex);
      var r = rgb.r / 255;
      var g = rgb.g / 255;
      var b = rgb.b / 255;

      var max = Math.max(r, g, b);
      var min = Math.min(r, g, b);

      var h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0; // achromatic
      } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
      }

      return { h: h, s: s, l: l };
    },

    // Convert HSL color to HEX
    hslToHex: function (h, s, l) {
      var r, g, b;

      if (s === 0) {
        r = g = b = l; // achromatic
      } else {
        var hue2rgb = function (p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }

      return this.rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
    },

    // Generate a monochromatic color scheme from a base color
    generateMonochromaticScheme: function (baseHexColor, numColors) {
      var hslBaseColor = this.hexToHsl(baseHexColor);
      var scheme = [];

      for (var i = 0; i < numColors; i++) {
        var modifiedHSL = { ...hslBaseColor };
        modifiedHSL.l = (modifiedHSL.l + (i / numColors)) % 1; // Adjust lightness
        scheme.push(this.hslToHex(modifiedHSL.h, modifiedHSL.s, modifiedHSL.l));
      }

      return scheme;
    },

    // Generate a complementary color from a base color
    generateComplementaryColor: function (baseHexColor) {
      var hslBaseColor = this.hexToHsl(baseHexColor);
      var complementaryHSL = { ...hslBaseColor };
      complementaryHSL.h = (complementaryHSL.h + 0.5) % 1; // Adjust hue
      return this.hslToHex(complementaryHSL.h, complementaryHSL.s, complementaryHSL.l);
    },
  };
})();

// Example usage:

// Original color
var hexColor = '#3498db';
console.log('Original HEX Color:', hexColor);

// Convert HEX to RGB
var rgbColor = SuperColorUtils.hexToRgb(hexColor);
console.log('RGB Color:', rgbColor);

// Darken the color by 20%
var darkenedHexColor = SuperColorUtils.darkenHexColor(hexColor, 20);
console.log('Darkened HEX Color (20%):', darkenedHexColor);

// Lighten the color by 30%
var lightenedHexColor = SuperColorUtils.lightenHexColor(hexColor, 30);
console.log('Lightened HEX Color (30%):', lightenedHexColor);

// Generate a random HEX color
var randomColor = SuperColorUtils.randomHexColor();
console.log('Random HEX Color:', randomColor);

// Blend two HEX colors with a 70-30 weight
var hexColor2 = '#e74c3c';
var blendedColor = SuperColorUtils.blendHexColors(hexColor, hexColor2, 70);
console.log('Blended HEX Color:', blendedColor);

// Invert the color
var invertedColor = SuperColorUtils.invertHexColor(hexColor);
console.log('Inverted HEX Color:', invertedColor);

// Generate a gradient between two HEX colors
var gradientColors = SuperColorUtils.generateGradient(hexColor, hexColor2, 5);
console.log('Gradient Colors:', gradientColors);

// Convert HEX color to HSL
var hslColor = SuperColorUtils.hexToHsl(hexColor);
console.log('HSL Color:', hslColor);

// Convert HSL color to HEX
var convertedHexColor = SuperColorUtils.hslToHex(hslColor.h, hslColor.s, hslColor.l);
console.log('Converted HEX Color:', convertedHexColor);

// Generate a monochromatic color scheme
var monochromaticScheme = SuperColorUtils.generateMonochromaticScheme(hexColor, 5);
console.log('Monochromatic Color Scheme:', monochromaticScheme);

// Generate a complementary color
var complementaryColor = SuperColorUtils.generateComplementaryColor(hexColor);
console.log('Complementary Color:', complementaryColor);
