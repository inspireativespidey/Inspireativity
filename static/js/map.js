document.addEventListener("DOMContentLoaded", () => {

    if (typeof maplibregl === "undefined") {
        console.error("MapLibre GL JS failed to load.");
        return;
    }


    const mapElement =
        document.getElementById("spidey-map");


    if (!mapElement) {
        return;
    }


    const meetups =
        window.INSPIRIVITY_MEETUPS || [];


    /*
     * =========================================================
     * BENGALURU
     * =========================================================
     */

    const BANGALORE_CENTER = [
        77.5946,
        12.9716
    ];


    /*
     * Keep the interactive map around Bengaluru.
     *
     * MapLibre uses [longitude, latitude].
     */

    const BANGALORE_BOUNDS = [
        [77.40, 12.80],
        [77.80, 13.15]
    ];


    /*
     * =========================================================
     * CURRENT MEETUP LOCATION FALLBACKS
     * =========================================================
     */

    const KNOWN_LOCATIONS = {

        "church street, bengaluru": [
            77.6050,
            12.9756
        ],

        "church street, bangalore": [
            77.6050,
            12.9756
        ],

        "cubbon park, bengaluru": [
            77.5929,
            12.9763
        ],

        "cubbon park, bangalore": [
            77.5929,
            12.9763
        ],

        "hbr layout, bengaluru": [
            77.6324,
            13.0358
        ],

        "hbr layout, bangalore": [
            77.6324,
            13.0358
        ]

    };


    /*
     * =========================================================
     * CREATE MAP
     * =========================================================
     */

    const map =
        new maplibregl.Map({

            container: "spidey-map",

            style:
                "https://tiles.openfreemap.org/styles/dark",

            center:
                BANGALORE_CENTER,

            zoom: 12,

            minZoom: 11,

            maxZoom: 18,

            maxBounds:
                BANGALORE_BOUNDS,

            attributionControl: true

        });


    /*
     * =========================================================
     * NAVIGATION CONTROLS
     * =========================================================
     */

    map.addControl(
        new maplibregl.NavigationControl({
            showCompass: false
        }),
        "top-right"
    );


    /*
     * =========================================================
     * ADD SPIDEY MARKERS
     * =========================================================
     */

    map.on("load", () => {

        meetups.forEach(meetup => {

            const coordinates =
                getMeetupCoordinates(meetup);


            if (!coordinates) {

                console.warn(
                    `No coordinates found for meetup #${meetup.id}: ${meetup.location}`
                );

                return;
            }


            /*
             * Create custom marker element.
             */

            const markerElement =
                document.createElement("div");


            markerElement.className =
                "spidey-map-marker";


            markerElement.innerHTML = `
                <img
                    src="${window.INSPIRIVITY_MARKER}"
                    alt=""
                >
            `;


            /*
             * Create popup.
             */

            const popup =
                new maplibregl.Popup({
                    offset: 30,
                    closeButton: true,
                    closeOnClick: true
                })
                .setHTML(`
                    <div class="spidey-map-popup">

                        <div class="popup-title">
                            Spidey meetup #${escapeHtml(meetup.id)}
                        </div>

                        <div class="popup-meta">

                            ${escapeHtml(meetup.date)}

                            <br>

                            ${escapeHtml(meetup.location)}

                        </div>

                        <a
                            class="popup-link"
                            href="/meetups/${escapeHtml(meetup.id)}"
                        >
                            View meetup →
                        </a>

                    </div>
                `);


            /*
             * Add marker to map.
             */

            new maplibregl.Marker({
                element: markerElement,
                anchor: "bottom"
            })

            .setLngLat(coordinates)

            .setPopup(popup)

            .addTo(map);

        });


        /*
         * Make sure the map knows its final dimensions.
         */

        setTimeout(() => {
            map.resize();
        }, 100);

    });


    /*
     * =========================================================
     * COORDINATES
     * =========================================================
     */

    function getMeetupCoordinates(meetup) {

        /*
         * Prefer coordinates stored in meetups.json.
         */

        if (
            typeof meetup.longitude === "number" &&
            typeof meetup.latitude === "number"
        ) {

            const coordinates = [
                meetup.longitude,
                meetup.latitude
            ];


            if (isInsideBangalore(coordinates)) {
                return coordinates;
            }

        }


        /*
         * Otherwise use our known current locations.
         */

        if (meetup.location) {

            const normalized =
                meetup.location
                    .trim()
                    .toLowerCase();


            if (KNOWN_LOCATIONS[normalized]) {

                return KNOWN_LOCATIONS[normalized];

            }

        }


        return null;

    }


    /*
     * =========================================================
     * BENGALURU BOUNDARY CHECK
     * =========================================================
     */

    function isInsideBangalore(coordinates) {

        const longitude =
            coordinates[0];

        const latitude =
            coordinates[1];


        return (

            longitude >= BANGALORE_BOUNDS[0][0] &&

            longitude <= BANGALORE_BOUNDS[1][0] &&

            latitude >= BANGALORE_BOUNDS[0][1] &&

            latitude <= BANGALORE_BOUNDS[1][1]

        );

    }


    /*
     * =========================================================
     * HTML ESCAPING
     * =========================================================
     */

    function escapeHtml(value) {

        return String(value).replace(
            /[&<>"']/g,
            character => ({

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"

            }[character])
        );

    }

});