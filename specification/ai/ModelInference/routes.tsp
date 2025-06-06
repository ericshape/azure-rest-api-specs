import "@azure-tools/typespec-azure-core";
import "@typespec/rest";
import "@typespec/http";
import "@typespec/versioning";

import "./models/common.tsp";
import "./models/chat_completions.tsp";
import "./models/embeddings.tsp";
import "./models/image_embeddings.tsp";

using TypeSpec.Rest;
using TypeSpec.Http;
using TypeSpec.Versioning;

@versioned(ModelInference.Versions)
namespace ModelInference;

@doc("""
  Gets chat completions for the provided chat messages.
  Completions support a wide variety of tasks and generate text that continues from or "completes"
  provided prompt data. The method makes a REST API call to the `/chat/completions` route
  on the given endpoint.
  """)
@actionSeparator("/")
@route("chat/completions")
op getChatCompletions is Azure.Core.RpcOperation<
  {
    @doc("The parameters of the chat completions request.")
    @body
    body: ChatCompletionsOptions;

    ...AdditionalRequestHeaders;
  },
  ChatCompletions
>;

@doc("""
  Return the embedding vectors for given text prompts.
  The method makes a REST API call to the `/embeddings` route on the given endpoint.
  """)
@actionSeparator("/")
@route("embeddings")
op getEmbeddings is Azure.Core.RpcOperation<
  {
    @doc("The parameters of the embeddings request.")
    @body
    body: EmbeddingsOptions;

    ...AdditionalRequestHeaders;
  },
  EmbeddingsResult
>;

@doc("""
  Return the embedding vectors for given images.
  The method makes a REST API call to the `/images/embeddings` route on the given endpoint.
  """)
@actionSeparator("/")
@route("images/embeddings")
op getImageEmbeddings is Azure.Core.RpcOperation<
  {
    @doc("The parameters of the image embeddings request.")
    @body
    body: ImageEmbeddingsOptions;

    ...AdditionalRequestHeaders;
  },
  EmbeddingsResult
>;

@doc("""
  Returns information about the AI model deployed.
  The method makes a REST API call to the `/info` route on the given endpoint.
  This method will only work when using Serverless API, Managed Compute, or Model .
  inference endpoint. Azure OpenAI endpoints don't support i.
  """)
@get
@route("/info")
op getModelInfo is Azure.Core.RpcOperation<
  {
    @doc("The model deployment name you want information from.")
    @query
    @added(ModelInference.Versions.v2025_04_01)
    `model`?: string;
  },
  ModelInfo
>;
