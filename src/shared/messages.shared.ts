/* eslint-disable prettier/prettier */
export function messageFactory(message: string, msgParams?: string[]): string {
	let newMsg = message;
	if (msgParams && msgParams.length > 0) {
		msgParams.forEach((val, key) => {
			newMsg = newMsg.split(`ARG${key}`).join(val?.toString());
		});
	}
	return newMsg;
}

export const enum messages {
	//ARG0,ARG1 ... ARGn should be in sequence.

	//General messages : Start with Gn

	//Success messages : Start with Sn
	S1 = 'RPG-Raychem Auth API service is listening on ARG0.',
	S2 = 'RPG-Raychem Auth API service is up and running.',
	S3 = 'Connected to MSSQL server!',
	S4 = 'Success.',
	S5 = 'The user account registered successfully.',
	S6 = 'Logout successfully.',
	S7 = 'Default role updated successfully.',
	S8 = 'The jointer account registered successfully.',
	S9 = 'The user profile has been updated successfully.',
	S10 = 'Company registered successfully.',
	S11 = 'User updated successfully.',
	S12 = 'We appreciate your feedback on the jointer. Thank you for your rating!',
	S13 = 'Company information updated successfully.',
	S14 = 'OTP has been sent successfully.',
	S15 = 'Application is up & running.',
	S16 = 'OTP verified successfully.',
	S17 = 'Database is up & running',
	S18 = 'Archive files deleted successfully from blob storage.',
	S19 = 'OTP sent successfully through WhatsApp to the number ******ARG0.',
	S20 = 'OTP has been resent successfully. Please check your WhatsApp for the new code.',

	// Warning messages : Start with Wn
	W1 = 'Please provide a valid ARG0!',
	W2 = 'ARG0 should not be empty!',
	W3 = 'ARG0 should be a numeric value!',
	W4 = 'ARG0 should be a positive integer greater than zero.',
	W5 = 'ARG0 should be a string value.',
	W6 = 'ARG0 should not exceed more than ARG1 characters.',
	W7 = 'ARG0 should be a integer value.',
	W8 = 'The mobile number ARG0 is already linked to another account.',
	W9 = 'The email id provided is already linked to another account.',
	W10 = 'The mobile number is not registered. Verify the correct number.',
	W11 = 'Your account is disabled. Please contact the administrator.',
	W12 = 'The role you provided is not associated with your account.',
	W13 = 'At least one ARG0 must be provided',
	W14 = 'Duplicate ARG0 are not allowed',
	W15 = 'Sorry, We Could not Find Your Information.',
	W16 = 'The aadhar number provided is already linked to another account.',
	W17 = 'The raychem id provided is already linked to another account.',
	W18 = 'The resume size should not exceed ARG0 MB. Please make sure to upload an image within the specified size limit.',
	W19 = 'Uploaded file format is not allowed. Only ARG0 format is allowed!',
	W20 = 'Invalid date format',
	W21 = 'The provided device ID does not match our records. Please provide a valid device ID.',
	W22 = 'The minimum size of ARG0 array should be one',
	W23 = 'Confirm that all elements within ARG0 array are unique.',
	W24 = 'The provided company name is already exist.',
	W25 = 'You cannot fetch your own record.',
	W26 = 'ARG0 should be a positive integer less than five.',
	W27 = 'Invalid table name',
	W28 = 'Please ensure that the ARG0 you provide contains between 5 to 15 digits.',
	W29 = 'The primary mobile number and secondary mobile number cannot both be the same.',
	W30 = 'Each values in geographyInfo must be unique.',
	W31 = 'The provided city, division and unit is already linked with this company.',
	W32 = 'The provided city, division and unit cannot be repeated.',
	W33 = 'Ensure that all provided values are not empty.',
	W39 = 'Effective from should be less then Effective till date.',
	W40 = 'The provided mobile number is not registered.',
	W41 = 'Please provide valid country code',
	W42 = 'The ARG0 size should be a maximum of 6 digits.',
	W43 = 'You have already rated for this jointer.',
	W44 = 'Rating for this ticket is not allowed until it is completed.',
	W45 = 'The given ticket has not been assigned to this jointer.',
	W46 = 'The provided product, joint, sub joint and sub product cannot be repeated.',
	W47 = 'The provided ARG0 is already exit.',
	W48 = 'Only one value can be passed either sub joint or sub product, not both',
	W49 = 'ARG0 should be at least ARG1 characters.',
	W50 = 'Uploaded file format is not allowed. Only .png, .jpg and .pdf format is allowed!',
	W51 = 'The maximum size of ARG0 array should be ARG1',
	W52 = 'The ARG0 must contain a maximum of ARG1 properties.',
	W53 = 'You cannot update your own profile.',
	W54 = 'You can not switch to the same role.',
	W55 = 'You do not have permission to access this.',
	W56 = 'The selected product is active and can not be deleted until installation is complete.',
	W57 = 'Wrong or expired OTP (One Time Password). Please try again!',
	W58 = 'IP address mismatch detected. Please retry from the same device and network for security reasons.',
	W59 = 'Invalid request: The provided information not found.',
	W60 = 'Resend limit reached. Please try again after some time.',
	W61 = 'Invalid Request.',

	//Error messages : Start with Subscription
	E1 = '<NAME> service start failed! :: ARG0.',
	E2 = 'Oops! An error occurred while processing your request.',
	E3 = 'Unauthorized request! The provided token is empty or invalid.',
	E4 = 'An error occurred while establishing connection to MSSQL server! (ERROR :: ARG0).',
	E5 = 'MSSQL database connection disconnected through app termination!',
	E6 = 'Error closing MSSQL database connection! (ERROR :: ARG0)!',
	E7 = 'We are sorry, but you do not have access to this resource [ARG0]!',
	E8 = 'ARG0 "ARG1" not supported.',
	E9 = 'We regret to inform you that an error occurred while authenticating your credentials. Please retry the authentication process!',
	E10 = 'User session not found.',
	E11 = 'Error while fetching appRegistration access token.',
	E12 = 'Error occurred  while fetching CurrencyCode.',
	E13 = 'Unauthorized request!',
	E15 = 'Registration for the Jointer role is restricted.',
	E16 = `You can't create both Customer and Raychem Management roles simultaneously.`,
	E17 = 'The default Role passed does not match.',
	E18 = 'Registration for a customer role, please note that a Company Name is required.',
	E19 = 'The registration for a ARG0 account is not permitted.',
	E20 = 'Assigning the super admin role is prohibited.',
	E21 = 'Please ensure roles are accurately passed.',
	E22 = 'The server is currently under maintenance. Please try again later.',

	//Title of mail
	T1 = 'User Registration',
	T2 = 'Jointer Registration',
	T3 = 'Complete Your Mobile Number Update with OTP Verification.',
	T4 = 'Complete Your Email Update with OTP Verification.'
}
