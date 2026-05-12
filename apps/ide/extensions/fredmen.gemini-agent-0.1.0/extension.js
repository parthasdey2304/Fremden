const vscode = require('vscode');

const MAX_CONTEXT_CHARS = 12000;

const getConfigValue = (config, key, envKey) => {
  const inspection = config.inspect(key);
  const hasUserValue = Boolean(
    inspection &&
      (inspection.globalValue !== undefined ||
        inspection.workspaceValue !== undefined ||
        inspection.workspaceFolderValue !== undefined),
  );
  const configuredValue = config.get(key);
  const envValue = process.env[envKey];

  if (hasUserValue) {
    return configuredValue;
  }

  return envValue || configuredValue;
};

const buildPrompt = (prompt, fileContext) => {
  if (!fileContext) {
    return prompt;
  }

  const truncationNote = fileContext.truncated
    ? `\n\n[File content truncated to ${MAX_CONTEXT_CHARS} characters]\n`
    : '\n\n';

  return `${prompt}\n\n---\nActive File: ${fileContext.path}${truncationNote}${fileContext.content}`;
};

const getActiveFileContext = () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return null;
  }

  const document = editor.document;
  const fullText = document.getText();
  const truncated = fullText.length > MAX_CONTEXT_CHARS;
  const content = truncated ? fullText.slice(0, MAX_CONTEXT_CHARS) : fullText;

  return {
    path: document.uri.fsPath || document.uri.toString(),
    content,
    truncated,
  };
};

const requestGemini = async ({ prompt, proxyUrl, model }) => {
  if (typeof fetch !== 'function') {
    throw new Error('Fetch API is not available in the extension host.');
  }

  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload?.error || `Gemini request failed (${response.status}).`;
    throw new Error(message);
  }

  return payload?.text || '';
};

const getWebviewHtml = (webview, includeFileContext) => {
  const nonce = String(Date.now());

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Gemini Agent</title>
      <style>
        body { font-family: sans-serif; margin: 0; padding: 16px; color: var(--vscode-foreground); }
        .row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
        textarea { width: 100%; height: 140px; resize: vertical; }
        button { padding: 6px 12px; }
        #response { white-space: pre-wrap; background: var(--vscode-editor-background); border: 1px solid var(--vscode-editorGroup-border); padding: 12px; min-height: 120px; }
        #status { margin-top: 8px; color: var(--vscode-descriptionForeground); }
      </style>
    </head>
    <body>
      <h2>Gemini Agent</h2>
      <textarea id="prompt" placeholder="Ask Gemini about the codebase..."></textarea>
      <div class="row">
        <button id="send">Send</button>
        <label>
          <input type="checkbox" id="include-file" ${includeFileContext ? 'checked' : ''} />
          Include active file context
        </label>
      </div>
      <div id="response"></div>
      <div id="status"></div>
      <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        const promptEl = document.getElementById('prompt');
        const responseEl = document.getElementById('response');
        const statusEl = document.getElementById('status');
        const includeFileEl = document.getElementById('include-file');
        const sendButton = document.getElementById('send');

        const setStatus = (text) => { statusEl.textContent = text || ''; };

        sendButton.addEventListener('click', () => {
          const prompt = promptEl.value.trim();
          if (!prompt) {
            setStatus('Enter a prompt to send.');
            return;
          }
          setStatus('Sending request...');
          responseEl.textContent = '';
          vscode.postMessage({ type: 'sendPrompt', prompt, includeFileContext: includeFileEl.checked });
        });

        window.addEventListener('message', (event) => {
          const message = event.data;
          if (message.type === 'response') {
            responseEl.textContent = message.text || '(empty response)';
            setStatus('');
          }
          if (message.type === 'error') {
            responseEl.textContent = '';
            setStatus(message.text || 'Gemini request failed.');
          }
        });
      </script>
    </body>
  </html>`;
};

const openChatPanel = (context) => {
  const panel = vscode.window.createWebviewPanel(
    'geminiAgentChat',
    'Gemini Agent',
    vscode.ViewColumn.Beside,
    { enableScripts: true },
  );

  const config = vscode.workspace.getConfiguration('geminiAgent');
  const includeFileContext = Boolean(config.get('includeFileContext'));

  panel.webview.html = getWebviewHtml(panel.webview, includeFileContext);

  panel.webview.onDidReceiveMessage(async (message) => {
    if (message.type !== 'sendPrompt') {
      return;
    }

    const prompt = String(message.prompt || '').trim();
    if (!prompt) {
      panel.webview.postMessage({ type: 'error', text: 'Prompt cannot be empty.' });
      return;
    }

    const resolvedConfig = vscode.workspace.getConfiguration('geminiAgent');
    const proxyUrl = getConfigValue(resolvedConfig, 'proxyUrl', 'GEMINI_PROXY_URL');
    const model = getConfigValue(resolvedConfig, 'model', 'GEMINI_DEFAULT_MODEL');
    const includeContext = Boolean(message.includeFileContext);
    const fileContext = includeContext ? getActiveFileContext() : null;
    const finalPrompt = buildPrompt(prompt, fileContext);

    try {
      const response = await requestGemini({ prompt: finalPrompt, proxyUrl, model });
      panel.webview.postMessage({ type: 'response', text: response });
    } catch (error) {
      panel.webview.postMessage({ type: 'error', text: error.message || 'Gemini request failed.' });
    }
  }, undefined, context.subscriptions);
};

const explainSelection = async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('Open a file to use Gemini.');
    return;
  }

  const selection = editor.selection;
  const selectedText = editor.document.getText(selection);

  if (!selectedText) {
    vscode.window.showWarningMessage('Select code to explain.');
    return;
  }

  const config = vscode.workspace.getConfiguration('geminiAgent');
  const proxyUrl = getConfigValue(config, 'proxyUrl', 'GEMINI_PROXY_URL');
  const model = getConfigValue(config, 'model', 'GEMINI_DEFAULT_MODEL');
  const output = vscode.window.createOutputChannel('Gemini Agent');
  const prompt = `Explain the following code:\n\n${selectedText}`;

  output.appendLine('Sending selection to Gemini...');
  output.show(true);

  try {
    const response = await requestGemini({ prompt, proxyUrl, model });
    output.appendLine(response || '(empty response)');
  } catch (error) {
    output.appendLine(`Error: ${error.message || 'Gemini request failed.'}`);
  }
};

class GeminiCodeActionProvider {
  provideCodeActions() {
    const action = new vscode.CodeAction('Gemini: Explain Selection', vscode.CodeActionKind.Refactor);
    action.command = {
      command: 'geminiAgent.explainSelection',
      title: 'Gemini: Explain Selection',
    };
    return [action];
  }
}

const activate = (context) => {
  context.subscriptions.push(
    vscode.commands.registerCommand('geminiAgent.openChat', () => openChatPanel(context)),
    vscode.commands.registerCommand('geminiAgent.explainSelection', explainSelection),
    vscode.languages.registerCodeActionsProvider(
      { scheme: 'file' },
      new GeminiCodeActionProvider(),
      { providedCodeActionKinds: [vscode.CodeActionKind.Refactor] },
    ),
  );
};

const deactivate = () => {};

module.exports = {
  activate,
  deactivate,
};
