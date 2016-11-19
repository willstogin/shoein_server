
/*

  Protocol:

  initial_auth

  subsequent_auth
  
 */



"use strict";

// Represents a device (implanted in a shoe)
class ShoeDevice {
    constructor(device_id,permanent_public_key) {
        // The unique identifier for the device
        this.device_id = device_id;
        // Used to ensure another device is not "spoofing"
        this.permanent_public_key;
        // 
        this.username = null;
        this.temporary_public_key = null;
        
    }
}



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
        // To start, we just pick a case.
        password_cb();
//        challenge_cb("perm_challenge","temp_challenge");
//        failure_cb();
    },

    // Identifies a shoe (specified by uid) with a user
    set_user: function(uid,user) {
        
    },

    // TODO SECURITY perhaps implement a delay here to prevent brute force (?)
    // Checks the response
    check_response: function(uid,perm_response,temp_response,success_cb,failure_cb) {
        
    }
};


