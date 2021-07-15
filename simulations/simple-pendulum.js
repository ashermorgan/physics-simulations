const App = {
    data: function() {
        return {
            radius: 5,          // The radius of the pendulum (m)
            initialAngle: 5,    // The initial angle of the pendulum (degrees)
            gravity: 9.8,       // The acceleration due to gravity (m/s/s)
            time: 0,            // The time (s)
            active: false,      // Whether the simulation is active
            refreshRate: 0.01,  // The simulation refresh rate (s)
            intervalId: null,   // The value returned by setInterval
            infoVisible: false,
        }
    },
    computed: {
        /**
         * The period of the pendulum
         */
        period: function() {
            if (this.initialAngle === 0) return 0;
            else return 2 * Math.PI * Math.sqrt(this.radius / this.gravity);
        },

        /**
         * The angle of the pendulum
         */
        angle: function() {
            if (this.initialAngle === 0) return 0;
            else return this.initialAngle * Math.cos(this.time * 2 * Math.PI / this.period);
        },

        /**
         * The position of the pendulum mass
         */
        position: function() {
            return {
                x: Math.sin(this.angle * 2 * Math.PI / 360) * this.radius,
                y: -Math.cos(this.angle * 2 * Math.PI / 360) * this.radius,
            };
        },

        /**
         * The acceleration of the pendulum mass
         */
        acceleration: function() {
            return -Math.sin(this.angle * 2 * Math.PI / 360) * this.gravity;
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
