const jsdom = require("jsdom");
global.document = jsdom.jsdom("");
global.window = document.defaultView;
global.navigator = window.navigator;

const TagsInput = require("../src");

const React = require("react");
const TestUtils = require("react-addons-test-utils");
const assert = require("assert");

class TestComponent extends React.Component {
  constructor() {
    super()
    this.state = {tags: []}
    this.change = this.change.bind(this);
    this.input = this.input.bind(this);
    this.tagsinput = this.tagsinput.bind(this);
  }

  input() {
    return this.refs.tagsinput.refs.input;
  }

  tagsinput() {
    return this.refs.tagsinput;
  }

  change(tags) {
    this.setState({tags});
  }

  len() {
    return this.state.tags.length;
  }

  tag(i) {
    return this.state.tags[i];
  }

  render() {
    return <TagsInput ref="tagsinput" value={this.state.tags} onChange={this.change} {...this.props} />
  }
}

function randstring() {
  return +new Date() + "_" + Math.floor(1000000 * Math.random());
}

function change(comp, value) {
  TestUtils.Simulate.change(comp.input(), {target: {value: value}});
}

function paste(comp, value) {
  TestUtils.Simulate.paste(comp.input(), {
    clipboardData: {
      getData: () => value
    }
  });
}

function keyDown(comp, code) {
  TestUtils.Simulate.keyDown(comp.input(), {keyCode: code});
}

function blur(comp) {
  TestUtils.Simulate.blur(comp.input());
}

function click(comp) {
  TestUtils.Simulate.click(comp);
}

function mouseover(comp) {
  TestUtils.Simulate.mouseOver(comp);
}

function add(comp, tag) {
  change(comp, tag);
  keyDown(comp, 13);
}

function remove(comp) {
  change(comp, "");
  keyDown(comp, 8);
}

function allTag(comp, tagName) {
  return TestUtils.scryRenderedDOMComponentsWithTag(comp, tagName);
}

function allClass(comp, className) {
  return TestUtils.scryRenderedDOMComponentsWithClass(comp, className);
}

