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
 * =====================================================
 */
private static final String API_KEY =
        "AQ.Ab8RN6Jk6vjDJI81ikqZQwb1XI_sBMQADPPXGqSIShlI0halkg";

/*
 * Gemini Model
 */
private static final String MODEL =
        "gemini-2.5-flash";

public static String askGemini(String prompt) {

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
                "Content-Type",
                "application/json"
        );
        connection.setDoOutput(true);

        JSONObject requestBody =
                new JSONObject();

        JSONArray contents =
                new JSONArray();

        JSONObject content =
                new JSONObject();

        JSONArray parts =
                new JSONArray();

        JSONObject part =
                new JSONObject();

        /*
         * Direct answer instruction
         */
        part.put(
                "text",
                "You are ContextAI. "
                        + "Return only the final answer. "
                        + "Do not say 'Here is the answer'. "
                        + "Do not add greetings. "
                        + "Do not add closing remarks.\n\n"
                        + prompt
        );

        parts.put(part);

        content.put("parts", parts);

        contents.put(content);

        requestBody.put(
                "contents",
                contents
        );

        OutputStream os =
                connection.getOutputStream();

        os.write(
                requestBody
                        .toString()
                        .getBytes("UTF-8")
        );

        os.flush();
        os.close();

        int responseCode =
                connection.getResponseCode();

        BufferedReader reader;

        if (responseCode >= 200
                && responseCode < 300) {

            reader =
                    new BufferedReader(
                            new InputStreamReader(
                                    connection.getInputStream(),
                                    "UTF-8"
                            )
                    );

        } else {

            reader =
                    new BufferedReader(
                            new InputStreamReader(
                                    connection.getErrorStream(),
                                    "UTF-8"
                            )
                    );
        }

        StringBuilder responseBuilder =
                new StringBuilder();

        String line;

        while ((line = reader.readLine()) != null) {

            responseBuilder.append(line);
        }

        reader.close();

        String responseString =
                responseBuilder.toString();

        if (responseCode != 200) {

            return "Gemini API Error : "
                    + responseString;
        }

        JSONObject responseJson =
                new JSONObject(responseString);

        JSONArray candidates =
                responseJson.getJSONArray(
                        "candidates"
                );

        if (candidates.length() == 0) {

            return "No AI response generated.";
        }

        JSONObject firstCandidate =
                candidates.getJSONObject(0);

        JSONObject contentObj =
                firstCandidate.getJSONObject(
                        "content"
                );

        JSONArray responseParts =
                contentObj.getJSONArray(
                        "parts"
                );

        if (responseParts.length() == 0) {

            return "No AI response generated.";
        }

        String finalResponse =
                responseParts
                        .getJSONObject(0)
                        .getString("text");

        return finalResponse.trim();

    } catch (Exception e) {

        e.printStackTrace();

        return "AI Error : "
                + e.getMessage();
    }
}

}
