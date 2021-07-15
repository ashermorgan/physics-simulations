const App = {
    data: function() {
        return {
            mass: 5,            // The mass of the object (Kg)
            initialPosition: 5, // The object's initial position (m)
            stiffness: 5,       // The spring stiffness (N/m)
            time: 0,            // The time (s)
            active: false,      // Whether the simulation is active
            refreshRate: 0.01,  // The simulation refresh rate (s)
            intervalId: null,   // The value returned by setInterval
            infoVisible: false,
        }
    },
    computed: {
        /**
         * The period of the object
         */
        period: function() {
            if (this.initialPosition === 0) return 0;
            else return 2 * Math.PI * Math.sqrt(this.mass / this.stiffness);
        },

        /**
         * The position of the object
         */
        position: function() {
            if (this.initialPosition === 0) return 0;
            else return this.initialPosition * Math.cos(this.time * 2 * Math.PI / this.period);
        },

        /**
         * The velocity of the object
         */
        velocity: function() {
            if (this.initialPosition === 0) return 0;
            else return -1 * this.initialPosition * Math.sin(this.time * 2 * Math.PI / this.period) * 2 * Math.PI / this.period;
        },

        /**
         * The spring force
         */
        force: function() {
            return -1 * this.stiffness * this.position;
        },

        /**
         * The acceleration of the object
         */
        acceleration: function() {
            return this.force / this.mass;
        },
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
