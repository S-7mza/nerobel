# Form Submission Architecture and Backends (S3-03)

This document specifies the submission architecture for all three forms on the Nerobel Group website (`sav.html`, `contact.html`, and `b2b.html`), addressing audit finding **S-09** (elimination of fake success screens and fabricated ticket numbers) in accordance with Owner Decision **O-09**.

---

## 1. Audit State: Initial Implementation Analysis

Before Sprint 3, none of the forms communicated with a real backend server:

| Form | Page | Original Handling | Defect (Finding S-09) |
|---|---|---|---|
| **Demande SAV** | `sav.html` | Client-side `js/sav.js` intercepted the submit button, simulated network latency via `setTimeout(..., 1200)`, and displayed a success screen with a fabricated ticket code `NERO-2026-` followed by 4 random digits. No data was transmitted to any server. | **Fake Success:** The user believed their repair ticket had been logged in a central database, when in fact nothing was transmitted. |
| **Correspondance Contact** | `contact.html` | Handled by `bindStandardForm` in `js/main.js`, which validated required fields, reset the form, and displayed a toast message claiming the message was transmitted to management. | **Fake Success:** The message was silently discarded in memory upon form reset. |
| **Demande Partenaire B2B** | `b2b.html` | Handled by `bindStandardForm` in `js/main.js`, which validated fields and showed a toast claiming the partner request was recorded. | **Fake Success:** No commercial lead was saved or emailed. |

---

## 2. Target Architecture (Owner Decision O-09)

Until the owner provides an official backend API endpoint (**O-09**), **no form may claim that a message was sent when it was not**.

### 2.1 Default Operational Mode: WhatsApp & Mailto Hand-Off

When no backend API endpoint is configured (or when an API call fails):

1. **Client-Side Validation & Consent:**
   - Every form strictly validates required fields and explicit consent (`confidentialite.html`).
2. **Message Assembly (Excluding Photos):**
   - The form compiles a structured text message containing the user's entered fields.
   - For privacy and transmission constraints, client-uploaded photos are **never** attached to plain URL query parameters.
3. **Transmission Hand-Off:**
   - **SAV (`sav.html`):** Compiles client name, phone, city, address, brand, category, serial number (or opted-out status), and fault description. Opens WhatsApp Nerobel:
     `https://wa.me/212787013201?text=...`
   - **Contact (`contact.html`):** Compiles client name, phone, email, department, and message. Opens WhatsApp Nerobel:
     `https://wa.me/212787013201?text=...`
   - **Espace Pro B2B (`b2b.html`):** Compiles company, ICE/RC, contact name, phone, email, city, activity, brands of interest, and estimated volume. Opens `mailto:contact@nerobel.com?subject=...&body=...`.
4. **User Feedback:**
   - The UI displays: **« Votre message est prêt : appuyez sur Envoyer pour finaliser. »**
   - A direct action button allows the user to re-launch WhatsApp or their email client if the popup was blocked.
   - **No fabricated ticket numbers (`NERO-2026-XXXX`) are displayed.** A reference number is only shown if returned by a genuine server.

---

## 3. Future Backend API Specification (When O-09 is Answered)

When a server endpoint is configured (e.g. `window.nerobelFormEndpoint = '/api/submit'` or `https://api.nerobel.com/v1/forms`):

### 3.1 Request Payload
The client executes a `fetch` `POST` request with JSON content:
```json
{
  "form": "sav" | "contact" | "b2b",
  "fields": {
    "fullName": "Mohamed Alami",
    "phone": "+212612345678",
    "city": "Casablanca",
    "address": "The Gold Center, Bureau 12, Bd El Qods",
    "brand": "Eurogas",
    "serial": "PC202604150892",
    "symptom": "Fuite d'eau",
    "description": "Précisions techniques..."
  },
  "consent": true,
  "timestamp": 1776513600000
}
```

### 3.2 Anti-Spam Protections
- **Hidden Honeypot Field:** `<input type="text" name="_hp" style="display:none;" tabindex="-1" autocomplete="off">`. If filled, submission is aborted.
- **Minimum Fill Time:** The client records form load timestamp and rejects submissions completed in under 3 seconds.

### 3.3 Response Handling & Error State
- **HTTP 2xx (Success):** Display genuine ticket reference returned by server.
- **HTTP Non-2xx or Network Failure (`route.abort()`):**
  - Disable success screen.
  - Display error notice: **« L'envoi a échoué. Réessayez ou écrivez-nous sur WhatsApp. »**
  - Provide fallback button opening the prefilled WhatsApp / mailto message.
