const App = {
    data: function() {
        return {
            // Input data
            mass: 5,            // The object's mass (Kg)
            force: 5,           // The force acting on the object (N)
            staticFriction: 0,  // The coefficient of static friction
            kineticFriction: 0, // The coefficient of kinetic friction
            gravity: 9.8,       // The acceleration due to gravity (m/s/s)

            // Output data
            time: 0,            // The time (s)
            position: 0,        // The object's current position (m)
            velocity: 0,        // The object's current velocity (m/s)

            // Simulation properties
            active: false,      // Whether the simulation is active
            refreshRate: 0.01,  // The simulation refresh rate (s)
            intervalId: null,   // The value returned by setInterval
        }
    },
    computed: {
        /**
         * The force of static friction when the object is at rest
         */
        staticFrictionForce: function() {
            let maxForce = this.staticFriction * this.mass * this.gravity;
            if (Math.abs(this.force) <= maxForce) return -1 * this.force;
            else return Math.sign(this.force) * -1 * maxForce;
        },

        /**
         * The force of kinetic friction when the object is in motion
         */
        kineticFrictionForce: function() {
            let value = this.kineticFriction * this.mass * this.gravity;
            if (this.velocity > 0) return -1 * value;
            else if (this.velocity < 0) return value;
            else if (this.force > 0) return -1 * value;
            else if (this.force < 0) return value;
            else return 0;
        },

        /**
         * The net force on the object
         */
        netForce: function() {
            if (this.velocity === 0 && (Math.abs(this.staticFrictionForce) >= Math.abs(this.force) || Math.abs(this.kineticFrictionForce) >= Math.abs(this.force))) {
                // The object is at rest and cannot overcome friction
                return 0;
            }
            else {
                return this.force + this.kineticFrictionForce;
            }
        },

        /**
         * The acceleration of the object
         */
        acceleration: function() {
            return this.netForce / this.mass;
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
            this.position = 0;
            this.velocity = 0;
        },

        /**
         * Update the simulation
         */
        update: function() {
            // Update time
            this.time += this.refreshRate;
            
            // Get updated velocity
            let newVelocity = this.velocity + (this.acceleration * this.refreshRate)

            // Correct velocity for friction
            if (Math.sign(this.velocity) !== Math.sign(newVelocity)) {
                // The object was recently at rest
                this.velocity = 0;

                if (this.acceleration !== 0) {
                    // The object was able to overcome friction
                    this.velocity = newVelocity;
                }
            }
            else {
                // The object was not recently at rest
                this.velocity = newVelocity;
            }

            // Update position
            this.position += (this.velocity * this.refreshRate);
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
