const App = {
    data: function() {
        return {
            mass: 5,            // The object's mass (Kg)
            force: 5,           // The centripetal force on the object (N)
            radius: 1,          // The radius of the circle (m)
            time: 0,            // The time (s)
            active: false,      // Whether the simulation is active
            refreshRate: 0.01,  // The simulation refresh rate (s)
            intervalId: null,   // The value returned by setInterval
            infoVisible: false,
        }
    },
    computed: {
        /**
         * The speed of the object
         */
        speed: function() {
            return Math.sqrt((this.force * this.radius) / this.mass);
        },

        /**
         * The circumference of the circle
         */
        circumference: function() {
            return 2 * Math.PI * this.radius;
        },

        /**
         * The time it takes the object to complete 1 rotation
         */
        period: function() {
            return this.circumference / this.speed;
        },

        /**
         * The angle of the object as a percentage (0 - 1)
         */
        angle: function() {
            return ((this.time * this.speed) / this.circumference) % 1;
        },

        /**
         * The coordinates of the object
         */
        position: function() {
            let x = this.getX(this.angle, this.radius);
            let y = this.getY(this.angle, this.radius);
            return [x, y];
        },

        /**
         * The coordinates of the velocity vector
         */
        velocityVector: function() {
            let x = this.getX(this.angle + 0.25, (0.25 * this.speed * this.radius) + 0.1);
            let y = this.getY(this.angle + 0.25, (0.25 * this.speed * this.radius) + 0.1);
            let arrow1x = x - this.getX(this.angle + 0.35, 0.02);
            let arrow1y = y - this.getY(this.angle + 0.35, 0.02);
            let arrow2x = x - this.getX(this.angle + 0.15, 0.02);
            let arrow2y = y - this.getY(this.angle + 0.15, 0.02);
            return [
                x       + this.position[0],       y + this.position[1], // Center point
                arrow1x + this.position[0], arrow1y + this.position[1], // Arrow line #1
                arrow2x + this.position[0], arrow2y + this.position[1], // Arrow line #2
            ];
        },

        /**
         * The coordinates of the centripetal force vector
         */
        forceVector: function() {
            let x = this.getX(this.angle, (0.9 - (0.08 * this.force)) * this.radius);
            let y = this.getY(this.angle, (0.9 - (0.08 * this.force)) * this.radius);
            let arrow1x = x + this.getX(this.angle + 0.1, 0.02);
            let arrow1y = y + this.getY(this.angle + 0.1, 0.02);
            let arrow2x = x + this.getX(this.angle - 0.1, 0.02);
            let arrow2y = y + this.getY(this.angle - 0.1, 0.02);
            return [
                x,       y,         // Center point
                arrow1x, arrow1y,   // Arrow line #1
                arrow2x, arrow2y,   // Arrow line #2
            ];
        }
    },
    methods: {
        /**
         * Handle a keyup event (implements keyboard shortcuts)
         * @param {object} e - The event args
         */
        keyup: function(e) {
            if (e.key === "Escape") {
                if (this.infoVisible) this.infoVisible = false;
                else window.location.href = "../";
            }
        },

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
        },

        /**
         * Update the simulation output
         */
        update: function() {
            this.time += this.refreshRate;
        },

        /**
         * Get the C coordinate of a point from an angle and distance
         * @param {Number} angle The angle as a percentage (0 - 1)
         * @param {Number} distance The distance
         * @returns {Number} The X coordinate
         */
        getX: function(angle, distance) {
            return Math.sin(angle * 2 * Math.PI) * distance;
        },

        /**
         * Get the Y coordinate of a point from an angle and distance
         * @param {Number} angle The angle as a percentage (0 - 1)
         * @param {Number} distance The distance
         * @returns {Number} The Y coordinate
         */
        getY: function(angle, distance) {
            return -Math.cos(angle * 2 * Math.PI) * distance;
        },
    },
    created: function() {
        // Add keyup handler
        window.addEventListener("keyup", this.keyup);
    },
    destroyed: function() {
        // Remove keyup handler
        window.removeEventListener("keyup", this.keyup);
    },
}



// Create Vue app
function createApp() {
    // Create app
    Vue.createApp(App).mount("#app");

    // Unhide app divs
    document.getElementById("input").hidden = false;
    document.getElementById("output").hidden = false;
    document.getElementById("data").hidden = false;
    document.getElementById("info").hidden = false;
}
