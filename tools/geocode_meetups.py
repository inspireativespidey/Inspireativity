"""
Geocode meetup locations in data/meetups.json using Nominatim.

Usage:
    python tools/geocode_meetups.py

The public website remains read-only. You edit the human-readable "location"
field in data/meetups.json, then run this script before deployment. It stores
latitude/longitude in the same JSON file so visitors never need to call the
geocoder.

Nominatim usage policy requires a descriptive User-Agent and reasonable request
frequency. This script waits between requests and only geocodes entries whose
coordinates are missing or whose location has changed.
"""

from pathlib import Path
import json
import time
import requests

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "meetups.json"
CACHE = ROOT / "data" / "geocode_cache.json"

HEADERS = {
    "User-Agent": "Inspireativity/1.0 (community website geocoding helper)"
}
ENDPOINT = "https://nominatim.openstreetmap.org/search"


def load_json(path, default):
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def geocode(query):
    response = requests.get(
        ENDPOINT,
        params={"q": query, "format": "jsonv2", "limit": 1},
        headers=HEADERS,
        timeout=20,
    )
    response.raise_for_status()
    results = response.json()
    if not results:
        return None
    return {
        "latitude": float(results[0]["lat"]),
        "longitude": float(results[0]["lon"]),
        "display_name": results[0].get("display_name", query),
    }


def main():
    meetups = load_json(DATA, [])
    cache = load_json(CACHE, {})

    changed = False

    for meetup in meetups:
        location = meetup.get("location", "").strip()
        if not location:
            print(f"Meetup #{meetup.get('id')}: no location; skipped.")
            continue

        cached = cache.get(location)
        if cached:
            result = cached
            print(f"Meetup #{meetup.get('id')}: using cached location → {location}")
        else:
            print(f"Meetup #{meetup.get('id')}: geocoding → {location}")
            result = geocode(location)
            if result is None:
                print("  No result found. Add a more specific location.")
                continue
            cache[location] = result
            changed = True
            time.sleep(1.1)

        meetup["latitude"] = result["latitude"]
        meetup["longitude"] = result["longitude"]
        changed = True

    if changed:
        DATA.write_text(json.dumps(meetups, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        CACHE.write_text(json.dumps(cache, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print("\nUpdated meetup coordinates.")
    else:
        print("\nNothing to update.")


if __name__ == "__main__":
    main()
