# Questions for Teacher

## GitHub Push
- Need to run `gh auth login` to authenticate with GitHub before I can push code. Once you're logged in, run:
  ```
  gh repo create "How-To-Not-End-Up-Like-George" --public --source=. --push
  ```

## Design Decisions Made
- Used localStorage for persistence (no backend) — is that okay for MVP, or do you want Firebase/Supabase?
- The "login" currently just saves a profile locally. A real email login would need a backend auth service. Should I add Firebase Auth?
