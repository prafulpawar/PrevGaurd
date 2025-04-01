// services/otpService.js
// !! YEH SIRF EK EXAMPLE HAI !!
// Asal mein yahaan aap Twilio, AWS SNS, Firebase, ya kisi aur service ka SDK use karenge.

/**
 * Simulates sending an OTP via a third-party service.
 * @param {string} destination - The email address or phone number to send OTP to.
 * @returns {Promise<boolean>} - True if sending was initiated successfully, false otherwise.
 */
const sendOtp = async (destination) => {
    console.log(`[Mock OTP Service] Sending OTP to ${destination}...`);
    // Asal logic: Call third-party API (e.g., Twilio)
    // Example: await twilio.verify.v2.services(verifySid).verifications.create({to: destination, channel: 'email'});
    // Hum yahaan hamesha success maan rahe hain for simplicity.
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network delay
    console.log(`[Mock OTP Service] OTP supposedly sent to ${destination}.`);
    return true; // Assume service accepted the request
  };
  
  /**
   * Simulates verifying an OTP via a third-party service.
   * @param {string} destination - The email address or phone number associated with the OTP.
   * @param {string} otp - The OTP code entered by the user.
   * @returns {Promise<boolean>} - True if OTP is valid, false otherwise.
   */
  const verifyOtp = async (destination, otp) => {
    console.log(`[Mock OTP Service] Verifying OTP ${otp} for ${destination}...`);
    // Asal logic: Call third-party API (e.g., Twilio)
    // Example: const check = await twilio.verify.v2.services(verifySid).verificationChecks.create({to: destination, code: otp});
    // Hum yahaan check karenge ki OTP '123456' hai ya nahi (sirf testing ke liye)
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network delay
    const isValid = otp === '123456'; // Dummy check - Replace with actual service call result
    console.log(`[Mock OTP Service] OTP ${otp} for ${destination} is ${isValid ? 'Valid' : 'Invalid'}.`);
    return isValid; // Return result from the service (e.g., check.status === 'approved')
  };
  
  module.exports = {
    sendOtp,
    verifyOtp,
  };