const App = {
    data: function() {
        return {
            // Data
            height: 1,          // The projectile's initial height (m)
            initialVelocity: 5, // The projectile's initial velocity (N)
            angle: 0,           // The projectile's intial trajectory (degrees)
            gravity: 9.8,       // The acceleration due to gravity (m/s/s)
            time: 0,            // The time (s)
            positions: [],      // A list of the projectile's positions

            // Simulation properties
            active: false,      // Whether the simulation is active
            refreshRate: 0.01,  // The simulation refresh rate (s)
            intervalId: null,   // The value returned by setInterval
            svg: null,
        }
    },
    computed: {
        /**
         * The position of the projectile
         */
        position: function() {
            let x = this.getAdj(this.angle, this.initialVelocity) * this.time;
            let y = this.height + (this.getOpp(this.angle, this.initialVelocity) * this.time) - (0.5 * this.gravity * this.time * this.time);
            return {x, y};
        },

        /**
         * The current velocity of the projectile
         */
        velocity: function() {
            let x = this.getAdj(this.angle, this.initialVelocity);
            let y = this.getOpp(this.angle, this.initialVelocity) - (this.gravity * this.time);
            let total = Math.sqrt(x*x + y*y);
            let angle = total != 0 ? this.getAng(y, x) : 0;
            return {x, y, total, angle};
        },

        /**
         * The coordinates of the launch vector arrow
         */
        launchArrow: function() {
            if (this.time !== 0 || this.initialVelocity === 0) {
                return [
                    this.position,
                    this.position,
                    this.position
                ];
            }
            else {
                let x = this.position.x + this.getAdj(this.angle, this.initialVelocity / 4 + 0.4);
                let y = this.position.y + this.getOpp(this.angle, this.initialVelocity / 4 + 0.4);
                let arrow1x = x - this.getAdj(this.angle + 20, 0.25);
                let arrow1y = y - this.getOpp(this.angle + 20, 0.25);
                let arrow2x = x - this.getAdj(this.angle - 20, 0.25);
                let arrow2y = y - this.getOpp(this.angle - 20, 0.25);
                return [
                    { x: arrow1x, y: arrow1y },  // Arrow side #1
                    { x: x,       y: y       },  // Center point
                    { x: arrow2x, y: arrow2y },  // Arrow side #2
                ];
            }
        }
    },
    methods: {
        /**
         * Toggle whether the simulation is active
         */
        toggle: function() {
            this.active = !this.active;
            if (this.active) this.intervalID = setInterval(this.update, this.refreshRate * 1000);
            else clearInterval(this.intervalID);
        },

        /**
         * Reset the simulation
         */
        reset: function() {
            this.time = 0;
            this.positions = [];
        },

        /**
         * Update the simulation
         */
        update: function() {
            // Update time
            this.time += this.refreshRate;

            // Update positions
            this.positions.push(this.position);

            // Stop simulation when the projectile hits the ground
            if (this.position.y <= 0) this.toggle();
        },

        /**
         * Get the length of the opposite side of a triangle
         * @param {Number} angle The angle in degrees
         * @param {Number} distance The length of the hypotenuse
         * @returns {Number} The length of the opposite side
         */
        getOpp: function(angle, distance) {
            return Math.sin(angle / 360 * 2 * Math.PI) * distance;
        },

        /**
         * Get the length of the adjacent side of a triangle
         * @param {Number} angle The angle in degrees
         * @param {Number} distance The length of the hypotenuse
         * @returns {Number} The length of the adjacent side
         */
        getAdj: function(angle, distance) {
            return Math.cos(angle / 360 * 2 * Math.PI) * distance;
        },

        /**
         * Get the angle of a triangle from two of it's sides
         * @param {Number} opposite The length of the opposite side
         * @param {Number} adjacent The length of the adjacent side
         * @returns {Number} The angle in degrees
         */
        getAng: function(opposite, adjacent) {
            return Math.atan(opposite / adjacent) / (2 * Math.PI) * 360;
        },
    },
}



// Create Vue app
function createApp() {
    // Create app
    let app = Vue.createApp(App).mount("#app");

    // Unhide app divs
    document.getElementById("input").hidden = false;
    document.getElementById("output").hidden = false;
    document.getElementById("data").hidden = false;

    // Enable zooming
    let mobileZoomPanHandler = {
        haltEventListeners: ["touchstart", "touchend", "touchmove", "touchleave", "touchcancel"],
        init: function(options) {
            var instance = options.instance;
            let initialScale = 1;
            let pannedX = 0;
            let pannedY = 0;

            // Init Hammer
            // Listen only for pointer and touch events
            this.hammer = Hammer(options.svgElement, {
                inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
            });

            // Enable pinch
            this.hammer.get("pinch").set({enable: true});

            // Handle double tap
            this.hammer.on("doubletap", function(ev){
                instance.zoomIn()
            });

            // Handle pan
            this.hammer.on("panstart panmove", function(ev){
                // On pan start reset panned variables
                if (ev.type === "panstart") {
                    pannedX = 0;
                    pannedY = 0;
                }

                // Pan only the difference
                instance.panBy({x: ev.deltaX - pannedX, y: ev.deltaY - pannedY});
                pannedX = ev.deltaX;
                pannedY = ev.deltaY;
            })

            // Handle pinch
            this.hammer.on("pinchstart pinchmove", function(ev) {
                // Calculate true zoom center
                const el = ev.target;
                const rect = el.getBoundingClientRect();
                const pos = {
                    x: (ev.center.x - rect.left),
                    y: (ev.center.y - rect.top),
                };

                // On pinch start remember initial zoom
                if (ev.type === "pinchstart") {
                    initialScale = instance.getZoom();
                    instance.zoomAtPoint(initialScale * ev.scale, {x: pos.x, y: pos.y});
                }

                instance.zoomAtPoint(initialScale * ev.scale, {x: pos.x, y: pos.y});
            });

            // Prevent moving the page on some devices when panning over SVG
            options.svgElement.addEventListener("touchmove", function(e){ e.preventDefault(); });
        },

        destroy: function(){
            this.hammer.destroy();
        }
    }
    app.svg = svgPanZoom("svg", {
        dblClickZoomEnabled: false,
        minZoom: 0.1,
        maxZoom: 10,
        customEventsHandler: mobileZoomPanHandler,
    });
}
