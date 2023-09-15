import React, { useEffect, useRef, useState } from "react";
import Cross from "./assets/cross.png";
import SearchImg from "./assets/search.png";
import "./search.css";

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
        type: "module",
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e) => {
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
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener("message", onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () =>
      worker.current.removeEventListener("message", onMessageReceived);
  }, [input]);

  const handleChange = (e) => {
    setInput(e.target.value);
    worker.current.postMessage({
      text: e.target.value,
      data: data,
      by: by,
      template: template,
      accuracy: accuracy,
      model: model,
    });
    if (onSearchChange) {
      onSearchChange(output)
    }
  };

  const handleSubmit = (e) => {
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

  return (
    <>
      <div>
        <form
          onSubmit={handleSubmit}
          className={
            defaultStyle
              ? `search-container ${ContainerClassname}`
              : ContainerClassname
          }
          style={ContainerStyle}
        >
          <input
            style={InputStyle}
            placeholder={placeholder ? placeholder : "Search..."}
            className={
              defaultStyle ? `search-input ${inputClassName}` : inputClassName
            }
            value={input}
            onChange={handleChange}
            {...restProps}
          ></input>
          {iconCancel && iconSearch ? (
            <button
              className="cancel-button"
              style={{ outline: "none" }}
              onClick={() => {
                setInput("");
              }}
            >
              <img
                width={18}
                src={input ? Cross : SearchImg}
                alt={"cross"}
              ></img>
            </button>
          ) : (
            ""
          )}
        </form>
        {prevResults ? (
          <div className="search-results">
            {output?.map((item, index) => (
              <>
                {renderItemFunction ? (
                  renderItemFunction(item, index) // Llama a la función proporcionada por el usuario
                ) : (
                  // Representación predeterminada si renderItemFunction no está definida
                  <a
                    href={itemLinkFunction ? itemLinkFunction(item, index) : ""}
                    className="search-result-item"
                    key={index}
                  >
                    {by ? (
                      item[by.replace(/"/g, "")]
                    ) : (
                      <span style={{ fontWeight: "400", color: "red" }}>
                        Define the prop renderItemFunction
                      </span>
                    )}
                  </a>
                )}
              </>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default Searcher