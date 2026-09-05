# Inspireativity

A Flask + Vercel website for the Inspireativity community.

## Features

- Responsive desktop/mobile design
- Separate supplied desktop and mobile backgrounds
- Translucent visual layer so the artwork remains visible while text stays readable
- About page with the Inspireativity manifesto
- Circular Inspireativity profile image
- Meet Up cards with swipeable/tappable photo galleries
- Individual meetup pages
- Interactive Bengaluru Spidey Map
- Custom Spidey image markers
- Meetup coordinates generated from human-readable locations
- Contact cards for Email, X, Reddit community and Reddit user
- Persistent community/IP disclaimer
- No database or authentication required for the current read-only version
- Vercel-ready Flask deployment

## 1. Run locally in VS Code

Open the repository folder in VS Code.

### Windows

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Then open:

http://127.0.0.1:5000

### macOS / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Then open:

http://127.0.0.1:5000

## 2. Updating meetups

Open:

`data/meetups.json`

Each meetup has:

- `id`
- `date`
- `location`
- `latitude`
- `longitude`
- `description`
- `photos`

You normally only need to type the date, location and description.

### Automatic location coordinates

After changing or adding a location, run:

```bash
python tools/geocode_meetups.py
```

The script uses Nominatim/OpenStreetMap to turn a location such as:

`Cubbon Park, Bengaluru`

into latitude/longitude and saves the result into the JSON.

It also keeps a local cache so the same location isn't repeatedly requested.

For the public site, the coordinates are already stored, so visitors do not trigger geocoding requests.

## 3. Adding meetup photos

Create a folder such as:

`static/images/meetups/meetup-4/`

Put your photos inside it.

Then change the `photos` list in `data/meetups.json`:

```json
"photos": [
  "/static/images/meetups/meetup-4/1.jpg",
  "/static/images/meetups/meetup-4/2.jpg",
  "/static/images/meetups/meetup-4/3.jpg"
]
```

The gallery automatically supports:

- desktop arrows
- mobile swipe
- dot indicators

## 4. Changing the About images

Current files:

- `static/images/about/inspireativity.jpg`
- `static/images/map/spidey-marker.jpg`

Replace them with your final assets while keeping the same filenames, or update the paths in the templates.

The Spidey image is intentionally used for the map marker.

## 5. Contact details

Edit:

`templates/contact.html`

Replace the placeholder:

- email
- X/Twitter URL
- X/Twitter handle

The Reddit links are already pointed at the Inspireativity community and Inspireative_Spidey profile.

## 6. Backgrounds

Current files:

- `static/images/backgrounds/desktop.png`
- `static/images/backgrounds/mobile.png`

Desktop CSS uses the desktop artwork.

Mobile CSS switches to the portrait artwork automatically below 760px viewport width.

The site uses a translucent dark layer above the background instead of an opaque page background.

## 7. Vercel deployment

Push the repository to GitHub.

Then import the repository into Vercel.

No build command is required.

The included `vercel.json` routes requests through the Flask entry point at:

`api/index.py`

Vercel will install dependencies from `requirements.txt`.

## Architecture

```text
inspireativity/
├── api/index.py              # Vercel entry point
├── app.py                    # Flask routes
├── data/meetups.json         # Read-only meetup data
├── tools/geocode_meetups.py  # Location -> coordinates helper
├── templates/                # HTML/Jinja templates
├── static/
│   ├── css/style.css
│   ├── js/main.js
│   ├── js/map.js
│   └── images/
├── requirements.txt
├── vercel.json
└── README.md
```

## Map architecture

The map uses:

- Leaflet.js for the interactive map
- OpenStreetMap tiles for map data
- Nominatim for developer-side location geocoding

Google Maps is not required for the current version.

## Important note about Nominatim

Nominatim is intended for reasonable geocoding usage, not high-volume automated traffic. This repository therefore geocodes locations during your content-preparation step and stores the resulting coordinates. The live site does not call Nominatim.

If Inspireativity eventually has a large number of locations or an admin system, move geocoding to a proper hosted provider or self-hosted service.

## Future upgrade path

This version deliberately avoids authentication and a database.

If you later want an admin dashboard, the natural next architecture is:

```text
Admin login
    ↓
Meetup editor
    ↓
Location search / selection
    ↓
Geocoded coordinates
    ↓
Database
    ↓
Meet Ups + Spidey Map
```

The current frontend can remain largely unchanged when that happens.
