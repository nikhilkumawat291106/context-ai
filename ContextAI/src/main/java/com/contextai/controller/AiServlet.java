package com.contextai.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

import org.json.JSONObject;

import com.contextai.util.GeminiUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

//@WebServlet("/ai")
public class AiServlet extends HttpServlet {

private static final long serialVersionUID = 1L;

@Override
protected void doPost(HttpServletRequest request,
                      HttpServletResponse response)
        throws ServletException, IOException {

    response.setContentType("text/plain");
    response.setCharacterEncoding("UTF-8");

    PrintWriter out = response.getWriter();

    try {

        StringBuilder jsonBuilder =
                new StringBuilder();

        BufferedReader reader =
                request.getReader();

        String line;

        while ((line = reader.readLine()) != null) {

            jsonBuilder.append(line);
        }

        JSONObject requestJson =
                new JSONObject(
                        jsonBuilder.toString()
                );

        String prompt =
                requestJson.optString(
                        "prompt",
                        ""
                );

        if (prompt.trim().isEmpty()) {

            out.print(
                    "Prompt cannot be empty."
            );

            return;
        }

        String aiResponse =
                GeminiUtil.askGemini(
                        prompt
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
