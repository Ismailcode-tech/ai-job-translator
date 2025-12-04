# GitHub Authentication Fix

GitHub requires a **Personal Access Token (PAT)** instead of your password for HTTPS authentication.

## Quick Steps:

1. **Create a Personal Access Token**:
   - Go to: https://github.com/settings/tokens/new
   - **Note**: "AI Job Translator Deployment"
   - **Expiration**: 90 days (or custom)
   - **Scopes**: Check `repo` (Full control of private repositories)
   - Click **"Generate token"**
   - **COPY THE TOKEN** (you won't see it again!)

2. **Push with Token**:
   Run this command (replace `YOUR_TOKEN` with the token you just copied):
   
   ```bash
   git push https://YOUR_TOKEN@github.com/Ismailcode-tech/ai-job-translator.git main
   ```

   Example:
   ```bash
   git push https://ghp_abc123XYZ456...@github.com/Ismailcode-tech/ai-job-translator.git main
   ```

3. **Done!** Your code will be pushed to GitHub.

---

## Alternative: Use SSH (More Secure, One-Time Setup)

If you prefer SSH (recommended for long-term):

1. Generate SSH key:
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
   Press Enter 3 times (accept defaults).

2. Copy your public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

3. Add to GitHub:
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste the key
   - Save

4. Change remote to SSH:
   ```bash
   git remote set-url origin git@github.com:Ismailcode-tech/ai-job-translator.git
   git push -u origin main
   ```
