const App = {
    data: function() {
        return {
            angle: 90,          // The angle of the 2nd weight (degrees)
            mass1: 1,           // The mass of the 1st weight (Kg)
            mass2: 10,          // The mass of the 2nd weight (Kg)
            gravity: 9.8,       // The acceleration due to gravity (m/s/s)
            time: 0,            // The time (s)
            active: false,      // Whether the simulation is active
            refreshRate: 0.01,  // The simulation refresh rate (s)
            intervalId: null,   // The value returned by setInterval
        }
    },
    computed: {
        /**
         * The net force on the 2nd weight
         */
        netForce: function() {
            let gravityX = this.getO(this.angle, this.mass2 * this.gravity);
            let netX = (this.mass1 * this.gravity) - gravityX;
            return netX;
        },

        /**
         * The acceleration of the 2nd weight
         */
        acceleration: function() {
            return this.netForce / (this.mass2 + this.mass1);
        },

        /**
         * The velocity of the 2nd weight
         */
        velocity: function() {
            return this.acceleration * this.time;
        },

        /**
         * The displacement of the 2nd weight
         */
        displacement: function() {
            let result = 0.5 * this.acceleration * this.time * this.time;
            if (result > 3) result = 3;
            if (result < -3) result = -3;
            if (Math.abs(result) === 3 && this.active) this.toggle();
            return result;
        },

        /**
         * The position of the 2nd weight
         */
        positionVector: function() {
            let x1 = this.getA(this.angle - 90, 1);
            let y1 = this.getO(this.angle - 90, 1);
            let x2 = this.getA(this.angle, - this.displacement + 3) + x1;
            let y2 = this.getO(this.angle, - this.displacement + 3) + y1;
            return [x1, y1, x2, y2];
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
        },

        /**
         * Update the simulation output
         */
        update: function() {
            this.time += this.refreshRate;
        },

        /**
         * Get the length of the opposite side of a triangle
         * @param {Number} angle The angle in degrees
         * @param {Number} distance The length of the hypotenuse
         * @returns {Number} The length of the opposite side
         */
        getO: function(angle, distance) {
            return Math.sin(angle / 360 * 2 * Math.PI) * distance;
        },

        /**
         * Get the length of the adjacent side of a triangle
         * @param {Number} angle The angle in degrees
         * @param {Number} distance The length of the hypotenuse
         * @returns {Number} The length of the adjacent side
         */
        getA: function(angle, distance) {
            return Math.cos(angle / 360 * 2 * Math.PI) * distance;
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
