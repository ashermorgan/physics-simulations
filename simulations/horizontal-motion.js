const App = {
    data: function() {
        return {
            mass: 5,            // The object's mass (Kg)
            initialVelocity: 1, // The object's initial velocity (m/s)
            force: 0,           // The force acting on the object (N)
            time: 0,            // The time (s)
            active: false,      // Whether the simulation is active
            refreshRate: 0.01,  // The simulation refresh rate (s)
            intervalId: null,   // The value returned by setInterval
        }
    },
    computed: {
        /**
         * The acceleration of the object
         */
        acceleration: function() {
            return this.force / this.mass;
        },

        /**
         * The velocity of the object
         */
        velocity: function() {
            return this.initialVelocity + (this.acceleration * this.time);
        },

        /**
         * The position of the object
         */
        position: function() {
            return (this.initialVelocity * this.time) + (0.5 * this.acceleration * this.time * this.time);
        },

        /**
         * The position of reference frame indicators
         */
        references: function() {
            return [
                (-1 * this.position) % 1,    // 1m
                (-1 * this.position) % 0.1,  // 0.1m
            ];
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
