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
         * The current velocity of the projectile.
         */
        velocity: function() {
            let x = this.getAdj(this.angle, this.initialVelocity);
            let y = this.getOpp(this.angle, this.initialVelocity) - (this.gravity * this.time);
            let total = Math.sqrt(x*x + y*y);
            let angle = total != 0 ? this.getAng(y, x) : 0;
            return {x, y, total, angle};
        },
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
    Vue.createApp(App).mount("#app");

    // Unhide app divs
    document.getElementById("input").hidden = false;
    document.getElementById("output").hidden = false;
    document.getElementById("data").hidden = false;
}
