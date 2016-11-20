

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
    // The new temp_pk (to set if the response matches)
    this.new_temp_pk = temp_pk;
    // Determines whether the device successfully authenticated
    this.auth_successful = false;
}

var shoeDevices = {};
var token_to_uid_map = {};

module.exports = {
    
    /*
      list of callbacks
      
      + password_cb() // called when (perm_pk matches, but tmp_pk changed) or (new uid) or (shoeDevice.user==null)
      +   load user login page
      +   when user logs in
      + challenge_cb(perm_challenge,temp_challenge) // called when perm_pk and temp_pk match
      + failure_cb(err) // called when perm_pk does not match
      +   serve error (device not recognized)
    */
    request_challenge: function(token,uid,perm_pk,temp_pk,password_cb,challenge_cb,failure_cb) {
        token_to_uid_map[token] = uid;
        if (uid in shoeDevices) {
            // The device has connected before.
            var shoeDevice = shoeDevices[uid];
            // Reset the authentication state of the shoe
            shoeDevice.auth_successful = false;
            if (shoeDevice.perm_pk === perm_pk) {
                // The device is legitimate.
                if (!shoeDevice.user) {
                    // The device is not associated to a user.
                    shoeDevice.new_temp_pk = temp_pk;
                    return password_cb();
                }
                if (shoeDevice.temp_pk == temp_pk) {
                    // The shoe hasn't been taken off since the last time
                    // TODO SECURITY build the challenge
                    shoeDevice.required_perm_response = "aaa";
                    shoeDevice.required_temp_response = "bbb";
                    shoeDevice.new_temp_pk = temp_pk;
                    challenge_cb("aaa","bbb");
                } else {
                    // The shoe was taken off since the last time
                    shoeDevice.new_temp_pk = temp_pk;
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
            console.log(shoeDevice.required_perm_response);
            console.log(shoeDevice.required_temp_response);
            console.log(perm_response);
            console.log(temp_response);
            if ((perm_response === shoeDevice.required_perm_response)
                && (temp_response === shoeDevice.required_temp_response)) {
                // since the response is valid, set the new temp pk
                shoeDevice.temp_pk = shoeDevice.new_temp_pk;
                shoeDevice.auth_successful = true;
                success_cb(shoeDevice.user);
            } else {
                failure_cb();
            }
        } else {
            console.log("Got a check_response for a shoe that wasn't registered. This should not happen.");
            failure_cb();
        }
    },

    shoe_disconnected: function(token) {
        if (token in token_to_uid_map) {
            var uid = token_to_uid_map[token];
            if (uid in shoeDevices) {
                var shoeDevice = shoeDevices[uid];
                if (shoeDevice) {
                    // Reset the authentication state of the shoe
                    shoeDevice.auth_successful = false;
                }
            }
        }
        token_to_uid_map[token] = null;
    },
    
    
    // Identifies a shoe (specified by uid) with a user
    set_user: function(token,user) {
        if (token in token_to_uid_map) {
            var uid = token_to_uid_map[token];
            if (uid in shoeDevices) {
                var shoeDevice = shoeDevices[uid];
                if (shoeDevice) {
                    shoeDevice.temp_pk = shoeDevice.new_temp_pk;
                    shoeDevice.user = user;
                }
            }
        }
    },

    // Determines whether a user can log in based on the device being connected.
    get_device_user_if_authenticated: function(token) {
        if (token in token_to_uid_map) {
            var uid = token_to_uid_map[token];
            if (uid in shoeDevices) {
                var shoeDevice = shoeDevices[uid];
                if (shoeDevice)
                    if (shoeDevice.auth_successful)
                        return shoeDevice.user;
            }
        }
        return null;
    },
    
};


