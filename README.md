# Pet House

Pet House is a cozy gallery for finding pets with personality. Search the
house, shortlist your favorite companions, and download the buddies you want to
keep close.

## Features

- Fetches pet data with a custom `usePets` hook.
- Handles loading, error, empty, and retry states explicitly.
- Search by title or description.
- Sort by name A-Z, name Z-A, newest first, and oldest first.
- Select all filtered pets, clear selection, and persist selection across routes.
- Shows selected item count and estimated selected file size.
- Downloads one pet or the full current selection.
- Dynamic detail route at `/pets/:id`.
- About page with project notes.
- Responsive gallery layout: 1 column mobile, 2 tablet, 4 desktop.
- Styled with `styled-components`.

## Run Locally

```bash
npm install
npm run dev
```
