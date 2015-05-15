/** @flow */

var React = require('react');
var RadioComponent = require('./RadioComponent');
var RadioListComponent = require('./RadioListComponent');

var Options = require('../how/Options');

class BrowserSupportComponent extends React.Component {
  constructor(props: mixed) {
    super(props);
    this.state = {
      browserSupport: [],
    };
  }

  state: {
    browserSupport: Array<Options.BrowserSupport>;
  };

  getBrowserSupport(): Array<Options.BrowserSupport> {
    return this.state.browserSupport;
  }

  _handleBrowserSupportChange(
    support: { browser: Options.Browser; version: ?string; }
  ) {
    for (var i = 0; i < this.state.browserSupport.length; ++i) {
      var browserSupport = this.state.browserSupport[i];
      if (browserSupport.browser === support.browser) {
        if (support.version == null) {
          this.state.browserSupport.splice(i, 1);
        } else {
          browserSupport.minVersion = support.version;
        }
        this.setState({browserSupport: this.state.browserSupport});
        return;
      }
    }

    if (support.version != null) {
      this.state.browserSupport.push(
        new Options.BrowserSupport(support.browser, support.version)
      );
      this.setState({browserSupport: this.state.browserSupport});
    }
  }

  render(): ?ReactElement {
    var browser = Options.Browser.IE;
    var noSupport = {
      browser: browser,
      version: null,
    };
    return (
      <div>
        <h2>{browser.shortName} Support</h2>
        <p>
          What is the minimum version of {browser.name} you need to support?
        </p>
        <RadioListComponent
          onChange={this._handleBrowserSupportChange.bind(this)}>
          <RadioComponent labelText="None" value={noSupport} />
          {browser.versions.map(version => {
             var support = { browser, version };
             return (
               <RadioComponent labelText={version} value={support} />
             );
           })}
        </RadioListComponent>
      </div>
    );
  }
}

module.exports = BrowserSupportComponent;
