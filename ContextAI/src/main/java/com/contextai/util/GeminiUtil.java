package com.contextai.util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONArray;
import org.json.JSONObject;

public class GeminiUtil {

    /*
     * =====================================================
     * PASTE YOUR GEMINI API KEY BELOW
     * Get one free at: https://aistudio.google.com/app/apikey
     * =====================================================
     */
    private static final String API_KEY =
            "AQ.Ab8RN6Jk6vjDJI81ikqZQwb1XI_sBMQADPPXGqSIShlI0halkg";

    /*
     * Gemini Model
     */
    private static final String MODEL =
            "gemini-2.5-flash";

    // =============================================
    // MODE-AWARE ENTRY POINT
    // =============================================

    public static String askGeminiWithMode(
            String userPrompt,
            String mode,
            String context) {

        String fullPrompt = buildPromptForMode(
                userPrompt, mode, context
        );

        return callGemini(fullPrompt);
    }

    // =============================================
    // LEGACY ENTRY POINT (backward compatibility)
    // =============================================

    public static String askGemini(String prompt) {

        String fullPrompt =
                "You are ContextAI. "
                        + "Return only the final answer. "
                        + "Do not say 'Here is the answer'. "
                        + "Do not add greetings. "
                        + "Do not add closing remarks.\n\n"
                        + prompt;

        return callGemini(fullPrompt);
    }

    // =============================================
    // PROMPT BUILDER — mode-specific
    // =============================================

    private static String buildPromptForMode(
            String userPrompt,
            String mode,
            String context) {

        switch (mode) {

            case "reply":
                /*
                 * Generate 4 context-aware reply chips.
                 * Returns strict JSON: {polite, savage, funny, neutral}
                 */
                return "You are ContextAI, an AI chat assistant "
                        + "specializing in Hinglish and English messaging.\n"
                        + "Based on the conversation context below, "
                        + "generate EXACTLY 4 short reply options.\n"
                        + "Return ONLY a valid JSON object in this EXACT format — "
                        + "no markdown, no explanation, just raw JSON:\n"
                        + "{\"polite\":\"...\",\"savage\":\"...\","
                        + "\"funny\":\"...\",\"neutral\":\"...\"}\n\n"
                        + "Rules:\n"
                        + "- Each reply max 12 words\n"
                        + "- Match the language style (Hinglish/English/Hindi) "
                        + "of the conversation\n"
                        + "- 'savage' must be witty/sarcastic, not abusive\n"
                        + "- 'funny' must be genuinely humorous or use an emoji\n"
                        + "- 'polite' must be warm and respectful\n"
                        + "- 'neutral' must be a simple, direct response\n\n"
                        + "Conversation Context:\n"
                        + context;

            case "slang":
                /*
                 * Decode slang/abuse/word.
                 * Returns strict JSON with word details.
                 */
                return "You are ContextAI. "
                        + "Decode this word or phrase: \""
                        + userPrompt + "\"\n"
                        + "Return ONLY a valid JSON object in this EXACT format — "
                        + "no markdown, no extra text, just raw JSON:\n"
                        + "{\"word\":\"...\",\"meaning\":\"...\","
                        + "\"intensity\":\"mild\",\"cultural_context\":\"...\","
                        + "\"safe_to_use\":true}\n\n"
                        + "Rules:\n"
                        + "- intensity must be exactly one of: mild, moderate, extreme\n"
                        + "- Focus on Indian/South Asian slang, internet culture, "
                        + "and Hinglish usage\n"
                        + "- safe_to_use: true if OK in casual chat, false if "
                        + "offensive/explicit\n"
                        + "- cultural_context: brief note on origin or usage context";

            case "explain":
                /*
                 * Explain selected text in simple language.
                 */
                return "You are ContextAI. Explain the following in "
                        + "simple, clear language in 2-3 short sentences.\n"
                        + "Be direct. No greetings. No markdown formatting.\n\n"
                        + (context.isEmpty()
                                ? userPrompt
                                : "Context: " + context
                                        + "\n\nText to explain: "
                                        + userPrompt);

            case "grammar":
                return "Correct only the grammar and spelling of this message. "
                        + "Return only the corrected message, nothing else:\n\n"
                        + userPrompt;

            case "formal":
                return "Convert this message into a formal, professional tone. "
                        + "Return only the converted message, nothing else:\n\n"
                        + userPrompt;

            case "shorten":
                return "Shorten this message while keeping the core meaning. "
                        + "Return only the shortened version, nothing else:\n\n"
                        + userPrompt;

            case "factcheck":
                return "Fact check this statement. "
                        + "Answer in this exact format:\n"
                        + "True / False / Partially True\n"
                        + "[One line explanation]\n\n"
                        + userPrompt;

            case "translate_smart":
                /*
                 * Enhanced cultural translation.
                 * userPrompt format: "targetLanguage|textToTranslate"
                 */
                String[] parts = userPrompt.split("\\|", 2);
                String targetLang  = parts.length > 0
                        ? parts[0].trim() : "English";
                String srcText     = parts.length > 1
                        ? parts[1].trim() : userPrompt;

                return "You are ContextAI, a culturally-aware translator. "
                        + "Translate the following text into "
                        + targetLang + ".\n"
                        + "Preserve:\n"
                        + "- Original tone and emotion\n"
                        + "- Humor and sarcasm\n"
                        + "- Cultural references (adapt, don't remove)\n"
                        + "- Hinglish code-switching spirit where applicable\n"
                        + "Return ONLY the translated text, no explanations:\n\n"
                        + srcText;

            default:
                /*
                 * General / askai — existing behavior
                 */
                return "You are ContextAI. "
                        + "Return only the final answer. "
                        + "Do not say 'Here is the answer'. "
                        + "Do not add greetings. "
                        + "Do not add closing remarks.\n\n"
                        + userPrompt;
        }
    }

