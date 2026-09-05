from pathlib import Path
import json
from flask import Flask, render_template, abort

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "meetups.json"

app = Flask(__name__, static_folder="static", template_folder="templates")


def load_meetups():
    with DATA_FILE.open("r", encoding="utf-8") as f:
        return json.load(f)


@app.context_processor
def inject_globals():
    return {"site_name": "Inspireativity"}


@app.route("/")
def home():
    return render_template("about.html", active="about")


@app.route("/about")
def about():
    return render_template("about.html", active="about")


@app.route("/meetups")
def meetups():
    return render_template("meetups.html", active="meetups", meetups=load_meetups())


@app.route("/meetups/<int:meetup_id>")
def meetup_detail(meetup_id):
    meetup = next((m for m in load_meetups() if m["id"] == meetup_id), None)
    if meetup is None:
        abort(404)
    return render_template("meetup.html", active="meetups", meetup=meetup)


@app.route("/spidey-map")
def spidey_map():
    return render_template("map.html", active="map", meetups=load_meetups())


@app.route("/contact")
def contact():
    return render_template("contact.html", active="contact")


@app.errorhandler(404)
def not_found(_error):
    return render_template("404.html", active=""), 404


if __name__ == "__main__":
    app.run(debug=True)