describe("TagsInput", () => {
  describe("basic", () => {
    it("should add a tag", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent />);
      let tag = randstring();

      change(comp, tag);
      keyDown(comp, 13);
      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), tag, "it should be the tag that was added");
    });

    it("should remove a tag", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent />);
      let tag = randstring();

      add(comp, tag);
      assert.equal(comp.len(), 1, "there should be one tag");
      keyDown(comp, 8);
      assert.equal(comp.len(), 0, "there should be no tags");
    });

    it("should remove a tag by clicking", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent />);
      let tag = randstring();

      add(comp, tag + "1");
      add(comp, tag + "2");
      assert.equal(comp.len(), 2, "there should be two tags");

      let removes = allTag(comp, "a");
      assert.equal(removes.length, 2, "there should be two remove buttons");
      click(removes[0]);
      assert.equal(comp.len(), 1, "there should be one tag");
    });

    it("should focus on input when clicking on component div", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent />);
      click(comp.tagsinput().refs.div);
    });

    it("should not add empty tag", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent />);

      change(comp, "");
      keyDown(comp, 13);
      assert.equal(comp.len(), 0, "there should be no tag");
    });
  });

  describe("paste", () => {
    it("should not add a tag", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent />);
      let tag = randstring();

      paste(comp, tag);
      assert.equal(comp.len(), 0, "there should be one tag");
    });

    it("should add single tag", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent addOnPaste={true} />);
      let tag = randstring();

      paste(comp, tag);
      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), tag, "it should be the tag that was added");
    });

    it("should add two tags", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent addOnPaste={true} />);
      let firstTag = randstring();
      let secondTag = firstTag + '2';

      paste(comp, firstTag + ' ' + secondTag);
      assert.equal(comp.len(), 2, "there should be two tags");
      assert.equal(comp.tag(0), firstTag, "it should be the first tag that was added");
      assert.equal(comp.tag(1), secondTag, "it should be the second tag that was added");
    });

    it("should support onlyUnique", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent addOnPaste={true} onlyUnique={true} />);
      let tag = randstring();

      paste(comp, tag + ' ' + tag);
      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), tag, "it should be the tag that was added");
    });

    it("should support validation", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent addOnPaste={true} validationRegex={/a+/} />);
      let firstTag = 'aaa';
      let secondTag = randstring();

      paste(comp, firstTag + ' ' + secondTag);
      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), firstTag, "it should be the tag that was added");
    });

    it("should respect limit", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent addOnPaste={true} maxTags={1} />);
      let firstTag = randstring();
      let secondTag = firstTag + '2';

      paste(comp, firstTag + ' ' + secondTag);
      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), firstTag, "it should be the tag that was added");
    });

    it("should split tags on ,", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent addOnPaste={true} pasteSplit={(data) => data.split(",")} />);
      let firstTag = randstring();
      let secondTag = firstTag + '2';

      paste(comp, firstTag + ',' + secondTag);
      assert.equal(comp.len(), 2, "there should be two tags");
      assert.equal(comp.tag(0), firstTag, "it should be the tag that was added");
      assert.equal(comp.tag(1), secondTag, "it should be the tag that was added");
    });
  });

  describe("props", () => {
    it("should not add a tag twice if onlyUnique is true", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent onlyUnique={true} />);
      let tag = randstring();

      change(comp, tag);
      keyDown(comp, 13);
      change(comp, tag);
      keyDown(comp, 13);
      assert.equal(comp.len(), 1, "there should be one tag");
    });

    it("should add a tag twice if onlyUnique is false", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent onlyUnique={false} />);
      let tag = randstring();

      change(comp, tag);
      keyDown(comp, 13);
      change(comp, tag);
      keyDown(comp, 13);
      assert.equal(comp.len(), 2, "there should be two tags");
    });

    it("should add a tag on key code 44", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent addKeys={[44]} />);
      let tag = randstring();

      change(comp, tag);
      keyDown(comp, 44);
      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), tag, "it should be the tag that was added");
    });

    it("should add a tag on blur, if `this.props.addOnBlur` is true", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent addOnBlur={true} />);
      let tag = randstring();

      change(comp, tag);
      blur(comp);

      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), tag, "it should be the tag that was added");
    });

    it("should not add a tag on blur, if `this.props.addOnBlur` is false", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent addOnBlur={false} />);
      let tag = randstring();

      change(comp, tag);
      blur(comp);

      assert.equal(comp.len(), 0, "there should be no tag");
    });

    it("should not add a tag on blur, if `this.props.addOnBlur` is not defined", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent />);
      let tag = randstring();

      change(comp, tag);
      blur(comp);

      assert.equal(comp.len(), 0, "there should be no tag");
    });

    it("should remove a tag on key code 44", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent removeKeys={[44]} />);
      let tag = randstring();

      add(comp, tag);
      assert.equal(comp.len(), 1, "there should be one tag");
      keyDown(comp, 44);
      assert.equal(comp.len(), 0, "there should be no tags");
    });

    it("should be unlimited tags", () => {
        let comp = TestUtils.renderIntoDocument(<TestComponent maxTags={-1} />);
        let tag = randstring();
        add(comp, tag);
        add(comp, tag);
        assert.equal(comp.len(), 2, "there should be 2 tags");
    });

    it("should limit tags added to 0", () => {
        let comp = TestUtils.renderIntoDocument(<TestComponent maxTags={0} />);
        let tag = randstring();
        add(comp, tag);
        add(comp, tag);
        assert.equal(comp.len(), 0, "there should be 0 tags");
    });

    it("should limit tags added to 1", () => {
        let comp = TestUtils.renderIntoDocument(<TestComponent maxTags={1} />);
        let tag = randstring();
        add(comp, tag);
        add(comp, tag);
        assert.equal(comp.len(), 1, "there should be 1 tags");
    });

    it("should add props to tag", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent tagProps={{className: "test"}} />);
      let tag = randstring();

      add(comp, tag);
      assert.equal(comp.len(), 1, "there should be one tag");
      let tags = allClass(comp, "test");
      assert.equal(comp.len(), tags.length, "there should be one tag");
    });

    it("should add props to input", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent inputProps={{className: "test"}} />);
      let inputs = allTag(comp, "input");

      assert.equal(inputs[0].className, "test", "class name should be test");
    });

    it("should fire onChange on input", (done) => {
      let tag = randstring()
      let onChange = (e) => {
        assert.equal(tag, e.target.value, "input tag should be equal");
        done();
      }

      let comp = TestUtils.renderIntoDocument(<TestComponent inputProps={{onChange: onChange}} />);
      let inputs = allTag(comp, "input");

      change(comp, tag);
    });

    it("should render tags with renderTag", () => {
      let renderTag = (props) => {
        return <div key={props.key} className="test"></div>;
      };

      let comp = TestUtils.renderIntoDocument(<TestComponent renderTag={renderTag} />);
      let tag = randstring();

      add(comp, tag);
      assert.equal(comp.len(), 1, "there should be one tag");
      let tags = allClass(comp, "test");
      assert.equal(comp.len(), tags.length, "there should be one tag");
    });

    it("should render input with renderInput", () => {
      let renderInput = (props) => {
        return <input key={props.key} className="test" />;
      };
      let comp = TestUtils.renderIntoDocument(<TestComponent renderInput={renderInput} />);
      let inputs = allTag(comp, "input");

      assert.equal(inputs[0].className, "test", "class name should be test");
    });

    it("should accept tags only matching validationRegex", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent validationRegex={/a+/} />);
      add(comp, 'b');
      assert.equal(comp.len(), 0, "there should be no tags");
      add(comp, 'a');
      assert.equal(comp.len(), 1, "there should be one tag");
    });
  });

  describe("methods", () => {
    it("should focus input", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent />);

      comp.tagsinput().focus();
    });

    it("should blur input", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent />);

      comp.tagsinput().blur();
    });
  });

  describe("suggestions", () => {
    it("add a tag from suggestions by clicking", () => {
      let suggestions = ["t" + randstring(), "t" + randstring(), "t" + randstring()];
      let comp = TestUtils.renderIntoDocument(<TestComponent suggestions={suggestions} />);

      change(comp, "t");

      let suggested = allClass(comp, "react-tagsinput-suggestion");

      assert.equal(suggestions.length, suggested.length, "we should see all suggestions")

      click(suggested[0]);

      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), suggestions[0], "it should be the first suggestion");
    });

    it("add a tag from suggestions by selection with arrow keys", () => {
      let suggestions = ["t" + randstring(), "t" + randstring(), "t" + randstring()];
      let comp = TestUtils.renderIntoDocument(<TestComponent suggestions={suggestions} />);

      change(comp, "t");
      keyDown(comp, 40);
      keyDown(comp, 40);
      keyDown(comp, 38);
      keyDown(comp, 13);

      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), suggestions[0], "it should be the first suggestion");
    });

    it("add a tag from suggestions by selection with mouse", () => {
      let suggestions = ["t" + randstring(), "t" + randstring(), "t" + randstring()];
      let comp = TestUtils.renderIntoDocument(<TestComponent suggestions={suggestions} />);

      change(comp, "t");

      let suggested = allClass(comp, "react-tagsinput-suggestion");

      mouseover(suggested[0]);
      keyDown(comp, 13);

      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), suggestions[0], "it should be the first suggestion");
    });

    it("add only tags from suggestions", () => {
      let suggestions = ["t" + randstring(), "t" + randstring(), "t" + randstring()];
      let comp = TestUtils.renderIntoDocument(<TestComponent onlySuggested={true} suggestions={suggestions} />);

      add(comp, randstring());
      assert.equal(comp.len(), 0, "there should be no tags");

      change(comp, "t");

      let suggested = allClass(comp, "react-tagsinput-suggestion");

      assert.equal(suggestions.length, suggested.length, "we should see all suggestions")

      keyDown(comp, 38)
      keyDown(comp, 13)

      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), suggestions[0], "it should be the first suggestion");
    });

    it("add tags from suggestions that are unique", () => {
      let suggestions = ["t" + randstring(), "t" + randstring(), "t" + randstring()];
      let comp = TestUtils.renderIntoDocument(<TestComponent onlyUnique={true} suggestions={suggestions} />);

      change(comp, "t");

      let suggested1 = allClass(comp, "react-tagsinput-suggestion");

      assert.equal(suggestions.length, suggested1.length, "we should see all")

      click(suggested1[0]);

      assert.equal(comp.len(), 1, "there should be one tag");
      assert.equal(comp.tag(0), suggestions[0], "it should be the first suggestion");

      change(comp, "t");

      let suggested2 = allClass(comp, "react-tagsinput-suggestion");

      assert.equal(suggestions.length - 1, suggested2.length, "we should see all but one suggestion")
    });
  });

  describe("coverage", () => {
    it("not remove no existant index", () => {
      let comp = TestUtils.renderIntoDocument(<TestComponent />);

      comp.tagsinput()._removeTag(1);
    });
  });
});