    // =============================================
    // CORE GEMINI API CALL
    // =============================================

    private static String callGemini(String prompt) {

        try {

            String endpoint =
                    "https://generativelanguage.googleapis.com/v1beta/models/"
                            + MODEL
                            + ":generateContent?key="
                            + API_KEY;

            URL url = new URL(endpoint);

            HttpURLConnection connection =
                    (HttpURLConnection) url.openConnection();

            connection.setRequestMethod("POST");
            connection.setRequestProperty(
                    "Content-Type", "application/json"
            );
            connection.setDoOutput(true);
            connection.setConnectTimeout(15000);
            connection.setReadTimeout(30000);

            JSONObject requestBody = new JSONObject();
            JSONArray contents     = new JSONArray();
            JSONObject content     = new JSONObject();
            JSONArray parts        = new JSONArray();
            JSONObject part        = new JSONObject();

            part.put("text", prompt);
            parts.put(part);
            content.put("parts", parts);
            contents.put(content);
            requestBody.put("contents", contents);

            OutputStream os = connection.getOutputStream();
            os.write(
                    requestBody.toString().getBytes("UTF-8")
            );
            os.flush();
            os.close();

            int responseCode = connection.getResponseCode();

            BufferedReader reader;

            if (responseCode >= 200 && responseCode < 300) {

                reader = new BufferedReader(
                        new InputStreamReader(
                                connection.getInputStream(),
                                "UTF-8"
                        )
                );

            } else {

                reader = new BufferedReader(
                        new InputStreamReader(
                                connection.getErrorStream(),
                                "UTF-8"
                        )
                );
            }

            StringBuilder responseBuilder = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                responseBuilder.append(line);
            }

            reader.close();

            String responseString = responseBuilder.toString();

            if (responseCode != 200) {
                return "Gemini API Error: " + responseString;
            }

            JSONObject responseJson =
                    new JSONObject(responseString);

            JSONArray candidates =
                    responseJson.getJSONArray("candidates");

            if (candidates.length() == 0) {
                return "No AI response generated.";
            }

            JSONObject firstCandidate =
                    candidates.getJSONObject(0);

            JSONObject contentObj =
                    firstCandidate.getJSONObject("content");

            JSONArray responseParts =
                    contentObj.getJSONArray("parts");

            if (responseParts.length() == 0) {
                return "No AI response generated.";
            }

            String finalResponse =
                    responseParts.getJSONObject(0)
                                 .getString("text");

            // Strip markdown code fences if Gemini wrapped JSON in them
            finalResponse = finalResponse.trim();

            if (finalResponse.startsWith("```")) {
                finalResponse = finalResponse
                        .replaceAll("^```[a-zA-Z]*\\n?", "")
                        .replaceAll("\\n?```$", "")
                        .trim();
            }

            return finalResponse;

        } catch (Exception e) {

            e.printStackTrace();

            return "AI Error: " + e.getMessage();
        }
    }
}
