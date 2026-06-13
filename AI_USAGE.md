# 🤖 AI Usage Declaration

**Project:** LuminaGems — AI-Powered Astrological Gemstone Recommendation App  
**Repository:** `lavish005/GemStone-Recomendation-app`  
**Declaration Date:** June 2026  
**Prepared by:** Lavish Garg

---

## Overview

This document transparently discloses all uses of Artificial Intelligence (AI) tools within the **LuminaGems** project — both as a **core product feature** and as **development assistance**. Maintaining this transparency ensures academic integrity, proper attribution, and clear communication with collaborators, evaluators, and users.

---

## Part 1 — AI as a Core Product Feature

### 1.1 Google Gemini AI (`gemini-2.0-flash`)

| Attribute | Details |
|---|---|
| **AI Service** | Google Gemini API |
| **Model** | `gemini-2.0-flash` |
| **Provider** | Google DeepMind / Google AI Studio |
| **Integration Point** | `server/routes/gemstones.js` — `POST /api/gemstones/recommend` |
| **SDK Used** | `@google/generative-ai` v0.24.x (npm package) |

#### Purpose & Functionality

Gemini AI is the **central intelligence** of LuminaGems. When a user completes the multi-step consultation wizard, the server constructs a detailed prompt and sends it to the Gemini API. The model returns a personalized, mystical-yet-professional astrological insight that is displayed to the user alongside matching gemstones.

#### Prompt Engineering

The following prompt template is used (from `server/routes/gemstones.js`):

```
You are a professional Vedic astrologer and gemstone consultant.
A person named "{name}" with the zodiac sign "{zodiacSign}" born on "{dob}"
at "{timeOfBirth}" in "{placeOfBirth}" is seeking gemstones for "{purpose}".

The matching gemstones from our catalog are: {gemNames}.

Provide a concise, personalized astrological insight (3-4 sentences max)
explaining why these gemstones are aligned with their cosmic energy.
Mention specific planetary alignments if relevant.
Be mystical yet professional. Do NOT use markdown formatting.
```

#### User Inputs Sent to the AI

| Input Field | Description |
|---|---|
| `name` | User's full name |
| `zodiacSign` | Auto-detected or manually selected zodiac sign |
| `dob` | Date of birth |
| `timeOfBirth` | Birth time (optional) |
| `placeOfBirth` | City of birth (optional) |
| `purpose` | Life goal (Wealth, Health, Love, Career, Protection, Peace) |
| `gemNames` | Comma-separated names of database-matched gemstones |

#### Fallback Behavior

If the Gemini API call fails (network error, quota exceeded, invalid key, etc.), the system gracefully falls back to a **static, template-based insight string** to ensure uninterrupted service. No user data is stored by the AI service beyond the scope of the API request.

#### Data Privacy Note

User inputs (name, DOB, place of birth, purpose, zodiac sign) are transmitted to the Google Gemini API. Users should be aware that this data is subject to [Google's Privacy Policy](https://policies.google.com/privacy) and [Gemini API Terms of Service](https://ai.google.dev/terms). The application does **not** send passwords, emails, or authentication tokens to the AI service.

---

## Part 2 — AI Tools Used During Development

### 2.1 Antigravity IDE Assistant (Google DeepMind)

| Attribute | Details |
|---|---|
| **Tool** | Antigravity (Powered by Claude Sonnet 4.6 with Thinking) |
| **Provider** | Google DeepMind |
| **Usage Context** | Development assistance — code generation, documentation, analysis |

#### How it was used:

- **Project Analysis:** Indexing and deep analysis of the entire codebase to understand architecture, data models, API routes, and component structure.
- **Documentation Generation:** Drafting and writing this `AI_USAGE.md` file and the `README.md` professional documentation file, based on actual code analysis.
- **Code Review Assistance:** Reviewing existing implementations for patterns, structure, and consistency.

#### Human Oversight:

All AI-generated code, content, and documentation was reviewed, validated, and approved by the developer (Nishant Bhalla) before being committed to the repository. The AI assistant acted as a pair-programming tool, not an autonomous author.

---

### 2.2 GitHub Copilot / Other AI Completion Tools *(if applicable)*

> If GitHub Copilot or any other inline AI code completion tool was used during development, please update this section accordingly.

| Attribute | Details |
|---|---|
| **Tool** | GitHub Copilot (if used) |
| **Usage** | Inline code suggestions, boilerplate generation |
| **Scope** | Routine code patterns (e.g., Express route scaffolding, React component structure) |

---

## Part 3 — What AI Did NOT Do

To be explicit about the boundaries of AI involvement:

- ❌ AI did **not** design the application architecture — that was the developer's decision.
- ❌ AI did **not** select the tech stack — React, Express, MongoDB, and Gemini were chosen by the developer.
- ❌ AI did **not** write the Vedic astrology domain knowledge — gemstone data, planetary associations, chakra information, and zodiac correlations are based on established astrological references.
- ❌ AI did **not** have access to any sensitive credentials, API keys, or production data.
- ❌ AI-generated outputs were **not** committed to the repository without developer review.

---

## Part 4 — Responsible AI Practices

### Transparency
This document is publicly available in the repository to ensure full transparency about AI involvement in the project.

### Accuracy Disclaimer
The astrological recommendations generated by Gemini AI are for **informational and entertainment purposes only**. They are not a substitute for professional astrological consultation, medical advice, or financial guidance. Gemstone associations with planets and zodiac signs are based on traditional Vedic astrological frameworks.

### Bias Awareness
AI-generated content may reflect biases present in the model's training data. The Gemini AI responses are filtered through a professional prompt to minimize harmful or inaccurate outputs, but users should apply their own judgment.

### Data Minimization
Only the minimum required user data is sent to the Gemini API. The application does not share user email addresses, passwords, or authentication tokens with any AI service.

---

## Part 5 — AI Tool Versions & References

| Tool | Version | Reference |
|---|---|---|
| Google Gemini API Model | `gemini-2.0-flash` | [Google AI Studio](https://aistudio.google.com/) |
| `@google/generative-ai` SDK | `^0.24.1` | [npm](https://www.npmjs.com/package/@google/generative-ai) |
| Antigravity IDE Assistant | Claude Sonnet 4.6 (Thinking) | Google DeepMind |

---

## Summary

| Category | AI Tool | Role |
|---|---|---|
| **Product Feature** | Google Gemini 2.0 Flash | Core recommendation engine — generates personalized astrological insights at runtime |
| **Dev Assistance** | Antigravity (Claude Sonnet 4.6) | Code review, documentation authoring, project analysis |

---

*This declaration was last updated on **June 13, 2026**.*  
*For questions or concerns, contact the project maintainer: **Lavish Garg**.*
