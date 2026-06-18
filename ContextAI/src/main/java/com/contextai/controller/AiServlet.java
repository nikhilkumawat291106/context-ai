package com.contextai.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

import org.json.JSONArray;
import org.json.JSONObject;

import com.contextai.util.GeminiUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class AiServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/plain;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        try {

            StringBuilder jsonBuilder = new StringBuilder();
            BufferedReader reader     = request.getReader();
            String line;

            while ((line = reader.readLine()) != null) {
                jsonBuilder.append(line);
            }

            JSONObject requestJson =
                    new JSONObject(jsonBuilder.toString());

            String prompt = requestJson.optString("prompt", "");
            String mode   = requestJson.optString("mode", "general");

            // Build context string from optional context array
            StringBuilder contextBuilder = new StringBuilder();

            if (requestJson.has("context")) {

                JSONArray contextArr =
                        requestJson.getJSONArray("context");

                for (int i = 0; i < contextArr.length(); i++) {

                    JSONObject msg =
                            contextArr.getJSONObject(i);

                    String sender =
                            msg.optString("sender", "Other");

                    String text =
                            msg.optString("text", "");

                    contextBuilder
                            .append(sender)
                            .append(": ")
                            .append(text)
                            .append("\n");
                }
            }

            if (prompt.trim().isEmpty()
                    && contextBuilder.length() == 0) {

                out.print("Prompt cannot be empty.");
                return;
            }

            String aiResponse = GeminiUtil.askGeminiWithMode(
                    prompt,
                    mode,
                    contextBuilder.toString()
            );

            out.print(aiResponse);

        } catch (Exception e) {

            e.printStackTrace();

            out.print(
                    "Error while processing AI request: "
                            + e.getMessage()
            );
        }
    }

    @Override
    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/plain");
        response.setCharacterEncoding("UTF-8");

        response.getWriter().print(
                "ContextAI Servlet Running Successfully"
        );
    }
}
