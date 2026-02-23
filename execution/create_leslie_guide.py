#!/usr/bin/env python3
"""
Generate a client guide for Leslie Guilbert explaining how to:
  - Share the project via GitHub
  - Set up her own Vercel account
  - Make site modifications with Claude Code
  - Point jinxa.fr (OVH) to her Vercel deployment

Output: .tmp/leslie_guide.html
Usage:  python execution/create_leslie_guide.py
Then:   Open .tmp/leslie_guide.html in Chrome → Ctrl+A → paste into a Google Doc
"""

from datetime import date
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.resolve()
OUTPUT_FILE = PROJECT_ROOT / ".tmp" / "leslie_guide.html"

GUIDE_HTML = """<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Guide — Gérer votre site Jinxa</title>
<style>
  *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}

  body {{
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 15px;
    line-height: 1.7;
    color: #1a1a1a;
    background: #fff;
    max-width: 780px;
    margin: 0 auto;
    padding: 48px 32px 80px;
  }}

  /* ── Header ─────────────────────────────────────── */
  .doc-header {{
    border-bottom: 2px solid #16a34a;
    padding-bottom: 24px;
    margin-bottom: 40px;
  }}
  .doc-header h1 {{
    font-size: 26px;
    font-weight: 700;
    color: #111;
    margin-bottom: 6px;
  }}
  .doc-header .meta {{
    font-size: 13px;
    color: #666;
  }}
  .doc-header .confidential {{
    display: inline-block;
    background: #f0fdf4;
    color: #16a34a;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .05em;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: 4px;
    margin-top: 8px;
  }}

  /* ── Section headings ────────────────────────────── */
  .section {{
    margin-top: 48px;
  }}
  .section-label {{
    display: inline-block;
    background: #16a34a;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 4px;
    margin-bottom: 10px;
  }}
  .section h2 {{
    font-size: 20px;
    font-weight: 700;
    color: #111;
    margin-bottom: 4px;
  }}
  .section .section-subtitle {{
    font-size: 14px;
    color: #555;
    margin-bottom: 20px;
  }}

  /* ── Sub-sections ───────────────────────────────── */
  .subsection {{
    margin-top: 28px;
  }}
  .subsection h3 {{
    font-size: 15px;
    font-weight: 700;
    color: #16a34a;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }}
  .subsection h3::before {{
    content: '';
    display: inline-block;
    width: 3px;
    height: 16px;
    background: #16a34a;
    border-radius: 2px;
  }}

  /* ── Steps ──────────────────────────────────────── */
  ol {{
    padding-left: 0;
    list-style: none;
    counter-reset: steps;
  }}
  ol li {{
    counter-increment: steps;
    display: flex;
    gap: 14px;
    margin-bottom: 14px;
    align-items: flex-start;
  }}
  ol li::before {{
    content: counter(steps);
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 26px;
    height: 26px;
    background: #f0fdf4;
    border: 1.5px solid #16a34a;
    color: #16a34a;
    font-size: 12px;
    font-weight: 700;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 1px;
  }}
  ol li .step-content {{ flex: 1; }}

  ul.plain {{ padding-left: 20px; list-style: disc; }}
  ul.plain li {{ margin-bottom: 6px; color: #444; }}

  /* ── Code ───────────────────────────────────────── */
  code {{
    font-family: 'Fira Mono', 'Cascadia Code', 'Consolas', monospace;
    font-size: 13px;
    background: #f3f4f6;
    color: #b91c1c;
    padding: 1px 5px;
    border-radius: 3px;
  }}
  pre {{
    background: #1e1e2e;
    color: #cdd6f4;
    font-family: 'Fira Mono', 'Cascadia Code', 'Consolas', monospace;
    font-size: 13px;
    line-height: 1.6;
    padding: 16px 20px;
    border-radius: 8px;
    margin: 10px 0 14px;
    overflow-x: auto;
    white-space: pre;
  }}
  pre .comment {{ color: #6c7086; }}
  pre .green {{ color: #a6e3a1; }}
  pre .yellow {{ color: #f9e2af; }}

  /* ── Callouts ───────────────────────────────────── */
  .note {{
    background: #f0fdf4;
    border-left: 3px solid #16a34a;
    padding: 12px 16px;
    border-radius: 0 6px 6px 0;
    font-size: 14px;
    color: #166534;
    margin: 14px 0;
  }}
  .warning {{
    background: #fffbeb;
    border-left: 3px solid #f59e0b;
    padding: 12px 16px;
    border-radius: 0 6px 6px 0;
    font-size: 14px;
    color: #92400e;
    margin: 14px 0;
  }}
  .tip-box {{
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 14px 18px;
    margin: 14px 0;
    font-size: 14px;
    color: #475569;
  }}
  .tip-box strong {{ color: #334155; }}

  /* ── DNS table ──────────────────────────────────── */
  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 14px;
  }}
  th {{
    background: #f1f5f9;
    text-align: left;
    padding: 8px 12px;
    font-weight: 600;
    color: #334155;
    border-bottom: 2px solid #e2e8f0;
  }}
  td {{
    padding: 9px 12px;
    border-bottom: 1px solid #f1f5f9;
    color: #444;
  }}
  td code {{ background: #e8f5e9; color: #166534; }}

  /* ── Footer ─────────────────────────────────────── */
  .doc-footer {{
    margin-top: 64px;
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;
    font-size: 13px;
    color: #9ca3af;
    text-align: center;
  }}

  b {{ font-weight: 600; }}
  a {{ color: #16a34a; text-decoration: none; }}
  a:hover {{ text-decoration: underline; }}
  p {{ margin-bottom: 10px; }}
</style>
</head>
<body>

<!-- ══════════ HEADER ══════════ -->
<div class="doc-header">
  <h1>Gérer votre site Jinxa</h1>
  <div class="meta">Guide pratique — Hébergement, modifications et nom de domaine</div>
  <div class="confidential">Document confidentiel · Jinxa</div>
</div>

<p>Ce guide vous explique comment héberger votre site sur votre propre compte, le modifier en autonomie, et le rendre accessible sur <b>jinxa.fr</b>. Tout est conçu pour que vous puissiez le faire sans aide technique.</p>


<!-- ══════════ PARTIE 0 ══════════ -->
<div class="section">
  <div class="section-label">Partie 0</div>
  <h2>Récupérer le code du site</h2>
  <div class="section-subtitle">À faire une seule fois — avant tout le reste.</div>

  <div class="subsection">
    <h3>Ce que Tom fait de son côté</h3>
    <ol>
      <li><div class="step-content">Sur <a href="https://github.com" target="_blank">github.com</a>, créer un nouveau dépôt <b>privé</b> nommé <code>jinxa-website</code> → cliquer <b>Create repository</b></div></li>
      <li><div class="step-content">Dans le terminal du projet, pousser le code :
        <pre><span class="green">git</span> remote add origin https://github.com/<span class="yellow">[son-username]</span>/jinxa-website.git
<span class="green">git</span> push -u origin main</pre>
      </div></li>
      <li><div class="step-content">Vous inviter comme collaboratrice : <b>Settings → Collaborators → Add people</b> → votre adresse email GitHub</div></li>
    </ol>
    <div class="note">Une fois invitée, vous recevez un email de GitHub. Acceptez l'invitation pour accéder au projet.</div>
  </div>

  <div class="subsection">
    <h3>Ce que vous installez (une seule fois)</h3>
    <ol>
      <li><div class="step-content">Créer un compte sur <a href="https://github.com" target="_blank">github.com</a> si vous n'en avez pas</div></li>
      <li><div class="step-content">Installer <a href="https://git-scm.com/downloads" target="_blank">Git</a> (Windows) — laisser toutes les options par défaut</div></li>
      <li><div class="step-content">Installer <a href="https://nodejs.org/" target="_blank">Node.js</a> (version LTS) — laisser toutes les options par défaut</div></li>
      <li><div class="step-content">Installer <a href="https://python.org/downloads/" target="_blank">Python 3</a> — <b>cocher impérativement "Add Python to PATH"</b> lors de l'installation</div></li>
      <li><div class="step-content">Ouvrir le terminal Windows (touche Windows → taper "cmd" → Entrée) et cloner le projet :
        <pre><span class="green">git</span> clone https://github.com/<span class="yellow">[username-tom]</span>/jinxa-website.git
<span class="green">cd</span> jinxa-website</pre>
        → Un dossier <code>jinxa-website</code> apparaît sur votre ordinateur
      </div></li>
      <li><div class="step-content">Dans VS Code, créer un fichier <code>.env</code> à la racine du dossier avec ce contenu :
        <pre>VERCEL_TOKEN=<span class="comment">← à remplir à l'étape suivante</span>
LESLIE_N8N_URL=https://jinxa.app.n8n.cloud
LESLIE_N8N_API_KEY=<span class="comment">← clé N8N fournie par Tom</span></pre>
      </div></li>
    </ol>
    <div class="warning">Le fichier <code>.env</code> contient vos clés privées. Il n'est jamais envoyé sur GitHub — c'est intentionnel. Ne le partagez pas.</div>
  </div>
</div>


<!-- ══════════ PARTIE 1 ══════════ -->
<div class="section">
  <div class="section-label">Partie 1</div>
  <h2>Créer votre propre espace Vercel</h2>
  <div class="section-subtitle">Vercel est le service qui héberge votre site. Compte gratuit, déploiement en 30 secondes.</div>

  <ol>
    <li><div class="step-content">Créer un compte gratuit sur <a href="https://vercel.com" target="_blank">vercel.com</a> (avec votre email ou votre compte GitHub)</div></li>
    <li><div class="step-content">Aller dans <b>Account Settings → Tokens → Create Token</b> → nommer le token <code>Jinxa</code> → cliquer <b>Create</b> → <b>copier le token affiché</b> (il ne sera visible qu'une seule fois)</div></li>
    <li><div class="step-content">Dans VS Code, ouvrir le fichier <code>.env</code> et coller votre token :
        <pre>VERCEL_TOKEN=<span class="yellow">votre-token-ici</span></pre>
    </div></li>
    <li><div class="step-content">Ouvrir le terminal intégré de VS Code (<b>Ctrl + `</b>) et vérifier que tout est en ordre :
        <pre><span class="green">python</span> execution/setup_vercel.py</pre>
        → Le script vérifie Node.js, installe le CLI Vercel si nécessaire, et confirme votre token
    </div></li>
    <li><div class="step-content">Déployer votre site pour la première fois :
        <pre><span class="green">python</span> execution/deploy_vercel.py --deploy --site jinxa --production</pre>
        → Vercel crée automatiquement un projet <code>jinxa</code> dans votre compte<br>
        → L'URL de votre site s'affiche dans le terminal (ex. <code>https://jinxa.vercel.app</code>)
    </div></li>
  </ol>

  <div class="note">Votre site est maintenant hébergé sur votre propre compte. Tom n'a plus accès à votre déploiement — vous êtes indépendante.</div>
</div>


<!-- ══════════ PARTIE 2 ══════════ -->
<div class="section">
  <div class="section-label">Partie 2</div>
  <h2>Modifier le site avec Claude Code</h2>
  <div class="section-subtitle">Pour toute modification de contenu — textes, services, cas clients, liens Calendly.</div>

  <ol>
    <li><div class="step-content">Ouvrir VS Code dans le dossier <code>jinxa-website</code></div></li>
    <li><div class="step-content">Ouvrir le terminal intégré : <b>Ctrl + `</b> (la touche avec l'accent grave, à gauche du 1)</div></li>
    <li><div class="step-content">Taper <code>claude</code> pour lancer Claude Code, puis Entrée</div></li>
    <li><div class="step-content">Décrire votre modification en langage naturel. Exemples :
      <ul class="plain">
        <li>"<i>Change le titre principal en : Votre nouvelle transformation digitale</i>"</li>
        <li>"<i>Mets à jour le lien Calendly avec cette URL : calendly.com/jinxa/new-link</i>"</li>
        <li>"<i>Dans la section cas clients, mets à jour les résultats de Guide Michelin : +40% au lieu de +30%</i>"</li>
        <li>"<i>Ajoute un nouveau service appelé 'Formation équipe' avec cette description : ...</i>"</li>
        <li>"<i>Mets à jour le system prompt du chatbot pour inclure le nouveau service</i>"</li>
      </ul>
    </div></li>
    <li><div class="step-content">Claude modifie le fichier <code>jinxa.html</code> automatiquement. Vérifier le résultat en ouvrant le fichier dans votre navigateur (double-cliquer sur <code>jinxa.html</code>)</div></li>
    <li><div class="step-content">Si le résultat vous convient, déployer :
        <pre><span class="green">python</span> execution/deploy_vercel.py --deploy --site jinxa --production</pre>
        → Le site est mis à jour en ligne en ~30 secondes
    </div></li>
  </ol>

  <div class="tip-box">
    <strong>Conseil :</strong> Plus votre demande est précise, plus le résultat est correct du premier coup. Mentionnez le nom exact de la section ("section cas clients", "section services") et donnez le nouveau texte directement dans votre message.
  </div>

  <div class="tip-box">
    <strong>Pour le chatbot :</strong> Si vous souhaitez modifier le comportement du chatbot (ajouter un service, mettre à jour les résultats clients, changer le ton), dites simplement à Claude : <i>"Mets à jour le system prompt du chatbot pour..."</i> — il se charge de la modification directement dans N8N.
  </div>
</div>


<!-- ══════════ PARTIE 3 ══════════ -->
<div class="section">
  <div class="section-label">Partie 3</div>
  <h2>Brancher jinxa.fr sur votre site</h2>
  <div class="section-subtitle">Pour que votre site soit accessible sur jinxa.fr au lieu de jinxa.vercel.app. Deux étapes : Vercel puis OVH.</div>

  <div class="subsection">
    <h3>Étape A — Dans Vercel</h3>
    <ol>
      <li><div class="step-content">Se connecter sur <a href="https://vercel.com" target="_blank">vercel.com</a> → ouvrir le projet <b>jinxa</b></div></li>
      <li><div class="step-content">Aller dans <b>Settings → Domains</b></div></li>
      <li><div class="step-content">Cliquer <b>Add</b> → taper <code>jinxa.fr</code> → valider</div></li>
      <li><div class="step-content">Répéter l'opération pour <code>www.jinxa.fr</code></div></li>
      <li><div class="step-content">Vercel affiche les enregistrements DNS à configurer — <b>garder cette page ouverte</b>, vous en avez besoin pour l'étape suivante</div></li>
    </ol>
  </div>

  <div class="subsection">
    <h3>Étape B — Dans OVH</h3>
    <ol>
      <li><div class="step-content">Se connecter sur <a href="https://ovh.com" target="_blank">ovh.com</a> → <b>Manager → Web → Domaines → jinxa.fr → Zone DNS</b></div></li>
      <li><div class="step-content">Créer ou modifier l'enregistrement <b>A</b> pour la racine du domaine :
        <table>
          <tr><th>Champ</th><th>Valeur</th></tr>
          <tr><td>Type</td><td><code>A</code></td></tr>
          <tr><td>Sous-domaine</td><td><code>@</code> ou laisser vide</td></tr>
          <tr><td>Cible</td><td><code>76.76.21.21</code></td></tr>
          <tr><td>TTL</td><td>3600 (ou "par défaut")</td></tr>
        </table>
      </div></li>
      <li><div class="step-content">Créer ou modifier l'enregistrement <b>CNAME</b> pour le sous-domaine www :
        <table>
          <tr><th>Champ</th><th>Valeur</th></tr>
          <tr><td>Type</td><td><code>CNAME</code></td></tr>
          <tr><td>Sous-domaine</td><td><code>www</code></td></tr>
          <tr><td>Cible</td><td><code>cname.vercel-dns.com.</code> <i>(avec le point final)</i></td></tr>
          <tr><td>TTL</td><td>3600 (ou "par défaut")</td></tr>
        </table>
      </div></li>
      <li><div class="step-content">Sauvegarder et patienter <b>24 à 48h</b> pour la propagation DNS (généralement moins de 2h en pratique)</div></li>
    </ol>

    <div class="note">
      <b>Vérification :</b> Taper <code>jinxa.fr</code> dans votre navigateur → votre site apparaît avec le cadenas HTTPS 🔒. Le certificat SSL est géré automatiquement par Vercel, aucune action de votre part.
    </div>

    <div class="warning">
      Si un enregistrement A ou CNAME existe déjà pour <code>@</code> ou <code>www</code> dans OVH (ex. pointant vers un ancien hébergeur), modifiez-le plutôt que d'en créer un nouveau — sinon OVH refusera le doublon.
    </div>
  </div>
</div>


<!-- ══════════ FOOTER ══════════ -->
<div class="doc-footer">
  Généré le {today} · Document confidentiel Jinxa · Pour toute question : contactez Tom
</div>

</body>
</html>
"""


def main():
    output_dir = OUTPUT_FILE.parent
    output_dir.mkdir(parents=True, exist_ok=True)

    today = date.today().strftime("%d %B %Y")
    html = GUIDE_HTML.format(today=today)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"Guide generated: {OUTPUT_FILE}")
    print()
    print("Next steps:")
    print("  1. Open .tmp/leslie_guide.html in Chrome")
    print("  2. Ctrl+A + Ctrl+C (select all + copy)")
    print("  3. Open a blank Google Doc, Ctrl+V (paste)")
    print("  4. Adjust heading styles if needed, then share with Leslie")


if __name__ == "__main__":
    main()
