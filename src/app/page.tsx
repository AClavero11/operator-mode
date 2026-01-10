'use client';

import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

type FormData = {
  userName: string;
  companyName: string;
  companyAbbrev: string;
  companyAddress: string;
  companyPhone: string;
  companyDomain: string;
  industry: string;
  cloudProvider: string;
  primaryDb: string;
  hasBot: boolean;
  botPlatform: string;
  customProtocols: string[];
  preferences: string[];
};

const INDUSTRIES = [
  { value: 'aerospace', label: 'Aerospace & Defense' },
  { value: 'saas', label: 'SaaS / Software' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'fintech', label: 'Fintech' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'agency', label: 'Agency / Consulting' },
  { value: 'other', label: 'Other' },
];

const CLOUD_PROVIDERS = [
  { value: 'aws', label: 'AWS' },
  { value: 'gcp', label: 'Google Cloud' },
  { value: 'azure', label: 'Azure' },
  { value: 'vercel', label: 'Vercel' },
  { value: 'fly', label: 'Fly.io' },
  { value: 'none', label: 'None / Self-hosted' },
];

const DATABASES = [
  { value: 'postgres', label: 'PostgreSQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'mongodb', label: 'MongoDB' },
  { value: 'supabase', label: 'Supabase' },
  { value: 'planetscale', label: 'PlanetScale' },
  { value: 'none', label: 'None' },
];

const BOT_PLATFORMS = [
  { value: 'telegram', label: 'Telegram' },
  { value: 'slack', label: 'Slack' },
  { value: 'discord', label: 'Discord' },
  { value: 'none', label: 'None' },
];

const PREFERENCES = [
  { value: 'data_over_opinions', label: 'Data over opinions' },
  { value: 'why_not_what', label: 'WHY, not just WHAT' },
  { value: 'autonomous', label: 'Autonomous execution' },
  { value: 'signal_noise', label: 'Signal over noise' },
  { value: 'no_handbacks', label: 'Do everything - no handbacks' },
  { value: 'query_backed', label: 'Query-backed assertions' },
  { value: 'ev_analysis', label: 'EV analysis on decisions' },
  { value: 'speed_first', label: 'Speed over perfection' },
];

export default function Home() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    userName: '',
    companyName: '',
    companyAbbrev: '',
    companyAddress: '',
    companyPhone: '',
    companyDomain: '',
    industry: '',
    cloudProvider: '',
    primaryDb: '',
    hasBot: false,
    botPlatform: '',
    customProtocols: [],
    preferences: ['autonomous', 'no_handbacks'],
  });

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePreference = (pref: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter(p => p !== pref)
        : [...prev.preferences, pref],
    }));
  };

  const generateClaudeMd = () => {
    const prefs = formData.preferences.map(p => {
      const found = PREFERENCES.find(pref => pref.value === p);
      return found ? `- ${found.label}` : '';
    }).filter(Boolean).join('\n');

    const cloudSection = formData.cloudProvider !== 'none' ? `
### Cloud Provider (${formData.cloudProvider.toUpperCase()})
| Resource | Value |
|----------|-------|
| Instance ID | \`YOUR_INSTANCE_ID\` |
| Region | \`YOUR_REGION\` |
| Storage | \`YOUR_BUCKET_OR_STORAGE\` |
` : '';

    const dbSection = formData.primaryDb !== 'none' ? `
### Database (${formData.primaryDb})
| Field | Value |
|-------|-------|
| Host | \`YOUR_DB_HOST\` |
| Database | \`YOUR_DB_NAME\` |
| User | \`YOUR_DB_USER\` |
| Password | \`YOUR_DB_PASS\` |
` : '';

    const botSection = formData.hasBot && formData.botPlatform !== 'none' ? `
### Bot (${formData.botPlatform})
| Field | Value |
|-------|-------|
| Token | \`YOUR_BOT_TOKEN\` |
| API Key | \`YOUR_API_KEY\` |
| Chat/Channel IDs | \`YOUR_CHAT_IDS\` |
` : '';

    return `# CLAUDE.md - ${formData.userName}

> Lean core instructions. Reference files loaded on-demand.

---

## Company Identity

**${formData.companyName}** (${formData.companyAbbrev})
- Location: ${formData.companyAddress || '[Your Address]'}
- Domain: ${formData.companyDomain || '[domain.com]'} | Phone: ${formData.companyPhone || '[number]'}

---

## The Honor Code

1. **Debug Before Code** - Read existing code first
2. **Do No Harm** - No vulnerabilities, no data loss
3. **+EV Outcomes** - Uncertain? Investigate. Risky? Validate.
4. **Ground Output** - Explain what was created, how to use it
5. **Fact-Based Only** - REAL data, never fabricate
6. **Downside First** - Risk before action on production/finances
7. **Optimal Sequencing** - Irreversible steps LAST
8. **DIG DEEPER** - Before flagging anomalies, RUN THE QUERY
9. **Kill -EV Fast** - No sunk cost. Map blast radius before changes.
10. **Hunt Asymmetric Upside** - Massive upside + zero downside = ship immediately

**Asymmetric Standard:** Upside meaningful | Downside zero | Effort: minutes
**Examples:** Missing index, bare \`except:\`, hardcoded->configurable, repeated->DRY, missing logs

---

## Behavioral Protocols

### Language: Imperative, Not Suggestive
| Don't | Do |
|-------|-----|
| "You might want to" | "When you" |
| "Consider doing X" | "Do X" |
| "I recommend" | [just state it] |

### Momentum Triggers
- **Post-win:** "You're hot. Next up..."
- **Streaks:** "That's 3 straight. Keep it going..."
- **Stale:** "This is walking if you don't act today"

### Framing
Loss > Gain | Specific > Vague | Continuation > Fresh | Assumptive > Permissive

### When NOT to Push
After explicit "no" | Personal/family time | Processing bad news (space, then redirect)

### Decision Protocol
**Core:** Indecision = enemy. Research informs, intuition decides.
1. **Surface** - Identify decision, gather facts
2. **Frame** - 2-3 options with tradeoffs (not 10)
3. **Push** - "Which way?"
4. **Escalate** - No decision? -> [Your notification channel]
5. **Close** - Record, execute

**Anti-patterns:** "Let me know when you decide" | "We can revisit" | 5+ options | Research loops

### Hunger Protocol
**Core:** Keep the bar high. No sycophancy.
| Situation | Don't | Do |
|-----------|-------|-----|
| Good outcome | "Amazing!" | "Good. Capitalize." |
| Win streak | "You're on fire!" | "Three straight. Don't let up." |
| Accomplishment | "Impressive!" | "Solid. What's next level?" |

### Lock In Protocol
**Trigger:** "lock in" on any object -> 3-5 iterations, 5x improvement each, transformational not incremental

---

## Execution Mode

- Proceed autonomously, end-to-end
- Do everything - don't hand work back
- Ask for access, not instructions
- NEVER ask user to do manually what API/credentials can do

---

## Credentials

<!--
SECURITY: Fill in YOUR credentials below.
NEVER commit this file with real credentials to a public repo.
Consider using environment variables or a secrets manager.
-->
${cloudSection}${dbSection}${botSection}
### External APIs
| Service | Credentials |
|---------|-------------|
| [Service 1] | \`YOUR_API_KEY\` |
| [Service 2] | \`YOUR_CLIENT_ID\` / \`YOUR_SECRET\` |

---

## Quick Commands

\`\`\`bash
# Database access${formData.primaryDb === 'postgres' ? `
PGPASSWORD='YOUR_PASS' psql -h YOUR_HOST -U YOUR_USER -d YOUR_DB` : formData.primaryDb === 'mysql' ? `
mysql -h YOUR_HOST -u YOUR_USER -p YOUR_DB` : `
# Add your database connection command`}

# SSH/Remote access
ssh -i ~/.ssh/your_key user@YOUR_HOST

# Deploy
# cd ~/your_project && [your deploy commands]

# Logs
# [your log commands]
\`\`\`

---

## Schema Notes

### Gotchas
| Issue | Wrong | Right |
|-------|-------|-------|
| [Field naming] | \`wrong_field\` | \`correct_field\` |
| [Data format] | \`json->>'key'\` | \`plain_text\` |
| [Filters] | Include all | \`WHERE active = true\` |

### Common Queries
\`\`\`sql
-- Add your frequently used queries here
SELECT * FROM your_table WHERE condition;
\`\`\`

---

## Your Preferences

${prefs}

---

## Key Locations

| Path | Purpose |
|------|---------|
| \`~/your_project/\` | Main codebase |
| \`~/.claude/sessions/\` | Session library |
| \`~/.claude/ref/\` | Reference files |

---

## Session Protocol

Sessions auto-save to \`~/.claude/sessions/\`. Say:
- "save session: [title]" - Archive current work
- "continue [name]" - Resume a session
- "check session history" - See past sessions

---

## Privacy

- No training on conversations
- No sharing to other users/sessions
- Owner controls all data
`;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    const zip = new JSZip();

    // Main CLAUDE.md
    zip.file('CLAUDE.md', generateClaudeMd());

    // Directory structure
    const claudeDir = zip.folder('.claude');
    const sessionsDir = claudeDir?.folder('sessions');
    const refDir = claudeDir?.folder('ref');
    const statusDir = claudeDir?.folder('status');

    // Session index
    sessionsDir?.file('SESSION_INDEX.md', `# Session Library

> Auto-save location for Claude Code sessions

## Recent Sessions

| Date | Title | Summary |
|------|-------|---------|
| [Date] | [Title] | [Summary] |

## How to Use

- "save session: [title]" - Archive current work
- "continue [name]" - Resume a session
- "check session history" - See past sessions
`);

    // Reference files based on industry
    refDir?.file('README.md', `# Reference Files

Store domain-specific knowledge here. Pull on-demand with:
\`@import ~/.claude/ref/filename.md\`

## Suggested Files

- \`schema-notes.md\` - Database quirks and common queries
- \`api-docs.md\` - External API documentation
- \`business-context.md\` - Domain knowledge
- \`customer-intel.md\` - Customer information
`);

    // Status file
    statusDir?.file('CURRENT_SPRINT.md', `# Current Sprint

> Update this file to track active work

## Active

- [ ] [Task 1]
- [ ] [Task 2]

## Completed

- [x] Initial setup

## Blocked

(none)
`);

    // Setup instructions
    zip.file('SETUP.md', `# Operator Mode Setup

## Installation

1. Move \`CLAUDE.md\` to your home directory (\`~/CLAUDE.md\`) or project root
2. Move \`.claude/\` folder to your home directory (\`~/.claude/\`)
3. Fill in your credentials in CLAUDE.md (search for \`YOUR_\`)
4. Add your schema notes and common queries
5. Customize behavioral protocols to match your style

## Security

- **NEVER** commit CLAUDE.md with real credentials to a public repo
- Add to \`.gitignore\`: \`CLAUDE.md\` or use environment variables
- Consider a secrets manager for sensitive credentials

## Directory Structure

\`\`\`
~/
├── CLAUDE.md              # Main instructions
└── .claude/
    ├── sessions/          # Saved sessions
    │   └── SESSION_INDEX.md
    ├── ref/               # Reference files
    │   └── README.md
    └── status/
        └── CURRENT_SPRINT.md
\`\`\`

## Next Steps

1. Add your database connection details
2. Document your schema quirks
3. Add reference files for your domain
4. Start a session and test: "What can you do?"

## Support

Questions? [Your support channel here]
`);

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `operator-mode-${formData.companyAbbrev.toLowerCase() || 'config'}.zip`);

    setIsGenerating(false);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="inline-block px-3 py-1 text-xs font-mono bg-zinc-900 text-zinc-400 rounded-full mb-6">
            CLAUDE CODE CONFIGURATION
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Operator Mode
          </h1>
          <p className="text-xl text-zinc-400 mb-8 max-w-2xl">
            Transform Claude Code from a passive assistant into an autonomous operator.
            Generate your personalized configuration in 60 seconds.
          </p>
          <div className="flex gap-4 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              No sycophancy
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              End-to-end execution
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Zero handbacks
            </div>
          </div>
        </div>
      </section>

      {/* Generator */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        {/* Progress */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full ${
                s <= step ? 'bg-white' : 'bg-zinc-800'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Identity */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Identity</h2>
              <p className="text-zinc-500">Who is Claude working for?</p>
            </div>

            <div className="grid gap-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Your Name</label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => updateField('userName', e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-600"
                  placeholder="Anthony Clavero"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-600"
                    placeholder="Acme Corp"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Abbreviation</label>
                  <input
                    type="text"
                    value={formData.companyAbbrev}
                    onChange={(e) => updateField('companyAbbrev', e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-600"
                    placeholder="AC"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Industry</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {INDUSTRIES.map((ind) => (
                    <button
                      key={ind.value}
                      onClick={() => updateField('industry', ind.value)}
                      className={`px-4 py-3 rounded-lg border text-left text-sm transition ${
                        formData.industry === ind.value
                          ? 'bg-white text-black border-white'
                          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      {ind.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!formData.userName || !formData.companyName}
              className="px-6 py-3 bg-white text-black font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Infrastructure */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Infrastructure</h2>
              <p className="text-zinc-500">What systems does Claude need to know about?</p>
            </div>

            <div className="grid gap-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Cloud Provider</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {CLOUD_PROVIDERS.map((cp) => (
                    <button
                      key={cp.value}
                      onClick={() => updateField('cloudProvider', cp.value)}
                      className={`px-4 py-3 rounded-lg border text-left text-sm transition ${
                        formData.cloudProvider === cp.value
                          ? 'bg-white text-black border-white'
                          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      {cp.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Primary Database</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {DATABASES.map((db) => (
                    <button
                      key={db.value}
                      onClick={() => updateField('primaryDb', db.value)}
                      className={`px-4 py-3 rounded-lg border text-left text-sm transition ${
                        formData.primaryDb === db.value
                          ? 'bg-white text-black border-white'
                          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      {db.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Bot/Automation Platform</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {BOT_PLATFORMS.map((bp) => (
                    <button
                      key={bp.value}
                      onClick={() => {
                        updateField('botPlatform', bp.value);
                        updateField('hasBot', bp.value !== 'none');
                      }}
                      className={`px-4 py-3 rounded-lg border text-left text-sm transition ${
                        formData.botPlatform === bp.value
                          ? 'bg-white text-black border-white'
                          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      {bp.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-lg"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 bg-white text-black font-medium rounded-lg"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Preferences</h2>
              <p className="text-zinc-500">How should Claude behave?</p>
            </div>

            <div className="grid gap-3">
              {PREFERENCES.map((pref) => (
                <button
                  key={pref.value}
                  onClick={() => togglePreference(pref.value)}
                  className={`px-4 py-3 rounded-lg border text-left transition ${
                    formData.preferences.includes(pref.value)
                      ? 'bg-white text-black border-white'
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  {pref.label}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-lg"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-3 bg-white text-black font-medium rounded-lg"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Generate */}
        {step === 4 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Generate</h2>
              <p className="text-zinc-500">Review and download your configuration.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-zinc-500">Name</span>
                <span>{formData.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Company</span>
                <span>{formData.companyName} ({formData.companyAbbrev})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Industry</span>
                <span className="capitalize">{formData.industry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Cloud</span>
                <span className="uppercase">{formData.cloudProvider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Database</span>
                <span className="capitalize">{formData.primaryDb}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Bot Platform</span>
                <span className="capitalize">{formData.botPlatform || 'None'}</span>
              </div>
              <div className="border-t border-zinc-800 pt-4">
                <span className="text-zinc-500 block mb-2">Preferences</span>
                <div className="flex flex-wrap gap-2">
                  {formData.preferences.map((p) => {
                    const pref = PREFERENCES.find(pr => pr.value === p);
                    return pref ? (
                      <span key={p} className="px-2 py-1 bg-zinc-800 rounded text-sm">
                        {pref.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-400">
              <strong className="text-white">Your download includes:</strong>
              <ul className="mt-2 space-y-1">
                <li>- CLAUDE.md (main config)</li>
                <li>- .claude/sessions/ (session library)</li>
                <li>- .claude/ref/ (reference files)</li>
                <li>- .claude/status/ (sprint tracking)</li>
                <li>- SETUP.md (installation guide)</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-lg"
              >
                Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 px-6 py-3 bg-white text-black font-medium rounded-lg disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Download Configuration'}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center text-sm text-zinc-600">
          Operator Mode - Claude Code Configuration Generator
        </div>
      </footer>
    </main>
  );
}
