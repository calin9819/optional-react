import React from "react";
import Firebase from "../Firebase";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  ContentState
} from "draft-js";

export default class NewArticle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      content: "",
      editorState: EditorState.createEmpty()
    };
    this.onChange = editorState => {
      const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
      const value = blocks
        .map(block => (!block.text.trim() && "\n") || block.text)
        .join("\n");
      this.setState({ editorState, content: value });
    };
    this.setEditor = editor => {
      this.editor = editor;
    };
    this.focusEditor = () => {
      if (this.editor) {
        this.editor.focus();
      }
    };

    this.handleKeyCommand = command => this._handleKeyCommand(command);
    this.onTab = e => this._onTab(e);
    this.toggleBlockType = type => this._toggleBlockType(type);
    this.toggleInlineStyle = style => this._toggleInlineStyle(style);

    this.FirebaseInstance = new Firebase();
  }

  _handleKeyCommand(command) {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _onTab(e) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  _toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    );
  }

  componentDidMount() {
    if ((this.props.action == "Edit")) {
      let id = this.props.match.params.id;
      this.FirebaseInstance.article(id).on("value", snapshot => {
        const articleObject = snapshot.val();
        this.setState({
          title: articleObject.title,
          content: articleObject.content,
          editorState: EditorState.createWithContent(
            ContentState.createFromText(articleObject.content)
          )
        });
      });
    }
  }

  add = () => {
    let currentDate = new Date();
    this.FirebaseInstance.articles().push({
      title: this.state.title,
      content: this.state.content,
      createdAt: currentDate,
      lastEdit: currentDate
    });

    window.location.replace("/");
  };

  edit = () => {
    let currentDate = new Date();
    this.FirebaseInstance.article(this.props.match.params.id).set({
      title: this.state.title,
      content: this.state.content,
      lastEdit: currentDate
    });
    window.location.replace("/");
  };

  render() {
    const { editorState } = this.state;

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = "RichEditor-editor";
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (
        contentState
          .getBlockMap()
          .first()
          .getType() !== "unstyled"
      ) {
        className += " RichEditor-hidePlaceholder";
      }
    }

    return (
      <div className="container">
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h1>{this.props.title}</h1>
          </div>
          <div className="panel-body">
        <div className="border p-4">
          <div className="form-group">
            <label>Title</label>
            <input
              className="form-control"
              value={this.state.title}
              onChange={ev => this.setState({ title: ev.target.value })}
              placeholder="Title"
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <div className="RichEditor-root">
              <BlockStyleControls
                editorState={editorState}
                onToggle={this.toggleBlockType}
              />
              <InlineStyleControls
                editorState={editorState}
                onToggle={this.toggleInlineStyle}
              />
              <div className={className} onClick={this.focus}>
                <Editor
                  blockStyleFn={getBlockStyle}
                  customStyleMap={styleMap}
                  editorState={editorState}
                  handleKeyCommand={this.handleKeyCommand}
                  onChange={this.onChange}
                  onTab={this.onTab}
                  placeholder="Tell a story..."
                  ref="editor"
                  spellCheck={true}
                />
              </div>
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={this.props.action == "Add" ? this.add : this.edit}
          >
            {this.props.action}
          </button>
          <button style={{ marginLeft: "10px"}} className="btn btn-info" onClick={() => {
            window.location.replace("/");
          }}>
            Go back
          </button>
        </div>
      </div>
      </div>
      </div>
    );
  }
}

const styleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2
  }
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case "blockquote":
      return "RichEditor-blockquote";
    default:
      return null;
  }
}

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = e => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = "RichEditor-styleButton";
    if (this.props.active) {
      className += " RichEditor-activeButton";
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

const BLOCK_TYPES = [
  { label: "H1", style: "header-one" },
  { label: "H2", style: "header-two" },
  { label: "H3", style: "header-three" },
  { label: "H4", style: "header-four" },
  { label: "H5", style: "header-five" },
  { label: "H6", style: "header-six" },
  { label: "Blockquote", style: "blockquote" },
  { label: "UL", style: "unordered-list-item" },
  { label: "OL", style: "ordered-list-item" },
  { label: "Code Block", style: "code-block" }
];

const BlockStyleControls = props => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map(type => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

var INLINE_STYLES = [
  { label: "Bold", style: "BOLD" },
  { label: "Italic", style: "ITALIC" },
  { label: "Underline", style: "UNDERLINE" },
  { label: "Monospace", style: "CODE" }
];

const InlineStyleControls = props => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};
