# Branch Protection Rules — Rotana Store

> **These settings must be configured manually on GitHub.** Go to: Repository → Settings → Branches → Add branch protection rule.

---

## `main` Branch (Production)

**Pattern**: `main`

| Rule                                         | Setting                              |
| -------------------------------------------- | ------------------------------------ |
| Require a pull request before merging        | ✅ Enabled                           |
| Required approvals                           | **1**                                |
| Dismiss stale pull request approvals         | ✅ Enabled                           |
| Require review from Code Owners              | ❌ Off                               |
| Require status checks to pass before merging | ✅ Enabled                           |
| Required status checks                       | `Code Quality`, `Build Verification` |
| Require branches to be up to date            | ✅ Enabled                           |
| Require conversation resolution before merge | ✅ Enabled                           |
| Require signed commits                       | ❌ Off                               |
| Require linear history                       | ✅ Enabled                           |
| Include administrators                       | ✅ Enabled                           |
| Allow force pushes                           | ❌ Never                             |
| Allow deletions                              | ❌ Never                             |

---

## `develop` Branch (Integration)

**Pattern**: `develop`

| Rule                                         | Setting                              |
| -------------------------------------------- | ------------------------------------ |
| Require a pull request before merging        | ✅ Enabled                           |
| Required approvals                           | **1**                                |
| Dismiss stale pull request approvals         | ✅ Enabled                           |
| Require status checks to pass before merging | ✅ Enabled                           |
| Required status checks                       | `Code Quality`, `Build Verification` |
| Require branches to be up to date            | ❌ Off (to avoid merge bottlenecks)  |
| Require conversation resolution before merge | ✅ Enabled                           |
| Require linear history                       | ❌ Off                               |
| Include administrators                       | ✅ Enabled                           |
| Allow force pushes                           | ❌ Never                             |
| Allow deletions                              | ❌ Never                             |

---

## How to Set Up (Step-by-Step)

1. Go to your GitHub repo
2. Click **Settings** → **Branches** (left sidebar)
3. Click **Add branch protection rule**
4. Enter the branch name pattern (`main` or `develop`)
5. Configure the settings as listed above
6. Click **Create** / **Save changes**
7. Repeat for the other branch

---

## After Setup

Test the protection by:

1. Try pushing directly to `main` → should be **rejected**
2. Create a PR → should require CI passing + 1 approval
3. Try force-pushing to `develop` → should be **rejected**

---

_Configured by Ayeen (PM). Do not modify without team approval._
