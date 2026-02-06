---
title: claude code 使用代理
slug: claude-code-router
tags: [技术,claude-code,trea]
keywords: [claude-code,代理,邪修,trea]
date: 2025-12-21
draft: true
---

<!-- truncate -->

## 1.安装依赖
claude-code
```shell
npm install -g @anthropic-ai/claude-code
```
claude-code-router
```shell
npm install -g @musistudio/claude-code-router
```
验证安装
```
ccr -v
```

## 2.配置CCR
创建或编辑 CCR 配置文件（通常位于 `~/.claude-code-router/config.json`）：
```json
{
  "LOG": true,
  "LOG_LEVEL": "debug",
  "CLAUDE_PATH": "",
  "HOST": "127.0.0.1",
  "PORT": 3456,
  "APIKEY": "",
  "API_TIMEOUT_MS": "600000",
  "PROXY_URL": "",
  "transformers": [],
  "Providers": [
    {
      "name": "mindcraft",
      "api_base_url": "https://api.mindcraft.com.cn/v1/chat/completions",
      "api_key": "MC-",
      "models": [
        "claude-sonnet-4-5-20250929",
        "gemini-3-flash-latest",
        "qwen3-max",
        "gpt-5.2",
        "gemini-3-pro-preview",
        "GLM-4.6"
      ],
      "transformer": {
        "use": [
          "openrouter"
        ]
      }
    },
    {
      "name": "siliconflow",
      "api_base_url": "https://api.moonshot.cn/anthropic/",
      "api_key": "sk-c0e7fed7b-你的自定义Key",
      "models": [
        "moonshotai/Kimi-K2-Instruct"
      ]
    }
  ],
  "StatusLine": {
    "enabled": false,
    "currentStyle": "default",
    "default": {
      "modules": []
    },
    "powerline": {
      "modules": []
    }
  },
  "Router": {
    "default": "mindcraft,gemini-3-pro-preview",
    "background": "mindcraft,gemini-3-pro-preview",
    "think": "mindcraft,gpt-5.2",
    "longContext": "mindcraft,gemini-3-pro-preview",
    "longContextThreshold": 60000,
    "webSearch": "mindcraft,gemini-3-pro-preview",
    "image": "mindcraft,gemini-3-pro-preview"
  },
  "CUSTOM_ROUTER_PATH": ""
}
```

## 3.启动 CCR 服务
```
ccr restart
```

也可以在UI中使用

```
ccr ui
```

## 4.配置claude code为本地
直接在trae帮忙即可

```
export ANTHROPIC_BASE_URL="http://127.0.0.1:3456/"
export ANTHROPIC_AUTH_TOKEN="sk-c0e7fed7b-你的自定义Key"
```

## 5.在trae里面使用

1. 安装claude插件
2. 设置改为如下配置

```
{
    "AI.toolcall.v2.ide.mcp.autoRun": "alwaysRun",
    "AI.toolcall.v2.ide.command.mode": "blacklist",
    "workbench.colorTheme": "Deep Blue",
    "workbench.experimental.cloudChanges.autoStore": "onShutdown",
    "editor.fontSize": 18,
    "claudeCode.preferredLocation": "panel",
    "claudeCode.environmentVariables": [
        {
            "name": "ANTHROPIC_BASE_URL",
            "value": "http://127.0.0.1:3456/"
        },
        {
            "name": "ANTHROPIC_API_KEY",
            "value": "MC-"
        }
    ]
}
```