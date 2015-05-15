/* @flow */

var invariant = require('invariant');

class LengthType {
  cssUnit: string;

  static PIXEL: LengthType;
  static PERCENTAGE: LengthType;
  static EM: LengthType;
  static AllTypes: Array<LengthType>;

  constructor(cssUnit: string) {
    this.cssUnit = cssUnit;
  }

  toString(): string {
    return this.cssUnit;
  }
}

LengthType.PIXEL = new LengthType('px');
LengthType.PERCENTAGE = new LengthType('%');
LengthType.EM = new LengthType('em');

LengthType.AllTypes = [
  LengthType.PIXEL,
  LengthType.PERCENTAGE,
  LengthType.EM,
];

class Length {
  value: number;
  lengthType: LengthType;

  constructor(value: number, lengthType: LengthType) {
    this.value = value;
    this.lengthType = lengthType;
  }

  multiply(multiplier: number): Length {
    return new Length(this.value * multiplier, this.lengthType);
  }

  add(length: Length): Length {
    if (length.lengthType !== this.lengthType) {
      throw new Error('Length types have to be the same');
    }
    return new Length(this.value + length.value, this.lengthType);
  }

  subtract(length: Length): Length {
    if (length.lengthType !== this.lengthType) {
      throw new Error('Length types have to be the same');
    }
    return new Length(this.value - length.value, this.lengthType);
  }

  toString(): string {
    return this.value.toString() + this.lengthType.toString();
  }

  static px(value: number): Length {
    return new Length(value, LengthType.PIXEL);
  }

  static pct(value: number): Length {
    return new Length(value, LengthType.PERCENTAGE);
  }

  static em(value: number): Length {
    return new Length(value, LengthType.EM);
  }
}

// The outer parent container is always of block container. It makes no sense to
// center within an inline container - the container would just shrink to the
// width of the content.
//
// The inner container is either inline-block or block. If a paragraph of text
// is to be centered, it should be put into an inline-block first.
class Text {
  fontSize: ?Length;
  lines: ?number;
  lineHeight: ?Length;

  constructor(fontSize: ?Length, lines: ?number, lineHeight: ?Length) {
    this.fontSize = fontSize;
    this.lines = lines;
    this.lineHeight = lineHeight;
  }
}

class Content {
  width: ?Length;
  height: ?Length;
  text: ?Text;

  constructor(width: ?Length, height: ?Length, text: ?Text) {
    this.width = width;
    this.height = height;
    this.text = text;
  }

  static text(fontSize: ?Length, lines: ?number, lineHeight: ?Length): Content {
    var height = null;
    if (lines === 1 && fontSize) {
      height = new Length(fontSize.value, fontSize.lengthType);
    } else if (lines && lines > 1 && lineHeight) {
      height = new Length(lineHeight.value * lines, lineHeight.lengthType);
    }
    return new Content(null, height, new Text(fontSize, lines, lineHeight));
  }
}

class Container {
  width: ?Length;
  height: ?Length;

  constructor(width: ?Length, height: ?Length) {
    this.width = width;
    this.height = height;
  }
}

class HorizontalAlignment {
  static LEFT: HorizontalAlignment;
  static CENTER: HorizontalAlignment;
  static RIGHT: HorizontalAlignment;
}
HorizontalAlignment.LEFT = new HorizontalAlignment();
HorizontalAlignment.CENTER = new HorizontalAlignment();
HorizontalAlignment.RIGHT = new HorizontalAlignment();

class VerticalAlignment {
  static TOP: VerticalAlignment;
  static MIDDLE: VerticalAlignment;
  static BOTTOM: VerticalAlignment;
}
VerticalAlignment.TOP = new VerticalAlignment();
VerticalAlignment.MIDDLE = new VerticalAlignment();
VerticalAlignment.BOTTOM = new VerticalAlignment();


class Browser {
  name: string;
  shortName: string;
  versions: Array<string>;

  constructor(name: string, shortName: string, versions: Array<string>) {
    this.name = name;
    this.shortName = shortName;
    this.versions = versions;
  }

  static IE: Browser;
}
Browser.IE = new Browser(
  'Internet Explorer',
  'IE',
  [
    '5.5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
  ]
);

class BrowserSupport {
  browser: Browser;
  minVersion: string;

  constructor(browser: Browser, minVersion: string) {
    invariant(
      browser.versions.indexOf(minVersion) != -1,
      'Invalid version %s for browser %s',
      minVersion,
      browser.name
    );

    this.browser = browser;
    this.minVersion = minVersion;
  }
}

module.exports = {
  Length,
  LengthType,
  HorizontalAlignment,
  VerticalAlignment,
  Content,
  Container,
  Text,
  Browser,
  BrowserSupport,
};
