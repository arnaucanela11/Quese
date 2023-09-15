import { pipeline } from "@xenova/transformers";
/**
 * This class uses the Singleton pattern to ensure that only one instance of the
 * pipeline is loaded. This is because loading the pipeline is an expensive
 * operation and we don't want to do it every time we want to translate a sentence.
 */
  export class MyTranslationPipeline {
  static task = "feature-extraction";
  static model = "Xenova/paraphrase-albert-base-v2";
  static instance = null;

  static async getInstance(model, progress_callback = null) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }

    return this.instance;
  }
}

function dotProduct(a, b) {
  if (a.length !== b.length) {
    throw new Error("Both embeddings must have the same length!");
  }

  let result = 0;

  for (let i = 0; i < a.length; i++) {
    result += a[i] * b[i];
  }

  return result;
}

// Listen for messages from the main thread
 self.addEventListener("message", async (event) => {
  try {
  let data = event.data.data
  let text = event.data.text
  let by = event.data.by
  let template = event.data.template
  let accuracy = event.data.accuracy
  let model = event.data.model

  let dataFormatted = [];
  if (!data || !data.length) {
    throw new Error('The "data" param is required!');
  }
  if (!text) {
    throw new Error('The "query" param is required!');
  }
  if (!by && !template) {
    throw new Error(
      'At least one of the params: "by" or "template" is needed!'
    );
  } else if (by && template) {
    //UNIQ FROM LODASH REPLACED!
    const uniqueProps = new Set(template.match(/\{(.*?)\}/g) || []);
    const formattedProps = Array.from(uniqueProps).map((prop) =>
      prop.replace("{", "").replace("}", "")
    );

    dataFormatted = data.map((item) => {
      const formatted = template.replace(
        /\{(.*?)\}/g,
        (match, prop) => {
          return item[prop];
        }
      );
      return formatted;
    });
  } else if (template) {
    const uniqueProps = new Set(template.match(/\{(.*?)\}/g) || []);
    const formattedProps = Array.from(uniqueProps).map((prop) =>
      prop.replace("{", "").replace("}", "")
    );
    dataFormatted = data.map((item) => {
      const formatted = template.replace(
        /\{(.*?)\}/g,
        (match, prop) => {
          return item[prop];
        }
      );
      return formatted;
    });
  } else {
    dataFormatted = data.map((item) => item[by]);
  }
  // Retrieve the translation pipeline. When called for the first time,
  // this will load the pipeline and save it for future use.
  let translator = await MyTranslationPipeline.getInstance(
    model,
    (x) => {
      // We also add a progress callback to the pipeline so that we can
      // track model loading.
      self.postMessage(x);
    }
  );

  // Actually perform the translation

  let embeddingsList = [];
  for (const fragment of dataFormatted) {
    const embedding = await translator(fragment, {
      pooling: "mean",
      normalize: true,
      callback_function: (x) => {
        self.postMessage({
          status: "update",
          output: translator.tokenizer.decode(x[0].output_token_ids, {
            skip_special_tokens: true,
          }),
        });
      },
    });
    embeddingsList.push(Array.from(embedding.data));
  }
  const qEmbedding = await translator(text, {
    pooling: "mean",
    normalize: true,
    callback_function: (x) => {
      self.postMessage({
        status: "update",
        output: translator.tokenizer.decode(x[0].output_token_ids, {
          skip_special_tokens: true,
        }),
      });
    },
  });
  const qEmbedding_formatted = Array.from(qEmbedding.data);
  const similaritiesOrder = [];
  for (const embedding of embeddingsList) {
    const similarity = dotProduct(embedding, qEmbedding_formatted);
    similaritiesOrder.push(similarity);
  }
  console.log(similaritiesOrder)

  const sortedIndices = Array.from(
    { length: similaritiesOrder.length },
    (_, index) => index
  ).sort((a, b) => similaritiesOrder[b] - similaritiesOrder[a]);
  const results = [];
  for (const index of sortedIndices) {
    const similar = similaritiesOrder[index];
    if (similar <= accuracy) {
      continue;
    } else {
      // Add data that meets the threshold
      results.push(data[index]);
    }
  }
  console.log(results)
  // Send the output back to the main thread
  self.postMessage({
    status: "complete",
    output: results,
  });
} catch (error) {
    console.log(error)
}
});
