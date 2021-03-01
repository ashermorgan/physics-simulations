const App = {
    data: function() {
        return {
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
         * The net force on the 1st weight
         */
        netForce: function() {
            return (this.mass1 * this.gravity) - (this.mass2 * this.gravity);
        },

        /**
         * The acceleration of the 1st weight
         */
        acceleration: function() {
            return this.netForce / (this.mass1 + this.mass2);
        },

        /**
         * The velocity of the 1st weight
         */
        velocity: function() {
            return this.acceleration * this.time;
        },

        /**
         * The heights of the weights
         */
        positions: function() {
            let position = 0.5 * this.acceleration * this.time * this.time;
            if (position > 3) position = 3;
            if (position < -3) position = -3;
            if (Math.abs(position) === 3 && this.active) this.toggle();
            return [position, -position];
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
