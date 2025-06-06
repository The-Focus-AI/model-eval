import { BaseModelRunner } from "../src/models/runner.js";
import { ModelDetails, ModelResponse } from "../src/models/types.js";
import { Conversation } from "../src/conversation/conversation.js";
import { evaluate } from "../src/evaluation/evaluate.js";

export async function catPoem(model: ModelDetails): Promise<ModelResponse> {
  const systemPrompt = "You are a helpful assistant that writes short poems about cats.";
  const prompt = "Write a short poem about a cat.";

  const modelRunner = new BaseModelRunner();
  const conversation = new Conversation(model, systemPrompt);
  conversation.addMessage({
    role: "user",
    content: prompt,
  });

  console.log(`Generating text for ${model.name} using BaseModelRunner...`);
  // console.log(JSON.stringify(conversation, null, 2));
  const response = await modelRunner.generateText(conversation);

  console.log(`Generated text for ${model.name}:`, response.content);

  return response;
}

evaluate(catPoem, "cat-poem", {
  name: "gemma3:latest",
  provider: "ollama",
  temperature: 0.5,
},5);

evaluate(catPoem, "cat-poem", {
  name: "gemma3:12b",
  provider: "ollama",
  temperature: 0.5,
},5);


evaluate(catPoem, "cat-poem", {
  name: "gemini-2.0-flash",
  provider: "google",
});

evaluate(catPoem, "cat-poem", {
  name: "gemini-2.5-pro-exp-03-25",
  provider: "google",
});
