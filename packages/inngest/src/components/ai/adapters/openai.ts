import { type AiAdapter, type types } from "../adapter.js";

/**
 * An OpenAI model using the OpenAI format for I/O.
 */
export interface OpenAiAiAdapter extends AiAdapter {
  /**
   * The format of the I/O for this model.
   */
  format: "openai-chat";

  [types]: {
    input: {
      /**
       * ID of the model to use. See the [model endpoint
       * compatibility](https://platform.openai.com/docs/models#model-endpoint-compatibility)
       * table for details on which models work with the Chat API.
       */
      model?: string;

      /**
       * A list of messages comprising the conversation so far. Depending on the
       * [model](https://platform.openai.com/docs/models) you use, different
       * message types (modalities) are supported, like
       * [text](https://platform.openai.com/docs/guides/text-generation),
       * [images](https://platform.openai.com/docs/guides/vision), and
       * [audio](https://platform.openai.com/docs/guides/audio).
       */
      messages: (
        | {
            /**
             * The role of the message's author. In this case `system`.
             */
            role: "system";

            /**
             * The contents of the system message.
             */
            content: string;

            /**
             * An optional name for the participant. Provides the model
             * information to differentiate between participants of the same
             * role.
             */
            name?: string;
          }
        | {
            /**
             * The role of the message's author. In this case `user`.
             */
            role: "user";

            /**
             * The contents of the user message.
             */
            content: string;

            /**
             * An optional name for the participant. Provides the model
             * information to differentiate between participants of the same
             * role.
             */
            name?: string;
          }
        | {
            /**
             * The role of the message's author. In this case `assistant`.
             */
            role: "assistant";

            /**
             * The contents of the assistant message. Required unless
             * `tool_calls` is specified.
             *
             * Can be a string representing the contents of the assistant
             * message, or an array of content parts with a defined type. Can be
             * one or more of type `text`, or exactly one of type `refusal`.
             */
            content:
              | string
              | (
                  | { type: string; text: string }
                  | { type: string; refusal: string }
                )[];

            /**
             * An optional name for the participant. Provides the model
             * information to differentiate between participants of the same
             * role.
             */
            name?: string;

            /**
             * The refusal message by the asssistant.
             */
            refusal?: string;

            /**
             * Data about a previous audio response from the model.
             */
            audio?: {
              /**
               * Unique identifier for a previous audio response from the model.
               */
              id: string;
            } | null;

            /**
             * The tool calls generated by the model, such as function calls.
             */
            tool_calls?: {
              /**
               * The ID of the tool call.
               */
              id: string;

              /**
               * The type of the tool.
               */
              type: string;

              /**
               * The function that the model called.
               */
              function: {
                /**
                 * The name of the function to call.
                 */
                name: string;

                /**
                 * The arguments to call the function with, as generated by the
                 * model in JSON format. Note that the model does not always
                 * generate valid JSON, and may hallucinate parameters not
                 * defined by your function schema. Validate the arguments in
                 * your code before calling your function.
                 */
                arguments: string;
              };
            }[];
          }
        | {
            /**
             * The role of the message's author. In this case `tool`.
             */
            role: "tool";

            /**
             * The contents of the tool message.
             */
            content: string;

            /**
             * Tool call that this message is responding to.
             *
             * This is not technically optional if the `role` is `"tool"`, but
             * it remains optional here for easy typing.
             */
            tool_call_id?: string;
          }
      )[];

      /**
       * A boolean or null value to indicate whether to store the output for use
       * in other products. Defaults to `false`.
       */
      store?: boolean | null;

      /**
       * Developer-defined tags and values used for filtering completions in the
       * dashboard.
       */
      metadata?: Record<string, string> | null;

      /**
       * Number between -2.0 and 2.0. Positive values penalize new tokens based
       * on their frequency, decreasing the likelihood of repeating the same
       * line verbatim.
       */
      frequency_penalty?: number | null;

      /**
       * Number between -2.0 and 2.0. Positive values penalize new tokens based
       * on whether they appear in the text so far, increasing the likelihood of
       * generating new topics.
       */
      presence_penalty?: number | null;

      /**
       * Modify the likelihood of specified tokens appearing in the completion.
       * Accepts a map of token IDs to bias values from -100 to 100.
       */
      logit_bias?: Record<string, number> | null;

      /**
       * Whether to return log probabilities of the output tokens. Defaults to
       * `false`.
       */
      logprobs?: boolean | null;

      /**
       * Specifies the number of most likely tokens to return at each position
       * when using log probabilities. Requires `logprobs` to be set to `true`.
       */
      top_logprobs?: number | null;

      /**
       * Maximum number of tokens to generate in the completion, including
       * visible output tokens and reasoning tokens.
       */
      max_completion_tokens?: number | null;

      /**
       * How many chat completion choices to generate for each input message.
       * Defaults to `1`.
       */
      n?: number | null;

      /**
       * Output types that you would like the model to generate. Defaults to
       * `["text"]`.
       */
      modalities?: string[] | null;

      /**
       * The temperature to use for sampling, between 0 and 2. Higher values
       * make the output more random, while lower values make it more focused.
       * Defaults to `1`.
       */
      temperature?: number | null;

      /**
       * An alternative to temperature sampling. Considers tokens with top_p
       * probability mass. Defaults to `1`.
       */
      top_p?: number | null;

      /**
       * A unique identifier representing your end-user for monitoring and
       * detecting abuse.
       */
      user?: string;

      /**
       * Whether to enable streaming responses. If true, partial message deltas
       * are sent as they become available.
       */
      stream?: boolean | null;

      /**
       * Up to 4 sequences where the API will stop generating further tokens.
       */
      stop?: string | string[] | null;

      /**
       * Controls the use of tools, including function calls, during the
       * response generation.
       */
      tool_choice?:
        | "none"
        | "auto"
        | "required"
        | { type: "function"; function: { name: string } };

      /**
       * A list of tools the model may call. Currently, only functions are
       * supported as a tool. Use this to provide a list of functions the model
       * may generate JSON inputs for. A max of 128 functions are supported.
       */
      tools?: {
        /**
         * The type of the tool.
         */
        type: "function";

        function: {
          /**
           * The name of the function to be called. Must be a-z, A-Z, 0-9, or
           * contain underscores and dashes, with a maximum length of 64.
           */
          name: string;

          /**
           * A description of what the function does, used by the model to choose
           * when and how to call the function.
           */
          description?: string;

          /**
           * The parameters the functions accepts, described as a JSON Schema
           * object. See the
           * [guide](https://platform.openai.com/docs/guides/function-calling) for
           * examples, and the [JSON Schema
           * reference](https://json-schema.org/understanding-json-schema/) for
           * documentation about the format.
           *
           * Omitting `parameters` defines a function with an empty parameter
           * list.
           */
          parameters?: Record<string, unknown>;

          /**
           * Whether to enable strict schema adherence when generating the
           * function call. If set to true, the model will follow the exact schema
           * defined in the `parameters field`. Only a subset of JSON Schema is
           * supported when `strict` is `true`. Learn more about Structured
           * Outputs in the function calling guide.
           *
           * @default false
           */
          strict?: boolean;
        };
      }[];

      /**
       * Specifies whether parallel tool calls are enabled. Defaults to `true`.
       */
      parallel_tool_calls?: boolean;

      /**
       * Seed for deterministic sampling. Beta feature.
       */
      seed?: number | null;

      /**
       * Specifies the latency tier for processing the request. Defaults to
       * `auto`.
       */
      service_tier?: "auto" | "default";

      /**
       * Configuration for a predicted output to improve response times when
       * large parts of the output are known ahead of time.
       */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prediction?: Record<string, any>;

      /**
       * Parameters for audio output when requested with `modalities:
       * ["audio"]`.
       */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      audio?: Record<string, any> | null;
    };

    output: {
      /**
       * A unique identifier for the chat completion.
       */
      id: string;

      /**
       * A list of chat completion choices. Can be more than one if `n` is
       * greater than 1.
       */
      choices: {
        /**
         * The index of the choice in the list of choices.
         */
        index: number;

        /**
         * A chat completion message generated by the model.
         */
        message: {
          /**
           * The role of the author of this message.
           */
          role: string;

          /**
           * The contents of the message.
           */
          content: string | null;

          /**
           * The refusal message generated by the model.
           */
          refusal: string | null;

          /**
           * The tool calls generated by the model, such as function calls.
           */
          tool_calls: {
            /**
             * The ID of the tool call.
             */
            id: string;

            /**
             * The type of the tool.
             */
            type: string;

            /**
             * The function that the model called.
             */
            function: {
              /**
               * The name of the function to call.
               */
              name: string;

              /**
               * The arguments to call the function with, as generated by the
               * model in JSON format. Note that the model does not always
               * generate valid JSON, and may hallucinate parameters not defined
               * by your function schema. Validate the arguments in your code
               * before calling your function.
               */
              arguments: string;
            };
          }[];

          /**
           * If the audio output modality is requested, this object contains
           * data about the audio response from the model.
           */
          audio: {
            /**
             * Unique identifier for this audio response.
             */
            id: string;

            /**
             * The Unix timestamp (in seconds) for when this audio response will
             * no longer be accessible on the server for use in multi-turn
             * conversations.
             */
            expires_at: number;

            /**
             * Base64 encoded audio bytes generated by the model, in the format
             * specified in the request.
             */
            data: string;

            /**
             * Transcript of the audio generated by the model.
             */
            transcript: string;
          } | null;
        };

        /**
         * Log probability information for the choice.
         */
        logprobs: {
          /**
           * A list of message content tokens with log probability information.
           */
          content:
            | {
                /**
                 * The token.
                 */
                token: string;

                /**
                 * The log probability of this token, if it is within the top 20
                 * most likely tokens. Otherwise, the value `-9999` is used to
                 * signify that the token is very unlikely.
                 */
                logprob: number;

                /**
                 * A list of integers representing the UTF-8 bytes
                 * representation of the token. Useful in instances where
                 * characters are represented by multiple tokens and their byte
                 * representations must be combined to generate the correct text
                 * representation. Can be `null` if there is no bytes
                 * representation for the token.
                 */
                bytes: number[] | null;

                /**
                 * List of the most likely tokens and their log probability, at
                 * this token position. In rare cases, there may be fewer than
                 * the number of requested `top_logprobs` returned.
                 */
                top_logprobs: {
                  /**
                   * The token.
                   */
                  token: string;

                  /**
                   * The log probability of this token, if it is within the top
                   * 20 most likely tokens. Otherwise, the value `-9999` is used
                   * to signify that the token is very unlikely.
                   */
                  logprob: number;

                  /**
                   * A list of integers representing the UTF-8 bytes
                   * representation of the token. Useful in instances where
                   * characters are represented by multiple tokens and their
                   * byte representations must be combined to generate the
                   * correct text representation. Can be `null` if there is no
                   * bytes representation for the token.
                   */
                  bytes: number[] | null;
                };
              }[]
            | null;

          /**
           * A list of message refusal tokens with log probability information.
           */
          refusal:
            | {
                /**
                 * The token.
                 */
                token: string;

                /**
                 * The log probability of this token, if it is within the top 20
                 * most likely tokens. Otherwise, the value `-9999` is used to
                 * signify that the token is very unlikely.
                 */
                logprob: number;

                /**
                 * A list of integers representing the UTF-8 bytes
                 * representation of the token. Useful in instances where
                 * characters are represented by multiple tokens and their byte
                 * representations must be combined to generate the correct text
                 * representation. Can be `null` if there is no bytes
                 * representation for the token.
                 */
                bytes: number[] | null;

                /**
                 * List of the most likely tokens and their log probability, at
                 * this token position. In rare cases, there may be fewer than
                 * the number of requested `top_logprobs` returned.
                 */
                top_logprobs: {
                  /**
                   * The token.
                   */
                  token: string;

                  /**
                   * The log probability of this token, if it is within the top
                   * 20 most likely tokens. Otherwise, the value `-9999` is used
                   * to signify that the token is very unlikely.
                   */
                  logprob: number;

                  /**
                   * A list of integers representing the UTF-8 bytes
                   * representation of the token. Useful in instances where
                   * characters are represented by multiple tokens and their
                   * byte representations must be combined to generate the
                   * correct text representation. Can be `null` if there is no
                   * bytes representation for the token.
                   */
                  bytes: number[] | null;
                };
              }[]
            | null;
        };
      }[];

      /**
       * The Unix timestamp (in seconds) of when the chat completion was
       * created.
       */
      created: number;

      /**
       * The model used for this chat completion.
       */
      model: string;

      /**
       * The service tier used for processing the request. This field is only
       * included if the `service_tier` parameter is specified in the request.
       */
      service_tier: string | null;

      /**
       * This fingerprint represents the backend configuration that the model
       * runs with.
       *
       * Can be used in conjunction with the `seed` request parameter to
       * understand when backend changes have been made that might impact
       * determinism.
       */
      system_fingerprint: string;

      /**
       * The object type, which is always `chat.completion`.
       */
      object: string;

      /**
       * Usage statistics for the completion request.
       */
      usage: {
        /**
         * Number of tokens in the generated completion.
         */
        completion_tokens: number;

        /**
         * Number of tokens in the prompt.
         */
        prompt_tokens: number;

        /**
         * Total number of tokens used in the request (prompt + completion).
         */
        total_tokens: number;

        /**
         * Breakdown of tokens used in a completion.
         */
        completion_token_details: {
          /**
           * When using Predicted Outputs, the number of tokens in the
           * prediction that appeared in the completion.
           */
          accepted_prediction_tokens: number;

          /**
           * Audio input tokens generated by the model.
           */
          audio_tokens: number;

          /**
           * Tokens generated by the model for reasoning.
           */
          reasoning_tokens: number;

          /**
           * When using Predicted Outputs, the number of tokens in the
           * prediction that did not appear in the completion. However, like
           * reasoning tokens, these tokens are still counted in the total
           * completion tokens for purposes of billing, output, and context
           * window limits.
           */
          rejected_prediction_tokens: number;
        };

        /**
         * Breakdown of tokens used in the prompt.
         */
        prompt_token_details: {
          /**
           * Audio input tokens present in the prompt.
           */
          audio_tokens: number;

          /**
           * Cached tokens present in the prompt.
           */
          cached_tokens: number;
        };
      };
    };
  };
}
