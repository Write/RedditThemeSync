# RedditThemeSync

- 0 UI Interaction, no more issue with avatar's menu staying open, not loading, etc.
- Automatically fetch CSRF and sends garphQL API request on your behalf.
- Change theme cookie on your side.
- Avoid Theme flash issue as much as possible by changing asap <html>'s classList.
- Instantaneous theme-switching by toggling <html>'s classList theme-dark / theme-light before any API call is even made.
- Event on Tab Switching, just in case one of your reddit tab was 'asleep', while your system changed of colorScheme.