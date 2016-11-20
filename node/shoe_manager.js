

"use strict";

function ShoeDevice(uid,perm_pk,temp_pk) {
    this.uid = uid;
    this.perm_pk = perm_pk;
    this.temp_pk = temp_pk;
    // The user associated to the shoe
    this.user = null;
    // Compare these in check_response
    this.required_perm_response = "";
    this.required_temp_response = "";
}

var shoeDevices = {};

module.exports = {
    
    /*
      list of callbacks
      
      + password_cb() // called when perm_pk matches, but tmp_pk changed or new uid
      +   load user login page
      +   when user logs in, 
      + challenge_cb(perm_challenge,temp_challenge) // called when perm_pk and temp_pk match
      + failure_cb(err) // called when perm_pk does not match
      +   serve error (device not recognized)
    */
    request_challenge: function(uid,perm_pk,temp_pk,password_cb,challenge_cb,failure_cb) {
        if (uid in shoeDevices) {
            // The device has connected before.
            var shoeDevice = shoeDevices[uid];
            if (shoeDevice.perm_pk === perm_pk) {
                // The device is legitimate.
                if (shoeDevice.temp_pk == temp_pk) {
                    // The device hasn't been removed since the last time
                    // TODO SECURITY build the challenge
                    shoeDevice.required_perm_response = "aaa";
                    shoeDevice.required_temp_response = "bbb";
                    challenge_cb("aaa","bbb");
                } else {
                    // The device was removed since the last time
                    password_cb();
                }
            } else {
                // The device is a fraud!
                failure_cb();
            }
        } else {
            // The device connected for the first time.
            shoeDevices[uid] = new ShoeDevice(uid,perm_pk,temp_pk);
            password_cb();
        }
    },
    
    // TODO SECURITY perhaps implement a delay here to prevent brute force (?)
    // Checks the response
    check_response: function(uid,perm_response,temp_response,success_cb,failure_cb) {
        if (uid in shoeDevices) {
            var shoeDevice = shoeDevices[uid];
            if ((perm_response === shoeDevice.required_perm_response)
                && (temp_response === shoeDevice.required_temp_response)) {
                success_cb(shoeDevice.user);
            } else {
                failure_cb();
            }
        } else {
            console.log("Got a check_response for a shoe that wasn't registered. This should not happen.");
            failure_cb();
        }
    },
    
    
    // Identifies a shoe (specified by uid) with a user
    set_user: function(uid,user) {
        
    },
    
};


