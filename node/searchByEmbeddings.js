import { pipeline } from "@xenova/transformers";

export async function searchByEmbeddings(
  data,
  query,
  by = "",
  template = "",
  accuracy = 0.4,
  model = "Xenova/all-MiniLM-L6-v2"
) {
  try {
    let dataFormatted = [];
    if (!data || !data.length) {
      throw new Error('The "data" param is required!');
    }
    if (!query) {
      throw new Error('The "query" param is required!');
    }
    if (!by && !template) {
      throw new Error(
        'At least one of the params: "by" or "template" is needed!'
      );
    } else if (by && template) {
      const uniqueProps = new Set(template.match(/\{(.*?)\}/g) || []);
      const formattedProps = Array.from(uniqueProps).map((prop) =>
        prop.replace("{", "").replace("}", "")
      );

      dataFormatted = data.map((item) => {
        const formatted = template.replace(/\{(.*?)\}/g, (match, prop) => {
          return item[prop];
        });
        return formatted;
      });
    } else if (template) {
      const uniqueProps = new Set(template.match(/\{(.*?)\}/g) || []);
      const formattedProps = Array.from(uniqueProps).map((prop) =>
        prop.replace("{", "").replace("}", "")
      );
      dataFormatted = data.map((item) => {
        const formatted = template.replace(/\{(.*?)\}/g, (match, prop) => {
          return item[prop];
        });
        return formatted;
      });
    } else {
      dataFormatted = data.map((item) => item[by]);
    }
    // GENERATING THE EMBEDDING MODEL
    const extractor = await pipeline("feature-extraction", model);
    let embeddingsList = [];
    for (const fragment of dataFormatted) {
      const embedding = await extractor(fragment, {
        pooling: "mean",
        normalize: true,
      });
      embeddingsList.push(Array.from(embedding.data));
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
    const qEmbedding = await extractor(query, {
      pooling: "mean",
      normalize: true,
    });
    const qEmbedding_formatted = Array.from(qEmbedding.data);

    const similaritiesOrder = [];
    for (const embedding of embeddingsList) {
      const similarity = dotProduct(embedding, qEmbedding_formatted);
      similaritiesOrder.push(similarity);
    }

    const sortedIndices = Array.from(
      { length: similaritiesOrder.length },
      (_, index) => index
    ).sort((a, b) => similaritiesOrder[b] - similaritiesOrder[a]);

    const results = [];
    try {
      for (const index of sortedIndices) {
        const similar = similaritiesOrder[index];
        if (similar <= accuracy) {
          continue;
        } else {
          // Add data that meets the threshold
          results.push(data[index]);
        }
      }
    } catch (error) {
      throw new Error(error);
    }
    return results;
  } catch (error) {
    throw new Error(error);
  }
}
