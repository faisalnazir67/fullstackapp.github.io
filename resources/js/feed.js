"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Form = function Form(props) {
  var setReload = props.reloadFunction;

  var _React$useState = React.useState(""),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      content = _React$useState2[0],
      setcontent = _React$useState2[1];

  var post = function post(e) {
    e.preventDefault();
    $.post("/post/new", {
      content: content
    }, function (data) {
      if (data == "Created") {
        alert("Post Created Successfully");
        setReload(function (cur) {
          return !cur;
        });
      } else {
        alert("Error Occured");
      }
    });
  };

  return /*#__PURE__*/React.createElement("section", {
    className: "mt-8 w-3/4 m-auto bg-white p-12 pt-10  rounded-md"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl bold mb-2"
  }, "Create a Post"), /*#__PURE__*/React.createElement("form", {
    action: "/post/new",
    id: "post-form",
    method: "post",
    className: "flex flex-row",
    onSubmit: post
  }, /*#__PURE__*/React.createElement("textarea", {
    name: "content",
    id: "post-content-field",
    placeholder: "What's on your mind?",
    className: "border-2 px-3 py-2 w-full",
    value: content,
    onChange: function onChange(e) {
      setcontent(e.target.value);
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 float-right min-w-max"
  }, /*#__PURE__*/React.createElement("i", {
    className: "far fa-paper-plane"
  }), " Post Now!")));
};

var Posts = function Posts() {
  var _React$useState3 = React.useState([]),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      posts = _React$useState4[0],
      setPosts = _React$useState4[1];

  var _React$useState5 = React.useState(false),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      reload = _React$useState6[0],
      setReload = _React$useState6[1];

  React.useEffect(function () {
    fetch("/post/all").then(function (data) {
      data.json().then(function (final_data) {
        setPosts(final_data);
      });
    })["catch"](function (err) {
      console.log(err);
    });
  }, [reload]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Form, {
    reloadFunction: setReload
  }), posts.map(function (post, index) {
    return /*#__PURE__*/React.createElement("div", {
      className: "mt-8 w-8/12 m-auto bg-white p-12 pt-10  rounded-md flex gap-x-4",
      key: index
    }, /*#__PURE__*/React.createElement("i", {
      className: "far fa-user-circle text-8xl"
    }), /*#__PURE__*/React.createElement("div", {
      className: "w-full"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-row justify-between items-center"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "text-lg font-semibold"
    }, post.name), /*#__PURE__*/React.createElement("span", {
      className: "text-gray-700 text-sm"
    }, post.date_posted)), /*#__PURE__*/React.createElement("p", null, post.content)));
  }));
};

var root = ReactDOM.createRoot(document.getElementById("app"));
root.render( /*#__PURE__*/React.createElement(Posts, null));