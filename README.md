# MIDI Editors — Hub

A single-page hub linking all web-based MIDI editors for Behringer synthesizers.

## Structure

```
midi_editors/
├── index.html          ← Hub home page
├── styles.css
├── script.js
├── pro-vs-mini/        ← Behringer PRO VS Mini editor
├── jt-midi/            ← Behringer JT Mini editor
├── behringer-cz1/      ← Behringer CZ1 editor
├── behringer-ub1/      ← Behringer UB-1 editor
└── jt4000m/            ← Behringer JT4000M editor
```

## Adding / updating an editor

Each subfolder is self-contained. To populate or update an editor:

1. Clone (or download) the corresponding GitHub repo
2. Copy its files into the matching subfolder, overwriting what's there
3. The `index.html` in the subfolder is the editor entry point — do not rename it

| Subfolder | GitHub repo |
|-----------|-------------|
| `pro-vs-mini/` | https://github.com/gary909/Pro_VS_Mini_Editor |
| `jt-midi/` | https://github.com/gary909/JT-Midi-Editor |
| `behringer-cz1/` | https://github.com/gary909/Behringer-CZ1-Midi-Editor |
| `behringer-ub1/` | https://github.com/gary909/Behringer-UB1-Midi-Editor |
| `jt4000m/` | https://github.com/gary909/JT4000M-MIDI-EDITOR |

## Adding synth images

Replace the placeholder `<div class="card-thumb">` in `index.html` with an `<img>` tag:

```html
<div class="card-thumb">
    <img src="./pro-vs-mini/media/preview-image.png" alt="PRO VS Mini">
</div>
```

## Requirements

Web MIDI API — Chrome or Edge recommended.
