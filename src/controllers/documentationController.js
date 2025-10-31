const fs = require('fs');
const path = require('path');

/**
 * Handler pour la route de documentation racine
 * Affiche le README.md converti en HTML
 */
const documentationHandler = (req, res) => {
  try {
    const readmePath = path.join(__dirname, '../../README.md');
    const readmeContent = fs.readFileSync(readmePath, 'utf8');

    // Template HTML moderne pour afficher le markdown
    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎾 Tennis Players REST API - Documentation</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet">
    <style>
        :root {
            --primary-color: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary-color: #64748b;
            --background: #f8fafc;
            --surface: #ffffff;
            --text-primary: #1e293b;
            --text-secondary: #64748b;
            --border: #e2e8f0;
            --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            --radius: 8px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.7;
            color: var(--text-primary);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem 1rem;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: var(--surface);
            border-radius: 16px;
            box-shadow: var(--shadow);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
            color: white;
            padding: 3rem 2rem;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }

        .quick-links {
            background: #f1f5f9;
            padding: 2rem;
            border-bottom: 1px solid var(--border);
        }

        .quick-links h3 {
            color: var(--text-primary);
            margin-bottom: 1rem;
            font-size: 1.1rem;
            font-weight: 600;
        }

        .links-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }

        .quick-link {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 1.25rem;
            background: white;
            border: 1px solid var(--border);
            border-radius: var(--radius);
            text-decoration: none;
            color: var(--text-primary);
            transition: all 0.2s;
            font-weight: 500;
        }

        .quick-link:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow);
            border-color: var(--primary-color);
        }

        .quick-link .icon {
            font-size: 1.5rem;
        }

        .content {
            padding: 3rem 2rem;
        }

        h1, h2, h3, h4, h5, h6 {
            color: var(--text-primary);
            font-weight: 600;
            margin: 2rem 0 1rem 0;
        }

        h1 { font-size: 2.25rem; border-bottom: 3px solid var(--primary-color); padding-bottom: 0.5rem; }
        h2 { font-size: 1.875rem; border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; }
        h3 { font-size: 1.5rem; }
        h4 { font-size: 1.25rem; }

        p {
            margin: 1rem 0;
            color: var(--text-secondary);
        }

        pre {
            background: #1e293b;
            color: #e2e8f0;
            padding: 1.5rem;
            border-radius: var(--radius);
            overflow-x: auto;
            margin: 1.5rem 0;
            font-family: 'JetBrains Mono', 'Fira Code', monospace;
            font-size: 0.9rem;
            line-height: 1.5;
        }

        code {
            background: #f1f5f9;
            color: var(--primary-color);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-family: 'JetBrains Mono', 'Fira Code', monospace;
            font-size: 0.9em;
        }

        pre code {
            background: transparent;
            color: inherit;
            padding: 0;
        }

        ul, ol {
            margin: 1rem 0;
            padding-left: 2rem;
        }

        li {
            margin: 0.5rem 0;
            color: var(--text-secondary);
        }

        strong {
            color: var(--text-primary);
            font-weight: 600;
        }

        em {
            color: var(--text-secondary);
            font-style: italic;
        }

        @media (max-width: 768px) {
            body { padding: 1rem; }
            .header { padding: 2rem 1rem; }
            .header h1 { font-size: 1.875rem; }
            .content { padding: 2rem 1rem; }
            .quick-links { padding: 1.5rem 1rem; }
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎾 Tennis Players REST API</h1>
            <p>Documentation complète de l'API</p>
        </div>
        
        <div class="quick-links">
            <h3>� Accès Rapide</h3>
            <div class="links-grid">
                <a href="/api/players" class="quick-link" target="_blank">
                    <span class="icon">�</span>
                    <span>Liste des Joueurs</span>
                </a>
                <a href="/api-docs" class="quick-link" target="_blank">
                    <span class="icon">�</span>
                    <span>Documentation Swagger</span>
                </a>
                <a href="/api/players/analytics/countries" class="quick-link" target="_blank">
                    <span class="icon">📊</span>
                    <span>Analytics Pays</span>
                </a>
            </div>
        </div>
        
        <div class="content">
            <div id="readme-content"></div>
        </div>
    </div>
    <script>
        // Conversion markdown améliorée en HTML
        let content = ${JSON.stringify(readmeContent)};
        
        // Conversion des éléments markdown
        content = content
            // Titres
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Blocs de code
            .replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, '<pre><code>$1</code></pre>')
            // Code inline
            .replace(/\`([^\`]*)\`/g, '<code>$1</code>')
            // Gras et italique
            .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
            .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
            // Liens
            .replace(/\\[([^\\]]+)\\]\\(([^\\)]+)\\)/g, '<a href="$2" target="_blank">$1</a>')
            // Listes
            .replace(/^\\s*\\* (.*)$/gim, '<li>$1</li>')
            .replace(/^\\s*- (.*)$/gim, '<li>$1</li>')
            // Regrouper les éléments de liste
            .replace(/((<li>.*<\\/li>\\s*)+)/g, '<ul>$1</ul>')
            // Sauts de ligne
            .replace(/\\n\\n/g, '</p><p>')
            .replace(/\\n/g, '<br>');
        
        // Envelopper dans des paragraphes si nécessaire
        content = '<p>' + content + '</p>';
        content = content.replace(/<p><\\/p>/g, '');
        content = content.replace(/<p>(<h[1-6]>)/g, '$1');
        content = content.replace(/(<\\/h[1-6]>)<\\/p>/g, '$1');
        content = content.replace(/<p>(<ul>)/g, '$1');
        content = content.replace(/(<\\/ul>)<\\/p>/g, '$1');
        content = content.replace(/<p>(<pre>)/g, '$1');
        content = content.replace(/(<\\/pre>)<\\/p>/g, '$1');
        
        document.getElementById('readme-content').innerHTML = content;
        
        // Animation d'apparition progressive
        const elements = document.querySelectorAll('.content h1, .content h2, .content h3, .content p, .content ul, .content pre');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    </script>
</body>
</html>`;

    res.send(htmlContent);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement de la documentation',
      error: error.message,
    });
  }
};

module.exports = documentationHandler;
