import React, { useState, useRef, useEffect } from 'react';
import './assets/main-f7794a90.css'

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

var img$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAjElEQVR4nO2USwqAMAxE3yVS9P4n0Y342+jC4yiFCiJiE1tXOqsuJvNCGgK/PqsaGACn8HrPCFQWQAeswByBuODx3tYCEGAKhQtQKjyFBRCDSGr4HURyhV/NeT69NUugkhy6ztZ5DFDmCndvjkguPlSzwo/DdyVDNKsoKZD+wanoLIDGeOyGUPPri9oAu1tF+guhxmgAAAAASUVORK5CYII=";
  var Cross = img$1;

var img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA6klEQVR4nO2TSQrCQBBF315xabyMwzHUSwiCiCsFx7uI4kkcjuKwNlLwA7VQ244IIj4oSMjv+tU/3fCrVIAZsAcuKnueAsm7zVtqmD6oM9DM27wNXNVoCVSBgqoGrPTtmsekoumsQeeJrut2EhXXzE0eYi3tJMbgoEUWS4i6tPbjXyaLx/IOUXQxRRvY4hAlaY95IrLTEqIh7S7GYKpFdhRDbKQdxxgkLiY7io/oSXMCykTSdBdtrSiyi9Zwk1sNYpt7k2wn6Z2yyefufZHHJNEl2srsrOexiyV91yRE/2/y1XEN+RAj1Q9xA86CZOpAdQj+AAAAAElFTkSuQmCC";
  var SearchImg = img;

function Searcher({
  data,
  by,
  template,
  accuracy = 0.5,
  model = "Xenova/paraphrase-albert-base-v2",
  defaultStyle = true,
  InputStyle,
  ContainerStyle,
  inputClassName,
  ContainerClassname,
  iconCancel = true,
  iconSearch = true,
  placeholder,
  prevResults = true,
  renderItemFunction,
  itemLinkFunction,
  onSearchChange,
  onSearchSubmit,
  ...restProps
}) {
  // Model loading
  // Inputs and outputs
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);

  // Create a reference to the worker object.
  const worker = useRef(null);

  // We use the `useEffect` hook to setup the worker as soon as the `App` component is mounted.
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL("./worker.js", import.meta.url), {
        type: "module"
      });
      console.log(worker);
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = e => {
      switch (e.data.status) {
        case "initiate":
          // Model file start load: add a new progress item to the list.
          break;
        case "progress":
          // Model file progress: update one of the progress items.
          break;
        case "done":
          // Model file loaded: remove the progress item from the list.
          break;
        case "ready":
          // Pipeline ready: the worker is ready to accept messages.
          break;
        case "update":
          // Generation update: update the output text.
          setOutput(e.data.output);
          break;
        case "complete":
          // Generation complete: re-enable the "Translate" button
          setOutput(e.data.output);
          console.log(e.data.output);
          break;
      }
    };
    worker.current.onerror = error => {
      // Aquí puedes manejar los errores del Web Worker
      console.error("Error en el Web Worker:", error);
    };
    worker.current.onmessage = message => {
      // Aquí puedes manejar los errores del Web Worker
      console.error("Message en el Web Worker:", message);
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener("message", onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current.removeEventListener("message", onMessageReceived);
  }, [input]);
  const handleChange = e => {
    setInput(e.target.value);
    console.log(worker);
    worker.current.postMessage({
      text: e.target.value,
      data: data,
      by: by,
      template: template,
      accuracy: accuracy,
      model: model
    });
    if (onSearchChange) {
      onSearchChange(output);
    }
  };
  const handleSubmit = e => {
    console.log('submitted');
    e.preventDefault();
    // worker.current.postMessage({
    //   text: input,
    //   data: data,
    //   by: by,
    //   template: template,
    //   accuracy: accuracy,
    //   model: model,
    // });
    if (onSearchSubmit) {
      onSearchSubmit(output);
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: defaultStyle ? `search-container ${ContainerClassname}` : ContainerClassname,
    style: ContainerStyle
  }, /*#__PURE__*/React.createElement("input", _extends({
    style: InputStyle,
    placeholder: placeholder ? placeholder : "Search...",
    className: defaultStyle ? `search-input ${inputClassName}` : inputClassName,
    value: input,
    onChange: handleChange
  }, restProps)), iconCancel && iconSearch ? /*#__PURE__*/React.createElement("button", {
    className: "cancel-button",
    style: {
      outline: "none"
    },
    onClick: () => {
      setInput("");
    }
  }, /*#__PURE__*/React.createElement("img", {
    width: 18,
    src: input ? Cross : SearchImg,
    alt: "cross"
  })) : ""), prevResults ? /*#__PURE__*/React.createElement("div", {
    className: "search-results"
  }, output?.map((item, index) => /*#__PURE__*/React.createElement(React.Fragment, null, renderItemFunction ? renderItemFunction(item, index) // Llama a la función proporcionada por el usuario
  :
  /*#__PURE__*/
  // Representación predeterminada si renderItemFunction no está definida
  React.createElement("a", {
    href: itemLinkFunction ? itemLinkFunction(item, index) : "",
    className: "search-result-item",
    key: index
  }, by ? item[by.replace(/"/g, "")] : /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: "400",
      color: "red"
    }
  }, "Define the prop renderItemFunction"))))) : ""));
}

// import React from 'react'
// import ReactDOM from 'react-dom/client'

// Load the model and create InferenceSession

//   {
//     title: "UX Designer",
//     tags: "Designer",
//   },
//   {
//     title: "Senior Accounter",
//     tags: "Accounter",
//   },
//   {
//     title: "Product Manager",
//     tags: "Managment",
//   },
// ];

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     {" "}
//     <Searcher
//       data={_data}
//       by="title"
//       itemLinkFunction={(item) => `/${item.title}`}
//     />{" "}
//   </React.StrictMode>
// );

export { Searcher as default };
